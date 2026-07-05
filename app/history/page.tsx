"use client";

import { useEffect, useState } from "react";
import { PageHeader, Panel } from "@/components/ui";
import { formatDisplayDate } from "@/lib/date";
import { missionSummary, reportToText } from "@/lib/reports";
import { listReports } from "@/lib/storage";
import { DailyReport } from "@/lib/types";

export default function HistoryPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const loaded = listReports();
    setReports(loaded);
    setSelectedDate(loaded[0]?.date ?? "");
  }, []);

  const selected = reports.find((report) => report.date === selectedDate);

  return (
    <div className="pb-10">
      <PageHeader eyebrow="Past days" title="A simple trail of what happened." />

      {reports.length === 0 ? (
        <Panel>
          <p className="text-white/58">
            No saved reports yet. Check-ins and mission updates will appear here automatically.
          </p>
        </Panel>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <Panel>
            <div className="grid gap-3">
              {reports.map((report) => {
                const summary = missionSummary(report.missions);
                const active = selectedDate === report.date;

                return (
                  <button
                    key={report.date}
                    className={`rounded-sm border p-4 text-left transition ${
                      active
                        ? "border-white/60 bg-white/[0.1]"
                        : "border-white/12 bg-white/[0.035] hover:border-white/35"
                    }`}
                    type="button"
                    onClick={() => setSelectedDate(report.date)}
                  >
                    <p className="font-semibold">{formatDisplayDate(report.date)}</p>
                    <p className="mt-1 text-sm text-white/55">
                      {summary.done}/{summary.total} missions completed
                    </p>
                  </button>
                );
              })}
            </div>
          </Panel>

          {selected && (
            <Panel>
              <h3 className="text-xl font-semibold">{formatDisplayDate(selected.date)}</h3>
              <textarea
                className="mt-4 min-h-[32rem] w-full rounded-sm border border-white/15 bg-black/35 px-4 py-3 font-mono text-sm text-[#f2f0e8] outline-none"
                readOnly
                value={reportToText(selected)}
              />
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}
