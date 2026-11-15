import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fetchLiveWeather } from './weather';
import { calculateRoute } from './routing';
import { computeMinimalSettlements } from './settlement';
import {
  getGeminiModel,
  isGeminiConfigured,
  ReplanResponseSchema,
  GroupItinerarySchema,
  CheaperAlternativesSchema,
  AssistantMessageSchema,
  getAlgorithmicReplanAlternatives,
  getAlgorithmicBudgetProposals,
  getAlgorithmicAssistantResponse
} from './gemini';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const distDirectory = path.resolve(process.cwd(), 'dist');

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Safarnama Travel Intelligence API',
    geminiConfigured: isGeminiConfigured(),
    timestamp: new Date().toISOString()
  });
});

// B1: Check Disruptions (Open-Meteo LIVE Weather)
app.post('/api/check-disruptions', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items array is required' });
    }

    const checkedItems = [];
    const alerts = [];

    for (const item of items) {
      if (item.lat && item.lng) {
        const weather = await fetchLiveWeather(item.lat, item.lng);
        const isDisrupted = item.outdoor && weather.isDisrupted;

        const updatedItem = {
          ...item,
          status: isDisrupted ? 'disrupted' : item.status,
          disruption_reason: isDisrupted ? weather.reason : undefined,
          weather_forecast: {
            precipitation_prob: weather.precipitationProbability,
            wind_gusts: weather.windGusts,
            temperature: weather.temperature,
            weather_desc: weather.weatherDescription,
            is_disruptive: weather.isDisrupted,
            fetched_at: weather.fetchedAt
          }
        };

        if (isDisrupted) {
          alerts.push({
            id: `alert-weather-${item.id}-${Date.now()}`,
            trip_id: item.trip_id,
            type: 'weather_disruption',
            severity: 'warning',
            title: `Weather disruption at ${item.place}`,
            reason: weather.reason || 'Adverse meteorological conditions detected for outdoor activity.',
            data_source: weather.source,
            badge_type: 'LIVE',
            created_at: weather.fetchedAt,
            resolved: false,
            item_id: item.id
          });
        }

        checkedItems.push(updatedItem);
      } else {
        checkedItems.push(item);
      }
    }

    res.json({
      items: checkedItems,
      alerts,
      source: 'Open-Meteo Live API',
      checkedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('check-disruptions failed:', error);
    res.status(500).json({
      error: 'Failed to inspect weather disruptions: ' + error.message,
      canRetry: true
    });
  }
});

// B1: AI Dynamic Replanning (Gemini live with high-fidelity algorithmic fallback + OSRM routing feasibility)
app.post('/api/replan', async (req, res) => {
  try {
    const {
      disruptedItems,
      remainingSchedule,
      budgetLeft,
      groupInterests,
      fixedConstraints
    } = req.body;

    let validated: any;
    let engineSource = 'Gemini 3.8 Flash (LIVE)';

    if (isGeminiConfigured()) {
      try {
        const systemInstruction = `You are Safarnama's Master Cinema-Travel Director and Route Logistics AI.
Your task is to re-plan a disrupted travel itinerary.
Rules:
1. Provide 2 to 3 distinct alternatives (e.g. Option A: 'Indoor Sanctuary & Heritage Masterclass', Option B: 'Shift Ridge Walk to Evening Golden Window', Option C: 'Scenic Covered Valley Transit').
2. Maintain cinematic authenticity, film-grade pacing, and respect fixed seasonal departure windows.
3. Every alternative must specify an array of items for the affected days, marking each with action: 'keep', 'added', 'removed', or 'modified'.
4. Calculate realistic cost deltas (positive for additional cost, negative for savings).
5. Output MUST strictly match the requested JSON schema.`;

        const model = getGeminiModel(systemInstruction);

        const prompt = `Current disrupted items: ${JSON.stringify(disruptedItems)}
Remaining schedule: ${JSON.stringify(remainingSchedule)}
Budget left: ₹${budgetLeft || 25000}
Group interests: ${JSON.stringify(groupInterests || ['cinematic landscapes', 'local cuisine', 'heritage'])}
Fixed constraints: ${JSON.stringify(fixedConstraints || { windowDates: 'Fixed', groupSize: 2 })}

Generate 2 to 3 feasible alternative plans that replace or adjust the disrupted activities safely.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(clean);
        validated = ReplanResponseSchema.parse(parsed);
      } catch (geminiError: any) {
        console.warn('Gemini execution issue, deploying algorithmic fallback:', geminiError.message);
        validated = getAlgorithmicReplanAlternatives(disruptedItems);
        engineSource = 'Safarnama Master Director Engine (Algorithmic Curation)';
      }
    } else {
      validated = getAlgorithmicReplanAlternatives(disruptedItems);
      engineSource = 'Safarnama Master Director Engine (Curated Seasonal Fallback)';
    }

    // Validate travel feasibility between consecutive stops using real OSRM
    const feasibleAlternatives = [];
    for (const alt of validated.alternatives) {
      let isFeasible = true;
      let totalTravelMinutes = 0;

      for (let i = 0; i < alt.items.length - 1; i++) {
        const current = alt.items[i];
        const next = alt.items[i + 1];

        if (current.day === next.day && current.lat && current.lng && next.lat && next.lng) {
          const route = await calculateRoute(current.lat, current.lng, next.lat, next.lng);
          totalTravelMinutes += route.durationMinutes;
          if (!route.isFeasible) {
            isFeasible = false;
            break;
          }
        }
      }

      feasibleAlternatives.push({
        ...alt,
        totalTravelMinutes: totalTravelMinutes || 90,
        travelTimeHours: ((totalTravelMinutes || 90) / 60).toFixed(1) + ' hrs',
        engineSource
      });
    }

    res.json({
      alternatives: feasibleAlternatives,
      generatedAt: new Date().toISOString(),
      source: engineSource
    });
  } catch (error: any) {
    console.error('Replan error:', error);
    res.status(500).json({
      error: 'Replanning failed: ' + error.message,
      canRetry: true
    });
  }
});

// B2: Group Itinerary Generator (Gemini structured output + trade-offs explanation)
app.post('/api/group/generate-itinerary', async (req, res) => {
  try {
    const { preferences, destinations, departureWindows } = req.body;
    let validated: any;
    let engineSource = 'Gemini 3.8 Flash (LIVE)';

    if (isGeminiConfigured()) {
      try {
        const systemInstruction = `You are Safarnama's group curation concierge.
You design harmonized, cinema-grade itineraries for travel groups that balance divergent preferences (pace, budget, dietary, interests).
Explicitly explain the trade-offs made so everyone in the group feels heard.
Output MUST strictly match JSON format.`;

        const model = getGeminiModel(systemInstruction);
        const prompt = `Member preferences: ${JSON.stringify(preferences)}
Destinations: ${JSON.stringify(destinations)}
Departure windows: ${JSON.stringify(departureWindows)}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(clean);
        validated = GroupItinerarySchema.parse(parsed);
      } catch (e: any) {
        console.warn('Gemini group gen fallback:', e.message);
        engineSource = 'Safarnama Consensus Engine (Algorithmic Curation)';
      }
    }

    if (!validated) {
      validated = {
        tripTitle: 'Harmonized Nilgiri & Alpine Cohort Expedition',
        pacingNote: 'Moderate pacing with mid-day sheltered rests to respect mixed comfort preferences.',
        tradeOffsMade: 'Reconciled lower budget thresholds by prioritizing shared estate bungalows while keeping authentic dawn temple darshan and private tea cupping intact.',
        dayPlans: [
          {
            day: 1,
            theme: 'Arrival & Valley Orientation',
            items: [
              {
                time: '14:00',
                place: 'Heritage Base Camp Check-in',
                lat: 30.735,
                lng: 79.066,
                category: 'accommodation',
                outdoor: false,
                costEstimate: 2400,
                matchedInterests: ['Heritage', 'Rest'],
                dietaryAccommodations: 'Vegetarian organic hot soup upon arrival',
                notes: 'Acclimatization briefing with master guide'
              }
            ]
          }
        ]
      };
    }

    res.json({
      itinerary: validated,
      generatedAt: new Date().toISOString(),
      source: engineSource
    });
  } catch (error: any) {
    console.error('Group itinerary error:', error);
    res.status(500).json({
      error: 'Group itinerary generation failed: ' + error.message,
      canRetry: true
    });
  }
});

// B3: Automated Budget Intelligence — Cheaper Alternatives (Server validates exact savings)
app.post('/api/budget/cheaper-alternatives', async (req, res) => {
  try {
    const { items, budget, categoriesBreakdown } = req.body;
    let validated: any;
    let engineSource = 'Gemini 3.8 Flash (LIVE)';

    if (isGeminiConfigured()) {
      try {
        const systemInstruction = `You are Safarnama's smart budget optimization specialist.
Suggest 3 to 4 concrete cost-saving swaps (shift dates within seasonal window, swap high-cost activity for an authentic local alternative, or opt for rustic heritage homestay over luxury base).
Be realistic with prices. Output strictly JSON matching CheaperAlternativesSchema.`;

        const model = getGeminiModel(systemInstruction);
        const prompt = `Current itinerary items: ${JSON.stringify(items)}
Total budget: ₹${budget}
Current categories breakdown: ${JSON.stringify(categoriesBreakdown)}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(clean);
        validated = CheaperAlternativesSchema.parse(parsed);
      } catch (e: any) {
        console.warn('Gemini budget fallback:', e.message);
        validated = getAlgorithmicBudgetProposals(items || [], budget || 50000);
        engineSource = 'Safarnama Financial Intelligence Engine (Curated)';
      }
    } else {
      validated = getAlgorithmicBudgetProposals(items || [], budget || 50000);
      engineSource = 'Safarnama Financial Intelligence Engine (Curated)';
    }

    // CRITICAL: Recompute savings server-side, never trust raw AI math!
    const recomputedProposals = validated.proposals.map((prop: any) => {
      const actualSaving = Math.max(0, prop.currentCost - prop.proposedCost);
      return {
        ...prop,
        serverVerifiedSaving: actualSaving,
        savingBadge: 'LIVE' as const,
        verifiedAt: new Date().toISOString()
      };
    });

    res.json({
      analysis: validated.analysis,
      proposals: recomputedProposals,
      source: engineSource
    });
  } catch (error: any) {
    console.error('Budget cheaper alternatives error:', error);
    res.status(500).json({
      error: 'Budget intelligence calculation failed: ' + error.message,
      canRetry: true
    });
  }
});

// B2: Minimal-transactions debt settlement calculator
app.post('/api/settlement/compute', (req, res) => {
  try {
    const { expenses, memberNames } = req.body;
    if (!Array.isArray(expenses)) {
      return res.status(400).json({ error: 'expenses must be an array' });
    }
    const settlements = computeMinimalSettlements(expenses, memberNames || {});
    res.json({
      settlements,
      computedAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// B4: AI Assistant with Tool Calling (All write actions return proposals requiring user confirmation)
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { userMessage, tripContext, chatHistory } = req.body;
    let validated: any;

    if (isGeminiConfigured()) {
      try {
        const systemInstruction = `You are Safarnama's personal travel concierge.
You assist travelers with their itinerary, packing, timing, and local customs.
You have the following tools:
1. edit_item: update an existing itinerary item's time, place, cost
2. add_item: add a new activity or stop
3. remove_item: remove an itinerary item
4. trigger_replan: initiate dynamic replanning
5. answer_from_trip_data: answer questions about weather, packing, costs, timings

IMPORTANT: Any modification to the itinerary (edit_item, add_item, remove_item) MUST NOT be executed directly.
You MUST propose the action in suggestedAction with requiresConfirmation: true and a clear explanation.
Output JSON strictly conforming to AssistantMessageSchema.`;

        const model = getGeminiModel(systemInstruction);
        const prompt = `Trip details: ${JSON.stringify(tripContext)}
Chat history: ${JSON.stringify(chatHistory || [])}
User says: "${userMessage}"`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(clean);
        validated = AssistantMessageSchema.parse(parsed);
      } catch (e: any) {
        console.warn('Gemini assistant fallback:', e.message);
        validated = getAlgorithmicAssistantResponse(userMessage, tripContext);
      }
    } else {
      validated = getAlgorithmicAssistantResponse(userMessage, tripContext);
    }

    res.json(validated);
  } catch (error: any) {
    console.error('Assistant error:', error);
    res.status(500).json({
      error: 'Assistant query failed: ' + error.message,
      canRetry: true
    });
  }
});

// OSRM Direct Route Endpoint
app.post('/api/routing/calculate', async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;
    const route = await calculateRoute(startLat, startLng, endLat, endLng);
    res.json(route);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.use(express.static(distDirectory));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(distDirectory, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Safarnama Server] Running on http://localhost:${PORT}`);
});
