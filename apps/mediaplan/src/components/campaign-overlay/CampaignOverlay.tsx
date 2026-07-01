"use client";

import { useEffect, useState, useCallback } from "react";
import { getFullCampaignPlan, updateCampaignPlan } from "@/lib/api/campaign-plans";
import type { FullCampaignPlan } from "@/lib/types";
import { formatSwedishDateFull } from "@/lib/utils/dates";
import CampaignTimeline from "./CampaignTimeline";

interface Props {
  planId: string;
  onClose: () => void;
}

export default function CampaignOverlay({ planId, onClose }: Props) {
  const [plan, setPlan] = useState<FullCampaignPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = useCallback(async () => {
    const data = await getFullCampaignPlan(planId);
    setPlan(data);
    setLoading(false);
  }, [planId]);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleNameUpdate = async (name: string) => {
    if (!plan) return;
    await updateCampaignPlan(plan.id, { name });
    setPlan((p) => p ? { ...p, name } : p);
  };

  const handlePeriodUpdate = async (field: "period_start" | "period_end", value: string) => {
    if (!plan) return;
    await updateCampaignPlan(plan.id, { [field]: value });
    setPlan((p) => p ? { ...p, [field]: value } : p);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex flex-col bg-white w-full h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {loading || !plan ? (
              <div className="h-5 w-48 bg-gray-700 rounded animate-pulse" />
            ) : (
              <>
                <EditableName value={plan.name} onSave={handleNameUpdate} />
                <span className="text-gray-400 text-sm shrink-0">
                  {formatSwedishDateFull(plan.period_start)} – {formatSwedishDateFull(plan.period_end)}
                </span>
                <div className="flex gap-2 shrink-0">
                  <input
                    type="date"
                    value={plan.period_start}
                    onChange={(e) => handlePeriodUpdate("period_start", e.target.value)}
                    className="text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1"
                  />
                  <span className="text-gray-500">→</span>
                  <input
                    type="date"
                    value={plan.period_end}
                    onChange={(e) => handlePeriodUpdate("period_end", e.target.value)}
                    className="text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1"
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition-colors ml-1"
            title="Stäng (Esc)"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400 animate-pulse">Laddar kampanj…</div>
            </div>
          ) : !plan ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              Kunde inte ladda kampanjen
            </div>
          ) : (
            <CampaignTimeline plan={plan} onPlanChanged={loadPlan} />
          )}
        </div>
      </div>
    </div>
  );
}

function EditableName({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() && draft !== value) onSave(draft.trim());
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
        className="text-base font-semibold bg-gray-800 text-white border border-gray-600 rounded px-2 py-0.5 min-w-48"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-base font-semibold text-white hover:text-milou-300 truncate max-w-xs transition-colors"
    >
      {value}
    </button>
  );
}
