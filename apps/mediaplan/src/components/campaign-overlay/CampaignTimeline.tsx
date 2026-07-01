"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import type { FullCampaignPlan, Campaign, CampaignPlatform, CampaignPlatformStatus } from "@/lib/types";
import { getPlanWeeks, getMonthGroups, dateRangeToGridSpan, WeekColumn } from "@/lib/utils/dates";
import { formatSEK } from "@/lib/utils/budget";
import {
  createCampaign, updateCampaign, deleteCampaign,
  createPlatform, updatePlatform, deletePlatform,
} from "@/lib/api/campaign-plans";
import InlineEdit from "@/components/plan-overlay/InlineEdit";
import ColorDot from "@/components/plan-overlay/ColorDot";

const INFO_COLS = "200px 120px 90px";
const INFO_COL_COUNT = 3;

const PLATFORM_STATUS: Record<CampaignPlatformStatus, { label: string; bg: string; color: string }> = {
  inaktiv:    { label: "Inaktiv",    bg: "#F1F5F9", color: "#64748B" },
  schemalagd: { label: "Schemalagd", bg: "#EFF6FF", color: "#2563EB" },
  aktiv:      { label: "Aktiv",      bg: "#ECFDF5", color: "#059669" },
  klar:       { label: "Klar",       bg: "#F5F3FF", color: "#7C3AED" },
};

const STATUS_CYCLE: CampaignPlatformStatus[] = ["inaktiv", "schemalagd", "aktiv", "klar"];

function colToStartDate(col: number, weeks: WeekColumn[]): string {
  return format(weeks[Math.max(0, Math.min(col - 1, weeks.length - 1))].startDate, "yyyy-MM-dd");
}

function colToEndDate(colEnd: number, weeks: WeekColumn[]): string {
  return format(weeks[Math.max(0, Math.min(colEnd - 2, weeks.length - 1))].endDate, "yyyy-MM-dd");
}

interface Props {
  plan: FullCampaignPlan;
  onPlanChanged: () => void;
}

export default function CampaignTimeline({ plan, onPlanChanged }: Props) {
  const weeks = useMemo(() => getPlanWeeks(plan.period_start, plan.period_end), [plan.period_start, plan.period_end]);
  const months = useMemo(() => getMonthGroups(weeks), [weeks]);
  const weekCount = weeks.length;

  const gridCols = `${INFO_COLS} repeat(${weekCount}, minmax(20px, 1fr))`;
  const cellClass = "border-r border-b border-gray-100 px-2 py-2.5 text-xs flex items-center";
  const stickyClass = "sticky left-0 z-10 bg-white";
  const headerBg = "bg-gray-900 text-white";

  const getSpan = useCallback((startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return null;
    return dateRangeToGridSpan(startDate, endDate, weeks);
  }, [weeks]);

  const handleAddCampaign = async () => {
    await createCampaign(plan.id, "Ny kampanj", plan.campaigns.length);
    onPlanChanged();
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Ta bort kampanjen och alla dess plattformar?")) return;
    await deleteCampaign(id);
    onPlanChanged();
  };

  const handleAddPlatform = async (campaignId: string, sortOrder: number) => {
    await createPlatform(campaignId, "Ny plattform", plan.period_start, plan.period_end, sortOrder);
    onPlanChanged();
  };

  const handleUpdatePlatform = async (id: string, updates: Partial<CampaignPlatform>) => {
    await updatePlatform(id, updates);
    onPlanChanged();
  };

  const totalBudget = plan.campaigns.reduce(
    (sum, c) => sum + (c.platforms.reduce((s, p) => s + (p.budget ?? 0), 0)),
    0
  );

  return (
    <>
      <div className="md:hidden flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
        <div className="text-3xl">🖥️</div>
        <p className="text-gray-600 font-medium">Öppna på en dator</p>
        <p className="text-gray-400 text-sm">Kampanjtidslinjen kräver en större skärm.</p>
      </div>

      <div className="overflow-x-auto scrollbar-thin px-4 py-2 hidden md:block">
        <div style={{ display: "grid", gridTemplateColumns: gridCols }} className="min-w-max border-l border-t border-gray-100">
          {/* Month header */}
          <div
            className={`${cellClass} ${stickyClass} ${headerBg} font-semibold text-sm`}
            style={{ gridColumn: `1 / span ${INFO_COL_COUNT}` }}
          >
            {plan.name}
          </div>
          {months.map((m) => (
            <div key={m.label} className={`${cellClass} ${headerBg} font-medium justify-center`} style={{ gridColumn: `span ${m.spanCols}` }}>
              {m.label}
            </div>
          ))}

          {/* Column headers */}
          {["Kanal/Plattform", "Status", "Budget"].map((h, i) => (
            <div key={h} className={`${cellClass} ${stickyClass} bg-gray-800 text-gray-300 text-xs font-medium`} style={{ left: i === 0 ? 0 : undefined }}>
              {h}
            </div>
          ))}
          {weeks.map((w) => (
            <div key={w.index} className={`${cellClass} bg-gray-800 text-gray-400 justify-center`}>
              {w.label}
            </div>
          ))}

          {/* Campaign sections */}
          {plan.campaigns.map((campaign) => (
            <CampaignSection
              key={campaign.id}
              campaign={campaign}
              weeks={weeks}
              weekCount={weekCount}
              getSpan={getSpan}
              onUpdateCampaign={(updates) => updateCampaign(campaign.id, updates).then(onPlanChanged)}
              onDeleteCampaign={() => handleDeleteCampaign(campaign.id)}
              onAddPlatform={() => handleAddPlatform(campaign.id, campaign.platforms.length)}
              onUpdatePlatform={handleUpdatePlatform}
              onDeletePlatform={async (id) => { await deletePlatform(id); onPlanChanged(); }}
              cellClass={cellClass}
              stickyClass={stickyClass}
            />
          ))}

          {/* Add campaign */}
          <div className={`${cellClass} ${stickyClass} bg-gray-50`} style={{ gridColumn: `1 / span ${INFO_COL_COUNT}` }}>
            <button onClick={handleAddCampaign} className="text-xs text-milou-500 hover:text-milou-700 font-medium">
              + Lägg till kampanj
            </button>
          </div>
          <div style={{ gridColumn: `span ${weekCount}` }} className="bg-gray-50 border-b border-gray-100" />

          {/* Budget summary */}
          <div className={`${cellClass} ${stickyClass} bg-gray-900 text-white font-bold`} style={{ gridColumn: `1 / span ${INFO_COL_COUNT}` }}>
            <span className="text-xs text-gray-400 mr-2">Total budget</span>
            <span className="text-sm">{formatSEK(totalBudget)}</span>
          </div>
          <div style={{ gridColumn: `span ${weekCount}` }} className="bg-gray-900 border-b border-gray-700" />
        </div>
      </div>
    </>
  );
}

/* ─── Campaign Section ──────────────────────────────────────── */
function CampaignSection({
  campaign, weeks, weekCount, getSpan,
  onUpdateCampaign, onDeleteCampaign, onAddPlatform, onUpdatePlatform, onDeletePlatform,
  cellClass, stickyClass,
}: {
  campaign: Campaign & { platforms: CampaignPlatform[] };
  weeks: WeekColumn[];
  weekCount: number;
  getSpan: (s: string | null, e: string | null) => { colStart: number; colEnd: number } | null;
  onUpdateCampaign: (u: Partial<Campaign>) => void;
  onDeleteCampaign: () => void;
  onAddPlatform: () => void;
  onUpdatePlatform: (id: string, u: Partial<CampaignPlatform>) => void;
  onDeletePlatform: (id: string) => void;
  cellClass: string;
  stickyClass: string;
}) {
  const totalBudget = campaign.platforms.reduce((s, p) => s + (p.budget ?? 0), 0);

  return (
    <>
      {/* Campaign header */}
      <div
        className={`${cellClass} ${stickyClass} font-semibold text-xs`}
        style={{
          gridColumn: `1 / span 3`,
          backgroundColor: campaign.color + "22",
          borderLeft: `3px solid ${campaign.color}`,
          borderTop: `2px solid ${campaign.color}55`,
        }}
      >
        <div className="flex items-center gap-2 w-full">
          <ColorDot color={campaign.color} onChange={(color) => onUpdateCampaign({ color })} />
          <InlineEdit
            value={campaign.name}
            onSave={(name) => onUpdateCampaign({ name })}
            className="font-semibold text-xs"
            style={{ color: campaign.color }}
          />
          {totalBudget > 0 && (
            <span className="ml-auto text-xs font-normal" style={{ color: campaign.color, opacity: 0.7 }}>
              {formatSEK(totalBudget)}
            </span>
          )}
          <button onClick={onDeleteCampaign} className="text-red-300 hover:text-red-500 text-xs ml-1">×</button>
        </div>
      </div>
      <div
        style={{ gridColumn: `span ${weekCount}`, backgroundColor: campaign.color + "11", borderTop: `2px solid ${campaign.color}55` }}
        className="relative border-b border-gray-100"
      />

      {/* Platform rows */}
      {campaign.platforms.map((platform) => (
        <PlatformRow
          key={platform.id}
          platform={platform}
          weeks={weeks}
          weekCount={weekCount}
          span={getSpan(platform.start_date, platform.end_date)}
          onUpdate={(u) => onUpdatePlatform(platform.id, u)}
          onDelete={() => onDeletePlatform(platform.id)}
          onAddPlatform={onAddPlatform}
          cellClass={cellClass}
          stickyClass={stickyClass}
        />
      ))}

      {/* Add platform */}
      <div className={`${cellClass} ${stickyClass} bg-gray-50`} style={{ gridColumn: `1 / span 3` }}>
        <button onClick={onAddPlatform} className="text-xs text-milou-500 hover:text-milou-700">
          + Lägg till plattform
        </button>
      </div>
      <div style={{ gridColumn: `span ${weekCount}` }} className="bg-gray-50 border-b border-gray-100" />
    </>
  );
}

/* ─── Platform Row ──────────────────────────────────────────── */
type DragState = { type: "move" | "left" | "right"; startX: number; startColStart: number; startColEnd: number };

function PlatformRow({
  platform, weeks, weekCount, span, onUpdate, onDelete, onAddPlatform, cellClass, stickyClass,
}: {
  platform: CampaignPlatform;
  weeks: WeekColumn[];
  weekCount: number;
  span: { colStart: number; colEnd: number } | null;
  onUpdate: (u: Partial<CampaignPlatform>) => void;
  onDelete: () => void;
  onAddPlatform: () => void;
  cellClass: string;
  stickyClass: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [displaySpan, setDisplaySpan] = useState(span);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const displaySpanRef = useRef(span);
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  useEffect(() => {
    if (!isDragging) { setDisplaySpan(span); displaySpanRef.current = span; }
  }, [span, isDragging]);

  const startDrag = useCallback((e: React.PointerEvent, type: DragState["type"]) => {
    if (!span) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStateRef.current = { type, startX: e.clientX, startColStart: span.colStart, startColEnd: span.colEnd };
    setIsDragging(true);
  }, [span]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      const drag = dragStateRef.current;
      if (!drag || !containerRef.current) return;
      const colWidth = containerRef.current.offsetWidth / weekCount;
      const delta = Math.round((e.clientX - drag.startX) / colWidth);
      const spanWidth = drag.startColEnd - drag.startColStart;
      let s = drag.startColStart, en = drag.startColEnd;
      if (drag.type === "move") { s = Math.max(1, Math.min(drag.startColStart + delta, weekCount - spanWidth + 1)); en = s + spanWidth; }
      else if (drag.type === "left") { s = Math.max(1, Math.min(drag.startColStart + delta, drag.startColEnd - 1)); }
      else { en = Math.max(drag.startColStart + 1, Math.min(drag.startColEnd + delta, weekCount + 1)); }
      const newSpan = { colStart: s, colEnd: en };
      displaySpanRef.current = newSpan;
      setDisplaySpan(newSpan);
    };
    const onUp = () => {
      const finalSpan = displaySpanRef.current;
      if (finalSpan) {
        onUpdateRef.current({ start_date: colToStartDate(finalSpan.colStart, weeks), end_date: colToEndDate(finalSpan.colEnd, weeks) });
      }
      dragStateRef.current = null;
      setIsDragging(false);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => { document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerup", onUp); };
  }, [isDragging, weekCount, weeks]);

  const statusCfg = PLATFORM_STATUS[platform.status];
  const nextStatus = () => {
    const idx = STATUS_CYCLE.indexOf(platform.status);
    onUpdate({ status: STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length] });
  };

  return (
    <>
      {/* Platform name */}
      <div className={`${cellClass} ${stickyClass} group gap-1.5`}>
        <ColorDot color={platform.color} onChange={(color) => onUpdate({ color })} />
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <InlineEdit
            value={platform.platform_name}
            onSave={(platform_name) => onUpdate({ platform_name })}
            className="text-xs flex-1 min-w-0"
          />
          <button onClick={onDelete} className="text-red-300 hover:text-red-500 text-xs shrink-0 opacity-0 group-hover:opacity-100">×</button>
        </div>
      </div>

      {/* Status */}
      <div className={cellClass}>
        <button
          onClick={nextStatus}
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
          className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap hover:opacity-80 transition-opacity"
          title="Klicka för att byta status"
        >
          {statusCfg.label}
        </button>
      </div>

      {/* Budget */}
      <div className={`${cellClass} justify-end`}>
        <InlineEdit
          value={platform.budget ? String(platform.budget) : ""}
          onSave={(v) => onUpdate({ budget: v ? Number(v) : null })}
          onTabOut={onAddPlatform}
          type="number"
          placeholder="–"
          className="text-xs text-right w-full"
        />
      </div>

      {/* Gantt bar */}
      <div ref={containerRef} style={{ gridColumn: `span ${weekCount}` }} className="relative border-b border-gray-100 bg-white">
        {displaySpan ? (
          <div
            style={{
              position: "absolute",
              left: `${((displaySpan.colStart - 1) / weekCount) * 100}%`,
              width: `${Math.max(((displaySpan.colEnd - displaySpan.colStart) / weekCount) * 100, 0.5)}%`,
              backgroundColor: platform.color,
              top: "15%", height: "70%", borderRadius: "4px",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
            onPointerDown={(e) => startDrag(e, "move")}
            title={platform.platform_name}
          >
            <div
              style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "8px", cursor: "w-resize", borderRadius: "4px 0 0 4px", backgroundColor: "rgba(0,0,0,0.18)" }}
              onPointerDown={(e) => { e.stopPropagation(); startDrag(e, "left"); }}
            />
            <div
              style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "8px", cursor: "e-resize", borderRadius: "0 4px 4px 0", backgroundColor: "rgba(0,0,0,0.18)" }}
              onPointerDown={(e) => { e.stopPropagation(); startDrag(e, "right"); }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center px-2">
            <div className="flex gap-1">
              <input type="date" value={platform.start_date ?? ""} onChange={(e) => onUpdate({ start_date: e.target.value })} className="border-0 bg-transparent text-xs text-gray-500 cursor-pointer" />
              <input type="date" value={platform.end_date ?? ""} onChange={(e) => onUpdate({ end_date: e.target.value })} className="border-0 bg-transparent text-xs text-gray-500 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
