"use client";

import { useState } from "react";

const inputStyles =
  "w-full border-4 border-ink bg-paper px-4 py-3 text-base font-medium placeholder:text-ink/40";
const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-widest";

export default function ProfileForm({
  fullName,
  phone,
  bio,
  photoUrl,
}: {
  fullName: string;
  phone: string;
  bio: string;
  photoUrl: string;
}) {
  const [form, setForm] = useState({ phone, bio, photoUrl });
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/portal/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setFlash("Saved.");
      setTimeout(() => setFlash(null), 2500);
    } catch {
      setFlash("Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className={labelStyles}>Full name</label>
        <input value={fullName} disabled className={`${inputStyles} opacity-60`} />
      </div>

      <div>
        <label htmlFor="phone" className={labelStyles}>Phone / WhatsApp *</label>
        <input
          id="phone"
          required
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+234..."
          className={inputStyles}
        />
      </div>

      <div>
        <label htmlFor="bio" className={labelStyles}>Short bio *</label>
        <textarea
          id="bio"
          required
          rows={4}
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="A couple of sentences about you and your idea."
          className={inputStyles}
        />
      </div>

      <div>
        <label htmlFor="photoUrl" className={labelStyles}>Photo URL *</label>
        <input
          id="photoUrl"
          required
          value={form.photoUrl}
          onChange={(e) => update("photoUrl", e.target.value)}
          placeholder="Link to a photo of you"
          className={inputStyles}
        />
        <p className="mt-2 text-xs font-medium text-ink/50">
          Paste a link to a photo (Google Drive, Dropbox, etc., set to public).
          Direct photo upload is coming later.
        </p>
      </div>

      {flash && (
        <p className="text-sm font-bold uppercase tracking-widest text-strike">{flash}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-strike px-8 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}