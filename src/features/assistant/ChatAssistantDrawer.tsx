import React, { useState } from 'react';
import { Trip, ItineraryItem } from '../../types';
import { sendAssistantMessage } from '../../lib/api';
import { X, Send, Sparkles, Bot, User, Check, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

interface ChatAssistantDrawerProps {
  isOpen: boolean;
  trip: Trip;
  items: ItineraryItem[];
  onClose: () => void;
  onApplyAction: (action: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: any;
  timestamp: string;
}

export const ChatAssistantDrawer: React.FC<ChatAssistantDrawerProps> = ({
  isOpen,
  trip,
  items,
  onClose,
  onApplyAction,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your Safarnama Cinema-Travel Concierge for "${trip.name}". I can adjust timings, add authentic mountain stops, check live forecasts, or suggest packing adjustments. How may I assist your journey?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Confirmation state for proposed action
  const [pendingAction, setPendingAction] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);
    setErrorMsg(null);

    try {
      const response = await sendAssistantMessage({
        userMessage: userMsg.text,
        tripContext: {
          tripId: trip.id,
          tripName: trip.name,
          travellers: trip.travellers_count,
          destinations: trip.destination_ids,
          currentItemsCount: items.length,
          budget: trip.budget,
        },
        chatHistory: messages.map((m) => ({ role: m.sender, content: m.text }))
      });

      const assistantMsg: ChatMessage = {
        id: 'msg-ast-' + Date.now(),
        sender: 'assistant',
        text: response.replyText,
        suggestedAction: response.suggestedAction,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Assistant encountered an issue. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#12100E] border-l border-[#26231E] shadow-2xl flex flex-col text-[#EDE5DB] animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#23201A] flex items-center justify-between bg-[#141210]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-950/50 border border-amber-800/60 flex items-center justify-center text-safari-amber">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-safari-cream">Travel Concierge</h3>
              <p className="text-[10px] font-mono text-safari-copper">Gemini 1.5 · Tool-Calling Agent</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-safari-amber text-black font-medium rounded-tr-none'
                    : 'bg-[#181512] border border-[#2A251E] text-safari-cream rounded-tl-none'
                }`}
              >
                {m.text}

                {/* Proposed Tool Action (requires confirmation) */}
                {m.suggestedAction && (
                  <div className="mt-3 pt-3 border-t border-[#332D24] text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-safari-amber font-mono font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Proposed Itinerary Change:</span>
                    </div>
                    <p className="text-zinc-300 font-sans">
                      {m.suggestedAction.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPendingAction(m.suggestedAction)}
                      className="w-full mt-2 py-2 rounded-lg bg-safari-amber text-black font-semibold uppercase font-mono text-[11px] tracking-wider hover:bg-safari-amber-hover transition-colors"
                    >
                      Review & Approve Change
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs font-mono text-safari-muted p-2">
              <div className="w-2 h-2 rounded-full bg-safari-amber animate-ping" />
              <span>Concierge thinking...</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#23201A] bg-[#141210] flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about weather, add a stop, or replan..."
            className="flex-1 px-4 py-2.5 rounded-full bg-[#0C0A09] border border-[#2E2922] text-xs text-safari-cream placeholder:text-zinc-600 focus:border-safari-amber focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="w-10 h-10 rounded-full bg-safari-amber hover:bg-safari-amber-hover text-black flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Explicit User Confirmation Dialog for Tool Calling Write Action */}
      <ConfirmationModal
        isOpen={Boolean(pendingAction)}
        title="Confirm AI Itinerary Modification"
        description={pendingAction?.explanation || 'Apply proposed modification to your journey timeline?'}
        details={
          pendingAction?.parameters ? (
            <pre className="text-[11px] text-zinc-300 whitespace-pre-wrap font-mono">
              {JSON.stringify(pendingAction.parameters, null, 2)}
            </pre>
          ) : null
        }
        confirmLabel="Approve & Apply"
        onConfirm={() => {
          if (pendingAction) {
            onApplyAction(pendingAction);
            setPendingAction(null);
          }
        }}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
};
