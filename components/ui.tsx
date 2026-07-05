import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="mb-6">
      <p className="micro-label text-xs font-medium">{eyebrow}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="forged-title max-w-3xl text-3xl text-[#f2f0e8] sm:text-5xl">
          {title}
        </h2>
        {children}
      </div>
      <div className="fine-line mt-5 h-px w-full" />
    </section>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`mission-panel rounded-sm p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
}) {
  const styles = {
    primary: "border-[#f2f0e8] bg-[#f2f0e8] text-[#050505] hover:bg-white",
    secondary: "border-white/20 bg-white/[0.04] text-[#f2f0e8] hover:border-white/50 hover:bg-white/[0.08]",
    quiet: "border-transparent bg-transparent text-white/70 hover:bg-white/[0.06] hover:text-white",
  };

  return (
    <button
      className={`rounded-sm border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/64">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-sm border border-white/15 bg-black/35 px-4 py-3 font-sans text-base text-[#f2f0e8] outline-none transition placeholder:text-white/30 focus:border-white/45 focus:ring-4 focus:ring-white/10";
