"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Field, inputClass, PageHeader, Panel } from "@/components/ui";
import { getSettings, saveSettings, Settings } from "@/lib/storage";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    preferredName: "",
    defaultExportFormat: "text",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSettings(settings);
    setMessage("Preferences saved.");
  }

  return (
    <div className="pb-10">
      <PageHeader eyebrow="Preferences" title="Keep the app fitted to your daily rhythm." />

      <Panel className="max-w-2xl">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Field label="Preferred name">
            <input
              className={inputClass}
              value={settings.preferredName ?? ""}
              onChange={(event) =>
                setSettings((current) => ({ ...current, preferredName: event.target.value }))
              }
            />
          </Field>

          <Field label="Default export format">
            <select
              className={inputClass}
              value={settings.defaultExportFormat}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  defaultExportFormat: event.target.value as Settings["defaultExportFormat"],
                }))
              }
            >
              <option value="text">Text summary</option>
              <option value="json">Raw JSON</option>
            </select>
          </Field>

          <div className="flex items-center gap-3">
            <Button type="submit">Save Preferences</Button>
            {message && <p className="text-sm font-medium text-white/76">{message}</p>}
          </div>
        </form>
      </Panel>
    </div>
  );
}
