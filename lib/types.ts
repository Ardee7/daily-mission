export type MissionCategory =
  | "Health"
  | "Self-Care"
  | "Work"
  | "Growth"
  | "Personal Projects"
  | "Recovery"
  | "Maintenance";

export type MissionPriority = "Critical" | "Important" | "Optional";

export type MissionStatus = "Todo" | "Done" | "Skipped" | "Blocked";

export type DailyCheckIn = {
  date: string;
  sleepHours?: number;
  mood?: number;
  energy?: number;
  stress?: number;
  weight?: number;
  notes?: string;
  calendar?: string[];
  importantCommitments?: string[];
  yesterdayAccomplishments?: string[];
  yesterdayMissed?: string[];
};

export type Mission = {
  id: string;
  date: string;
  category: MissionCategory;
  priority: MissionPriority;
  title: string;
  reason?: string;
  status: MissionStatus;
  createdAt: string;
  completedAt?: string;
};

export type DailyReport = {
  date: string;
  checkIn: DailyCheckIn;
  missions: Mission[];
  wins?: string;
  struggles?: string;
  notes?: string;
};

export const missionCategories: MissionCategory[] = [
  "Health",
  "Self-Care",
  "Work",
  "Growth",
  "Personal Projects",
  "Recovery",
  "Maintenance",
];

export const missionPriorities: MissionPriority[] = [
  "Critical",
  "Important",
  "Optional",
];

export const missionStatuses: MissionStatus[] = [
  "Todo",
  "Done",
  "Skipped",
  "Blocked",
];
