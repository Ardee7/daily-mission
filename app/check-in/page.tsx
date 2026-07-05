"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button, Field, inputClass, PageHeader, Panel } from "@/components/ui";
import { todayKey } from "@/lib/date";
import { parseImportedMissions } from "@/lib/missions";
import { buildAiPrompt } from "@/lib/reports";
import { getCheckIn, getMissions, saveCheckIn, saveMissions } from "@/lib/storage";
import { DailyCheckIn } from "@/lib/types";

type CheckInForm = {
  sleepHours: string;
  mood: string;
  energy: string;
  stress: string;
  weight: string;
  calendar: string;
  importantCommitments: string;
  yesterdayAccomplishments: string;
  yesterdayMissed: string;
  notes: string;
};

const emptyForm: CheckInForm = {
  sleepHours: "",
  mood: "",
  energy: "",
  stress: "",
  weight: "",
  calendar: "",
  importantCommitments: "",
  yesterdayAccomplishments: "",
  yesterdayMissed: "",
  notes: "",
};

export default function CheckInPage() {
  const [date, setDate] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [savedCheckIn, setSavedCheckIn] = useState<DailyCheckIn | null>(null);
  const [missionJson, setMissionJson] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setDate(todayKey());
  }, []);

  useEffect(() => {
    if (!date) return;

    const existing = getCheckIn(date);
    if (!existing) return;

    setSavedCheckIn(existing);
    setForm({
      sleepHours: toInput(existing.sleepHours),
      mood: toInput(existing.mood),
      energy: toInput(existing.energy),
      stress: toInput(existing.stress),
      weight: toInput(existing.weight),
      calendar: existing.calendar?.join("\n") ?? "",
      importantCommitments: existing.importantCommitments?.join("\n") ?? "",
      yesterdayAccomplishments: existing.yesterdayAccomplishments?.join("\n") ?? "",
      yesterdayMissed: existing.yesterdayMissed?.join("\n") ?? "",
      notes: existing.notes ?? "",
    });
  }, [date]);

  const prompt = useMemo(
    () => (savedCheckIn ? buildAiPrompt(savedCheckIn) : ""),
    [savedCheckIn]
  );

  function updateField(field: keyof CheckInForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date) return;

    const checkIn = formToCheckIn(date, form);
    saveCheckIn(checkIn);
    setSavedCheckIn(checkIn);
    setMessage("Check-in saved. Your AI prompt is ready.");
    setError("");
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setMessage("Prompt copied.");
  }

  function importMissions() {
    if (!date) return;

    setError("");
    setMessage("");

    const result = parseImportedMissions(missionJson, date);
    if (result.error) {
      setError(result.error);
      return;
    }

    const existing = getMissions(date);
    saveMissions(date, [...existing, ...result.missions]);
    setMissionJson("");
    setMessage(`${result.missions.length} mission${result.missions.length === 1 ? "" : "s"} imported.`);
  }

  return (
    <div className="pb-10">
      <PageHeader eyebrow="Morning check-in" title="Tell the day what you are carrying." />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <form className="grid gap-5" onSubmit={handleSave}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sleep hours">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  min="0"
                  step="0.25"
                  type="number"
                  value={form.sleepHours}
                  onChange={(event) => updateField("sleepHours", event.target.value)}
                />
              </Field>
              <Field label="Weight">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  type="number"
                  value={form.weight}
                  onChange={(event) => updateField("weight", event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <RatingField label="Mood" value={form.mood} onChange={(value) => updateField("mood", value)} />
              <RatingField label="Energy" value={form.energy} onChange={(value) => updateField("energy", value)} />
              <RatingField label="Stress" value={form.stress} onChange={(value) => updateField("stress", value)} />
            </div>

            <TextAreaField
              label="Today's calendar/events"
              value={form.calendar}
              onChange={(value) => updateField("calendar", value)}
            />
            <TextAreaField
              label="Important commitments"
              value={form.importantCommitments}
              onChange={(value) => updateField("importantCommitments", value)}
            />
            <TextAreaField
              label="Yesterday's accomplishments"
              value={form.yesterdayAccomplishments}
              onChange={(value) => updateField("yesterdayAccomplishments", value)}
            />
            <TextAreaField
              label="Yesterday's missed items"
              value={form.yesterdayMissed}
              onChange={(value) => updateField("yesterdayMissed", value)}
            />
            <TextAreaField
              label="Notes"
              value={form.notes}
              onChange={(value) => updateField("notes", value)}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit">Save Check-in</Button>
              {message && <p className="text-sm font-medium text-white/76">{message}</p>}
              {error && <p className="text-sm font-medium text-[#efe1d2]">{error}</p>}
            </div>
          </form>
        </Panel>

        <div className="grid gap-5">
          <Panel>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">AI prompt</h3>
              <Button disabled={!prompt} type="button" variant="secondary" onClick={copyPrompt}>
                Copy
              </Button>
            </div>
            <textarea
              className={`${inputClass} min-h-72 font-mono text-sm`}
              readOnly
              value={prompt || "Save your check-in to generate a prompt."}
            />
          </Panel>

          <Panel>
            <h3 className="text-lg font-semibold">Import missions</h3>
            <p className="mt-1 text-sm text-white/56">
              Paste the JSON returned by AI. Imported missions start as Todo.
            </p>
            <textarea
              className={`${inputClass} mt-4 min-h-48 font-mono text-sm`}
              placeholder='{"missions":[{"category":"Health","priority":"Critical","title":"Walk 5,000 steps","reason":"Supports weight management and energy."}]}'
              value={missionJson}
              onChange={(event) => setMissionJson(event.target.value)}
            />
            <Button className="mt-4" type="button" onClick={importMissions}>
              Import Missions
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function RatingField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={`${label} 1-5`}>
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Not set</option>
        {[1, 2, 3, 4, 5].map((rating) => (
          <option key={rating} value={rating}>
            {rating}
          </option>
        ))}
      </select>
    </Field>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <textarea
        className={`${inputClass} min-h-28`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

function formToCheckIn(date: string, form: CheckInForm): DailyCheckIn {
  return {
    date,
    sleepHours: toNumber(form.sleepHours),
    mood: toNumber(form.mood),
    energy: toNumber(form.energy),
    stress: toNumber(form.stress),
    weight: toNumber(form.weight),
    calendar: toLines(form.calendar),
    importantCommitments: toLines(form.importantCommitments),
    yesterdayAccomplishments: toLines(form.yesterdayAccomplishments),
    yesterdayMissed: toLines(form.yesterdayMissed),
    notes: form.notes.trim() || undefined,
  };
}

function toNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

function toInput(value?: number) {
  return value === undefined ? "" : String(value);
}

function toLines(value: string) {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines : undefined;
}
