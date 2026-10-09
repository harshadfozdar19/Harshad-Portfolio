import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

/*
 * Social card in the "Case File" style. Rendered once at build time.
 * Fonts are read from local @fontsource packages (the same families the site self-hosts),
 * so generating the image never touches the network. Satori accepts ttf/otf/woff, not woff2.
 * Next.js reuses this image for `twitter:image` when no twitter-image file exists.
 */

export const alt = `${profile.name}, ${profile.role}. Case file cover.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

const [serif, serifItalic, mono] = await Promise.all([
  fontFile("instrument-serif", "instrument-serif-latin-400-normal.woff"),
  fontFile("instrument-serif", "instrument-serif-latin-400-italic.woff"),
  fontFile("ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff"),
]);

const color = {
  paper: "#f2eee5",
  ink: "#16140f",
  ink2: "#3e3a32",
  muted: "#6b6558",
  line: "rgba(22, 20, 15, 0.18)",
  signal: "#d93a14",
};

const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
const caseNumber = `${initials}-${profile.year}`;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "56px 72px",
        background: color.paper,
        color: color.ink,
        fontFamily: "Plex Mono",
      }}
    >
      {/* Metadata strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: color.muted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, background: color.signal }} />
          <div style={{ display: "flex", color: color.ink }}>{`Case File · ${caseNumber}`}</div>
        </div>
        <div style={{ display: "flex" }}>{profile.location}</div>
      </div>
      <div style={{ display: "flex", height: 2, marginTop: 22, background: color.ink }} />

      {/* Stamp */}
      <div
        style={{
          position: "absolute",
          top: 148,
          right: 84,
          display: "flex",
          padding: "10px 22px",
          border: `4px solid ${color.signal}`,
          borderRadius: 6,
          color: color.signal,
          fontSize: 26,
          letterSpacing: 6,
          textTransform: "uppercase",
          transform: "rotate(-8deg)",
          opacity: 0.92,
        }}
      >
        Open case
      </div>

      {/* Name + role */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "Instrument Serif",
            fontSize: 172,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          <span>{profile.firstName}</span>
          <span style={{ marginLeft: 36, fontStyle: "italic", color: color.signal }}>{profile.lastName}</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Instrument Serif",
            fontSize: 60,
            lineHeight: 1.1,
            color: color.ink,
          }}
        >
          {profile.role}
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ display: "flex", height: 1, marginTop: 44, background: color.line }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          fontSize: 22,
          letterSpacing: 2,
          color: color.ink2,
        }}
      >
        <div style={{ display: "flex" }}>Cybersecurity · OSINT · AI investigation systems</div>
        <div style={{ display: "flex", color: color.muted }}>§ 01</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Plex Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
