import {
  Mission,
  MissionCategory,
  MissionPriority,
  missionCategories,
  missionPriorities,
} from "./types";

type ImportedMission = {
  category: MissionCategory;
  priority: MissionPriority;
  title: string;
  reason?: string;
};

export function parseImportedMissions(
  raw: string,
  date: string
): { missions: Mission[]; error?: string } {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { missions: [], error: "That JSON could not be parsed." };
  }

  if (!isImportEnvelope(parsed)) {
    return {
      missions: [],
      error: 'Expected JSON shaped like { "missions": [...] }.',
    };
  }

  const invalidIndex = parsed.missions.findIndex((mission) => !isImportedMission(mission));
  if (invalidIndex >= 0) {
    return {
      missions: [],
      error: `Mission ${invalidIndex + 1} is missing a valid category, priority, or title.`,
    };
  }

  const now = new Date().toISOString();
  return {
    missions: parsed.missions.map((mission) => ({
      id: crypto.randomUUID(),
      date,
      category: mission.category,
      priority: mission.priority,
      title: mission.title.trim(),
      reason: mission.reason?.trim(),
      status: "Todo",
      createdAt: now,
    })),
  };
}

function isImportEnvelope(value: unknown): value is { missions: ImportedMission[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "missions" in value &&
    Array.isArray((value as { missions?: unknown }).missions)
  );
}

function isImportedMission(value: unknown): value is ImportedMission {
  if (typeof value !== "object" || value === null) return false;

  const mission = value as Partial<ImportedMission>;
  return (
    typeof mission.title === "string" &&
    mission.title.trim().length > 0 &&
    typeof mission.category === "string" &&
    missionCategories.includes(mission.category as MissionCategory) &&
    typeof mission.priority === "string" &&
    missionPriorities.includes(mission.priority as MissionPriority) &&
    (mission.reason === undefined || typeof mission.reason === "string")
  );
}
