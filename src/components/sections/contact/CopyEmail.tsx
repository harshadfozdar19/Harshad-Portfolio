"use client";

import { useEffect, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

interface CopyEmailProps {
  email: string;
  /** Button styling comes from the parent section so it matches the other contact actions. */
  className?: string;
}

const RESET_AFTER_MS = 2000;

/** Fallback for browsers or contexts without the async Clipboard API (e.g. plain http). */
function legacyCopy(text: string): boolean {
  const previous = document.activeElement;
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.setAttribute("aria-hidden", "true");
  Object.assign(field.style, { position: "fixed", top: "0", left: "0", opacity: "0", fontSize: "16px" });
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
  return ok;
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or document not focused: fall through to the legacy path.
    }
  }
  try {
    return legacyCopy(text);
  } catch {
    return false;
  }
}

/** "Copy email" button with a 2-second confirmation and a polite live-region announcement. */
export function CopyEmail({ email, className }: CopyEmailProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  // Bumped on every click so repeated clicks restart the reset timer.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), RESET_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [status, attempt]);

  async function handleClick() {
    const ok = await copyText(email);
    setStatus(ok ? "copied" : "failed");
    setAttempt((n) => n + 1);
  }

  const message =
    status === "copied"
      ? "Email address copied to clipboard."
      : status === "failed"
        ? `Couldn’t copy automatically. The address is ${email}.`
        : "";

  return (
    <>
      <button type="button" className={className} data-state={status} onClick={handleClick}>
        {status === "copied" ? (
          <>
            Copied <span aria-hidden="true">✓</span>
          </>
        ) : status === "failed" ? (
          "Copy failed"
        ) : (
          "Copy email"
        )}
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">
        {message}
      </span>
    </>
  );
}
