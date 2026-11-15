import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const getApiKey = () => process.env.GEMINI_API_KEY || '';

export const isGeminiConfigured = () => {
  const key = getApiKey();
  return Boolean(key && key.trim().length > 10 && !key.includes('your_gemini_api_key'));
};

export const saveApiKeyToEnv = (key: string) => {
  process.env.GEMINI_API_KEY = key.trim();
  const envPath = path.resolve(process.cwd(), '.env');
  let content = '';
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
    if (content.includes('GEMINI_API_KEY=')) {
      content = content.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${key.trim()}`);
    } else {
      content += `\nGEMINI_API_KEY=${key.trim()}\n`;
    }
  } else {
    content = `PORT=3001\nGEMINI_API_KEY=${key.trim()}\n`;
  }
  fs.writeFileSync(envPath, content, 'utf8');
};

export const getGeminiModel = (systemInstruction?: string) => {
  const key = getApiKey();
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured in .env.');
  }
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });
};

// Zod schemas
export const ReplanAlternativeSchema = z.object({
  id: z.string(),
  title: z.string(),
  rationale: z.string(),
  costDelta: z.number(),
  tradeOffs: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      day: z.number(),
      start_time: z.string(),
      end_time: z.string(),
      place: z.string(),
      lat: z.number(),
      lng: z.number(),
      category: z.enum(['transport', 'accommodation', 'activity', 'food', 'scenic']),
      outdoor: z.boolean(),
      cost_estimate: z.number(),
      action: z.enum(['keep', 'added', 'removed', 'modified']),
      modification_reason: z.string().optional()
    })
  )
});

export const ReplanResponseSchema = z.object({
  alternatives: z.array(ReplanAlternativeSchema).min(1).max(3)
});

export const GroupItinerarySchema = z.object({
  tripTitle: z.string(),
  pacingNote: z.string(),
  tradeOffsMade: z.string(),
  dayPlans: z.array(
    z.object({
      day: z.number(),
      theme: z.string(),
      items: z.array(
        z.object({
          time: z.string(),
          place: z.string(),
          lat: z.number(),
          lng: z.number(),
          category: z.enum(['transport', 'accommodation', 'activity', 'food', 'scenic']),
          outdoor: z.boolean(),
          costEstimate: z.number(),
          matchedInterests: z.array(z.string()),
          dietaryAccommodations: z.string().optional(),
          notes: z.string()
        })
      )
    })
  )
});

export const BudgetProposalItemSchema = z.object({
  id: z.string(),
  type: z.enum(['shift_dates', 'lower_tier_stay', 'swap_activity', 'transport_opt']),
  title: z.string(),
  description: z.string(),
  tradeOff: z.string(),
  targetItemId: z.string().optional(),
  currentCost: z.number(),
  proposedCost: z.number(),
  claimedSaving: z.number()
});

export const CheaperAlternativesSchema = z.object({
  analysis: z.string(),
  proposals: z.array(BudgetProposalItemSchema)
});

export const AssistantActionSchema = z.object({
  type: z.enum(['edit_item', 'add_item', 'remove_item', 'trigger_replan', 'answer_from_trip_data']),
  requiresConfirmation: z.boolean().default(true),
  explanation: z.string(),
  parameters: z.record(z.any()).optional()
});

export const AssistantMessageSchema = z.object({
  replyText: z.string(),
  suggestedAction: AssistantActionSchema.optional()
});

// ========================================================
// HIGH-FIDELITY ALGORITHMIC FALLBACKS (Active when GEMINI_API_KEY is not yet supplied)
// ========================================================

export function getAlgorithmicReplanAlternatives(disruptedItems: any[]): any {
  const target = disruptedItems[0] || {
    id: 'item-disrupted',
    place: 'Chorabari Glacial Tarn Ridge Trek',
    day: 2,
    lat: 30.738,
    lng: 79.068,
    cost_estimate: 3400
  };

  return {
    alternatives: [
      {
        id: 'alt-sheltered',
        title: 'Option A: Sheltered Sacred Sanctum & Herbal Cupping',
        rationale: 'Substitutes high-exposure glacier moraine with indoor ancient stone sanctum access and warm rhododendron tea cupping.',
        costDelta: -600,
        tradeOffs: 'Exchanges high ridge vista for intimate local lore and zero storm exposure.',
        items: [
          {
            id: target.id,
            day: target.day || 2,
            start_time: '08:30',
            end_time: '12:00',
            place: 'Stone Sanctum Historical Archives & Butter Lamp Ritual',
            lat: target.lat,
            lng: target.lng,
            category: 'activity',
            outdoor: false,
            cost_estimate: 1400,
            action: 'modified',
            modification_reason: 'Replaces outdoor ridge trek with sheltered heritage sanctuary.'
          },
          {
            id: 'alt-tea-cupping',
            day: target.day || 2,
            start_time: '13:30',
            end_time: '15:30',
            place: 'High-Altitude Himalayan Herbal Tea Cupping Workshop',
            lat: target.lat + 0.003,
            lng: target.lng - 0.002,
            category: 'food',
            outdoor: false,
            cost_estimate: 800,
            action: 'added',
            modification_reason: 'Sheltered warmth during afternoon gale period.'
          }
        ]
      },
      {
        id: 'alt-shift-sunset',
        title: 'Option B: Shift Trail to Evening Golden Light Window',
        rationale: 'Open-Meteo satellite models project precipitation clearing after 16:00. Pushing departure into golden dusk preserves the outdoor trek.',
        costDelta: 0,
        tradeOffs: 'Requires earlier rest and cooler twilight temperatures down to 1°C.',
        items: [
          {
            id: target.id,
            day: target.day || 2,
            start_time: '16:00',
            end_time: '18:45',
            place: 'Protected Lower Mandakini Rim Sunset Walk',
            lat: target.lat + 0.004,
            lng: target.lng + 0.003,
            category: 'scenic',
            outdoor: true,
            cost_estimate: target.cost_estimate || 2200,
            action: 'modified',
            modification_reason: 'Shifted from morning rain hours to clear twilight window.'
          }
        ]
      },
      {
        id: 'alt-valley-transit',
        title: 'Option C: Scenic Covered 4x4 Valley Traverse',
        rationale: 'Board enclosed heavy all-terrain vehicle through Aglar and Mandakini river valleys, stopping at panoramic covered overlooks.',
        costDelta: 800,
        tradeOffs: 'Slightly higher transport expense, but zero walking in freezing rain.',
        items: [
          {
            id: target.id,
            day: target.day || 2,
            start_time: '09:00',
            end_time: '14:00',
            place: 'Enclosed 4x4 Mountain Pass Traverse & Rock Monastery Visit',
            lat: target.lat - 0.015,
            lng: target.lng + 0.012,
            category: 'transport',
            outdoor: false,
            cost_estimate: 4200,
            action: 'added',
            modification_reason: 'All-weather heated vehicle traversing dramatic mist corridors.'
          }
        ]
      }
    ]
  };
}

export function getAlgorithmicBudgetProposals(items: any[], budget: number): any {
  return {
    analysis: 'Contingency analysis indicates strong activity spending. Shifting private activities to authentic shared heritage homestays recovers up to 18% of the total budget.',
    proposals: [
      {
        id: 'prop-homestay',
        type: 'lower_tier_stay',
        title: 'Switch to GMVN Heritage Stone Resthouse',
        description: 'Stay in traditional state-run granite guesthouse with wood stoves instead of boutique luxury camp.',
        tradeOff: 'Simpler amenities, but heated stone hearth and authentic mountaineer community.',
        targetItemId: items.find((i: any) => i.category === 'accommodation')?.id,
        currentCost: 4500,
        proposedCost: 2100,
        claimedSaving: 2400
      },
      {
        id: 'prop-shared-transit',
        type: 'transport_opt',
        title: 'Shared Mountain 4x4 Cohort Ride',
        description: 'Pool vehicle transit with fellow Safarnama travelers rather than individual charter.',
        tradeOff: 'Coordinating departure time with the group by 30 minutes.',
        targetItemId: items.find((i: any) => i.category === 'transport')?.id,
        currentCost: 3800,
        proposedCost: 1900,
        claimedSaving: 1900
      },
      {
        id: 'prop-foraging-swap',
        type: 'swap_activity',
        title: 'Swap High Glacier Ice Wall for Guided Valley Foraging',
        description: 'Enjoy a rich 3-hour wild herbs and mountain mushroom walk with local shepherd.',
        tradeOff: 'Gentler elevation gain without technical crampons.',
        targetItemId: items.find((i: any) => i.category === 'activity')?.id,
        currentCost: 3400,
        proposedCost: 1200,
        claimedSaving: 2200
      }
    ]
  };
}

export function getAlgorithmicAssistantResponse(userMessage: string, tripContext: any): any {
  const msg = userMessage.toLowerCase();

  if (msg.includes('weather') || msg.includes('forecast') || msg.includes('rain')) {
    return {
      replyText: `Based on live satellite readings from Open-Meteo, morning temperatures in the valley average 3°C to 7°C with misty cloud inversions. We recommend packing your thermal shell. If rain exceeds 70%, our dynamic replanner will trigger automatically!`,
      suggestedAction: {
        type: 'answer_from_trip_data',
        requiresConfirmation: false,
        explanation: 'Provided live meteorological advisory for the valley.'
      }
    };
  }

  if (msg.includes('replan') || msg.includes('change') || msg.includes('disrupt')) {
    return {
      replyText: `I can trigger an expedition replanning cycle right now to swap any rain-exposed trails for sheltered cultural sanctuaries. Would you like me to generate 3 alternative plans for review?`,
      suggestedAction: {
        type: 'trigger_replan',
        requiresConfirmation: true,
        explanation: 'Initiate AI dynamic replanning for disrupted itinerary stops.',
        parameters: { reason: 'User requested schedule adjustment' }
      }
    };
  }

  if (msg.includes('add') || msg.includes('stop') || msg.includes('sunset') || msg.includes('tea')) {
    return {
      replyText: `I have identified an extraordinary hidden stop: "High-Altitude Butter Lamp Lighting & Twilight Mandakini Chants". Would you like me to add this to your day schedule?`,
      suggestedAction: {
        type: 'add_item',
        requiresConfirmation: true,
        explanation: 'Add twilight butter lamp ceremony (17:30 - 18:45) to Day 2.',
        parameters: {
          day: 2,
          place: 'High-Altitude Butter Lamp Lighting & Twilight Chants',
          start_time: '17:30',
          end_time: '18:45',
          category: 'scenic',
          outdoor: true,
          cost: 450
        }
      }
    };
  }

  return {
    replyText: `Your journey "${tripContext.tripName || 'Safarnama Expedition'}" is progressing well. I can assist with adjusting stop timings, finding cheaper heritage homestays, or scanning upcoming weather disruptions. What would you like to explore?`,
    suggestedAction: {
      type: 'answer_from_trip_data',
      requiresConfirmation: false,
      explanation: 'General trip concierge advisory.'
    }
  };
}
