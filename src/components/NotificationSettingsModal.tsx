import React, { useState, useEffect } from 'react';
import { NotificationSetting } from '../types';
import { X, Bell, Mail, Check, Shield } from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  userId,
  onClose,
}) => {
  const storageKey = `safarnama_notif_settings_${userId}`;

  const [settings, setSettings] = useState<NotificationSetting>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      user_id: userId,
      departure_reminders: true,
      packing_reminders: true,
      weather_alerts: true,
      schedule_changes: true,
      email_notifications: true,
      in_app_notifications: true,
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (e) {}
  }, [settings, storageKey]);

  if (!isOpen) return null;

  const toggle = (key: keyof NotificationSetting) => {
    if (key === 'user_id') return;
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#141210] border border-[#2E2922] rounded-2xl shadow-2xl p-6 text-[#EDE5DB]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23201A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/40 border border-amber-900/50 flex items-center justify-center text-safari-amber">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-safari-cream">Notification Preferences</h3>
              <p className="text-[10px] font-mono text-safari-copper">Per-User Dispatch Toggles</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0C0A09] border border-[#26231E]">
            <div>
              <div className="text-sm font-medium text-safari-cream">Departure Reminders</div>
              <div className="text-xs text-zinc-400">Notifies 3 days and 1 day prior to window start</div>
            </div>
            <button
              onClick={() => toggle('departure_reminders')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.departure_reminders ? 'bg-safari-amber' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  settings.departure_reminders ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0C0A09] border border-[#26231E]">
            <div>
              <div className="text-sm font-medium text-safari-cream">Packing Reminders</div>
              <div className="text-xs text-zinc-400">Weather-informed clothing & alpine gear alerts</div>
            </div>
            <button
              onClick={() => toggle('packing_reminders')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.packing_reminders ? 'bg-safari-amber' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  settings.packing_reminders ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0C0A09] border border-[#26231E]">
            <div>
              <div className="text-sm font-medium text-safari-cream">Live Weather Alerts</div>
              <div className="text-xs text-zinc-400">Rain &gt; 70% or wind gusts &gt; 50 km/h warnings</div>
            </div>
            <button
              onClick={() => toggle('weather_alerts')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.weather_alerts ? 'bg-safari-amber' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  settings.weather_alerts ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0C0A09] border border-[#26231E]">
            <div>
              <div className="text-sm font-medium text-safari-cream">Schedule & Diff Changes</div>
              <div className="text-xs text-zinc-400">Whenever dynamic replanning updates a day's stops</div>
            </div>
            <button
              onClick={() => toggle('schedule_changes')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.schedule_changes ? 'bg-safari-amber' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  settings.schedule_changes ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-[#23201A] flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-safari-copper" />
              <span>Email Delivery (Resend / SMTP)</span>
            </span>
            <button
              onClick={() => toggle('email_notifications')}
              className={`px-3 py-1 rounded-full font-mono text-[11px] uppercase transition-colors ${
                settings.email_notifications
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {settings.email_notifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Action */}
        <div className="mt-6 pt-4 border-t border-[#23201A] flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg flex items-center gap-2"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Preferences Saved' : 'Save Preferences'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
