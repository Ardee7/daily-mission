"use client";

import { DailyCheckIn, DailyReport, Mission } from "./types";

const CHECK_INS_KEY = "daily-missions:check-ins";
const MISSIONS_KEY = "daily-missions:missions";
const REPORT_NOTES_KEY = "daily-missions:report-notes";
const SETTINGS_KEY = "daily-missions:settings";

export type ReportNotes = {
  wins?: string;
  struggles?: string;
  notes?: string;
};

export type Settings = {
  preferredName?: string;
  defaultExportFormat: "text" | "json";
};

const defaultSettings: Settings = {
  preferredName: "",
  defaultExportFormat: "text",
};

function readRecord<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as Record<string, T>) : {};
  } catch {
    return {};
  }
}

function writeRecord<T>(key: string, value: Record<string, T>) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCheckIn(date: string) {
  return readRecord<DailyCheckIn>(CHECK_INS_KEY)[date];
}

export function saveCheckIn(checkIn: DailyCheckIn) {
  const checkIns = readRecord<DailyCheckIn>(CHECK_INS_KEY);
  checkIns[checkIn.date] = checkIn;
  writeRecord(CHECK_INS_KEY, checkIns);
}

export function getMissions(date: string) {
  return readRecord<Mission[]>(MISSIONS_KEY)[date] ?? [];
}

export function saveMissions(date: string, missions: Mission[]) {
  const allMissions = readRecord<Mission[]>(MISSIONS_KEY);
  allMissions[date] = missions;
  writeRecord(MISSIONS_KEY, allMissions);
}

export function getReportNotes(date: string) {
  return readRecord<ReportNotes>(REPORT_NOTES_KEY)[date] ?? {};
}

export function saveReportNotes(date: string, notes: ReportNotes) {
  const allNotes = readRecord<ReportNotes>(REPORT_NOTES_KEY);
  allNotes[date] = notes;
  writeRecord(REPORT_NOTES_KEY, allNotes);
}

export function getSettings() {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const value = window.localStorage.getItem(SETTINGS_KEY);
    return value
      ? { ...defaultSettings, ...(JSON.parse(value) as Partial<Settings>) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function listReports(): DailyReport[] {
  const checkIns = readRecord<DailyCheckIn>(CHECK_INS_KEY);
  const missions = readRecord<Mission[]>(MISSIONS_KEY);
  const notes = readRecord<ReportNotes>(REPORT_NOTES_KEY);
  const dates = Array.from(
    new Set([...Object.keys(checkIns), ...Object.keys(missions), ...Object.keys(notes)])
  ).sort((a, b) => b.localeCompare(a));

  return dates.map((date) => ({
    date,
    checkIn: checkIns[date] ?? { date },
    missions: missions[date] ?? [],
    ...notes[date],
  }));
}
