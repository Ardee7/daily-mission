import { DailyCheckIn, DailyReport, Mission, MissionStatus, missionStatuses } from "./types";
import { formatDisplayDate } from "./date";

export function buildAiPrompt(checkIn: DailyCheckIn) {
  return `You are helping me plan today's Daily Missions.

Use this check-in to create a calm, realistic set of missions across health, self-care, work, growth, recovery, maintenance, and personal projects. Keep it useful and not overwhelming.

Return only JSON in this format:
{
  "missions": [
    {
      "category": "Health",
      "priority": "Critical",
      "title": "Walk 5,000 steps",
      "reason": "Supports weight management and energy."
    }
  ]
}

Check-in:
${JSON.stringify(checkIn, null, 2)}`;
}

export function missionSummary(missions: Mission[]) {
  const total = missions.length;
  const done = missions.filter((mission) => mission.status === "Done").length;
  const criticalOpen = missions.filter(
    (mission) => mission.priority === "Critical" && mission.status !== "Done"
  ).length;

  return { total, done, criticalOpen };
}

export function buildDailyReport(
  date: string,
  checkIn: DailyCheckIn,
  missions: Mission[],
  extras: Pick<DailyReport, "wins" | "struggles" | "notes">
): DailyReport {
  return {
    date,
    checkIn,
    missions,
    ...extras,
  };
}

export function reportToText(report: DailyReport) {
  const grouped = groupByStatus(report.missions);
  const summary = missionSummary(report.missions);

  return [
    `Daily Missions Report - ${formatDisplayDate(report.date)}`,
    "",
    "Check-in",
    formatCheckIn(report.checkIn),
    "",
    "Mission Summary",
    `${summary.done}/${summary.total} completed`,
    `${summary.criticalOpen} critical mission${summary.criticalOpen === 1 ? "" : "s"} still open`,
    "",
    formatMissionList("Done", grouped.Done),
    formatMissionList("Skipped", grouped.Skipped),
    formatMissionList("Blocked", grouped.Blocked),
    "",
    "Wins",
    report.wins?.trim() || "None recorded.",
    "",
    "Struggles",
    report.struggles?.trim() || "None recorded.",
    "",
    "Notes",
    report.notes?.trim() || "None recorded.",
  ].join("\n");
}

function groupByStatus(missions: Mission[]) {
  return missionStatuses.reduce(
    (acc, status) => {
      acc[status] = missions.filter((mission) => mission.status === status);
      return acc;
    },
    {} as Record<MissionStatus, Mission[]>
  );
}

function formatCheckIn(checkIn: DailyCheckIn) {
  const lines = [
    `Sleep: ${formatValue(checkIn.sleepHours, "hours")}`,
    `Mood: ${formatValue(checkIn.mood, "/5")}`,
    `Energy: ${formatValue(checkIn.energy, "/5")}`,
    `Stress: ${formatValue(checkIn.stress, "/5")}`,
    `Weight: ${formatValue(checkIn.weight)}`,
    `Calendar: ${formatArray(checkIn.calendar)}`,
    `Important commitments: ${formatArray(checkIn.importantCommitments)}`,
    `Yesterday's accomplishments: ${formatArray(checkIn.yesterdayAccomplishments)}`,
    `Yesterday's missed items: ${formatArray(checkIn.yesterdayMissed)}`,
    `Notes: ${checkIn.notes || "None"}`,
  ];

  return lines.join("\n");
}

function formatMissionList(label: MissionStatus, missions: Mission[]) {
  if (missions.length === 0) return `${label}\nNone.`;

  return [
    label,
    ...missions.map(
      (mission) =>
        `- [${mission.priority}] ${mission.category}: ${mission.title}${
          mission.reason ? ` (${mission.reason})` : ""
        }`
    ),
  ].join("\n");
}

function formatArray(value?: string[]) {
  return value?.length ? value.join("; ") : "None";
}

function formatValue(value?: number, suffix = "") {
  return value === undefined || Number.isNaN(value) ? "Not recorded" : `${value}${suffix}`;
}
