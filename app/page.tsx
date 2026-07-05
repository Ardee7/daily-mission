"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Field, inputClass, PageHeader, Panel } from "@/components/ui";
import { formatDisplayDate, todayKey } from "@/lib/date";
import { buildDailyReport, missionSummary, reportToText } from "@/lib/reports";
import {
  getCheckIn,
  getMissions,
  getReportNotes,
  getSettings,
  saveMissions,
  saveReportNotes,
} from "@/lib/storage";
import {
  DailyCheckIn,
  Mission,
  MissionCategory,
  MissionStatus,
  missionCategories,
  missionStatuses,
} from "@/lib/types";

export default function TodayDashboard() {
  const date = todayKey();
  const [checkIn, setCheckIn] = useState<DailyCheckIn>({ date });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [wins, setWins] = useState("");
  const [struggles, setStruggles] = useState("");
  const [notes, setNotes] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [preferredName, setPreferredName] = useState("");

  useEffect(() => {
    setCheckIn(getCheckIn(date) ?? { date });
    setMissions(getMissions(date));
    const savedNotes = getReportNotes(date);
    setWins(savedNotes.wins ?? "");
    setStruggles(savedNotes.struggles ?? "");
    setNotes(savedNotes.notes ?? "");
    setPreferredName(getSettings().preferredName ?? "");
  }, [date]);

  const summary = useMemo(() => missionSummary(missions), [missions]);
  const report = useMemo(
    () => buildDailyReport(date, checkIn, missions, { wins, struggles, notes }),
    [checkIn, date, missions, notes, struggles, wins]
  );
  const textReport = useMemo(() => reportToText(report), [report]);
  const jsonReport = useMemo(() => JSON.stringify(report, null, 2), [report]);
  const groupedMissions = useMemo(() => groupMissions(missions), [missions]);
  const progress = summary.total === 0 ? 0 : Math.round((summary.done / summary.total) * 100);

  function updateMissionStatus(missionId: string, status: MissionStatus) {
    const updated = missions.map((mission) =>
      mission.id === missionId
        ? {
            ...mission,
            status,
            completedAt: status === "Done" ? new Date().toISOString() : undefined,
          }
        : mission
    );
    setMissions(updated);
    saveMissions(date, updated);
  }

  function saveNotes(next: { wins?: string; struggles?: string; notes?: string }) {
    const updated = {
      wins,
      struggles,
      notes,
      ...next,
    };
    setWins(updated.wins ?? "");
    setStruggles(updated.struggles ?? "");
    setNotes(updated.notes ?? "");
    saveReportNotes(date, updated);
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow={formatDisplayDate(date)}
        title={`Good ${timeGreeting()}${preferredName ? `, ${preferredName}` : ""}.`}
      >
        <div className="flex gap-2">
          <Link href="/check-in">
            <span className="inline-flex rounded-sm border border-white/20 bg-white/[0.04] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 transition hover:border-white/50 hover:bg-white/[0.08] hover:text-white">
              Check In
            </span>
          </Link>
          <Button type="button" onClick={() => setExportOpen((open) => !open)}>
            Export Daily Report
          </Button>
        </div>
      </PageHeader>

      <div className="mb-5 grid gap-4 md:grid-cols-[1fr_1.5fr]">
        <Panel>
          <p className="micro-label text-[11px] font-medium">
            Progress
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-semibold">{summary.done}</span>
            <span className="pb-2 text-lg text-white/55">/ {summary.total} complete</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-sm bg-white/10">
            <div className="h-full rounded-sm bg-[#f2f0e8]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-white/55">
            {summary.criticalOpen > 0
              ? `${summary.criticalOpen} critical mission${summary.criticalOpen === 1 ? "" : "s"} still need attention.`
              : "No critical missions are open."}
          </p>
        </Panel>

        <Panel>
          <p className="micro-label text-[11px] font-medium">
            Balance
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {missionCategories.map((category) => {
              const total = missions.filter((mission) => mission.category === category).length;
              const done = missions.filter(
                (mission) => mission.category === category && mission.status === "Done"
              ).length;

              return (
                <div key={category} className="rounded-sm border border-white/12 bg-white/[0.035] p-3">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    {category}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">{done}/{total}</p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {missions.length === 0 ? (
        <Panel className="text-center">
          <h3 className="text-xl font-semibold">No missions imported yet.</h3>
          <p className="mx-auto mt-2 max-w-xl text-white/58">
            Start with a check-in, copy the generated prompt to AI, then paste the JSON missions back into the app.
          </p>
          <Link href="/check-in">
            <span className="mt-5 inline-flex rounded-sm border border-white bg-white px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-black">
              Go to Check-in
            </span>
          </Link>
        </Panel>
      ) : (
        <div className="grid gap-5">
          {missionCategories.map((category) => {
            const categoryMissions = groupedMissions[category];
            if (!categoryMissions.length) return null;

            return (
              <section key={category}>
                <h3 className="mb-3 text-xl font-semibold">{category}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {categoryMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onStatusChange={(status) => updateMissionStatus(mission.id, status)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {exportOpen && (
        <Panel className="mt-5">
          <h3 className="text-xl font-semibold">End of day report</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Wins">
              <textarea
                className={`${inputClass} min-h-28`}
                value={wins}
                onChange={(event) => saveNotes({ wins: event.target.value })}
              />
            </Field>
            <Field label="Struggles">
              <textarea
                className={`${inputClass} min-h-28`}
                value={struggles}
                onChange={(event) => saveNotes({ struggles: event.target.value })}
              />
            </Field>
            <Field label="Notes">
              <textarea
                className={`${inputClass} min-h-28`}
                value={notes}
                onChange={(event) => saveNotes({ notes: event.target.value })}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ReportBox title="Text summary" value={textReport} onCopy={() => copy(textReport)} />
            <ReportBox title="Raw JSON" value={jsonReport} onCopy={() => copy(jsonReport)} />
          </div>
        </Panel>
      )}
    </div>
  );
}

function MissionCard({
  mission,
  onStatusChange,
}: {
  mission: Mission;
  onStatusChange: (status: MissionStatus) => void;
}) {
  const isCritical = mission.priority === "Critical";

  return (
    <article
      className={`mission-panel rounded-sm p-4 ${
        isCritical ? "border-white/55 ring-4 ring-white/10" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm border border-white/15 bg-white/[0.05] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/68">
          {mission.category}
        </span>
        <span
          className={`rounded-sm border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${
            isCritical ? "border-white bg-white text-black" : "border-white/15 bg-black/20 text-white/58"
          }`}
        >
          {mission.priority}
        </span>
      </div>
      <h4 className="mt-3 text-lg font-semibold">{mission.title}</h4>
      {mission.reason && <p className="mt-2 text-sm leading-6 text-white/56">{mission.reason}</p>}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {missionStatuses.map((status) => (
          <button
            key={status}
            className={`rounded-sm border px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
              mission.status === status
                ? "border-white bg-white text-black"
                : "border-white/15 bg-white/[0.03] text-white/62 hover:border-white/40 hover:bg-white/[0.07] hover:text-white"
            }`}
            type="button"
            onClick={() => onStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </article>
  );
}

function ReportBox({
  title,
  value,
  onCopy,
}: {
  title: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="font-semibold">{title}</h4>
        <Button type="button" variant="secondary" onClick={onCopy}>
          Copy
        </Button>
      </div>
      <textarea className={`${inputClass} min-h-96 font-mono text-sm`} readOnly value={value} />
    </div>
  );
}

function groupMissions(missions: Mission[]) {
  return missionCategories.reduce(
    (acc, category) => {
      acc[category] = missions
        .filter((mission) => mission.category === category)
        .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
      return acc;
    },
    {} as Record<MissionCategory, Mission[]>
  );
}

function priorityRank(priority: Mission["priority"]) {
  return priority === "Critical" ? 0 : priority === "Important" ? 1 : 2;
}

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
