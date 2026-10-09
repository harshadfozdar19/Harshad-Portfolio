"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { navItems, profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Nav.module.css";

/**
 * Page order of every section (docs/DESIGN.md), so the menu's § numbers match each
 * SectionHeader even though `research` has no nav entry.
 */
const SECTION_ORDER = [
  "profile",
  "record",
  "method",
  "exhibits",
  "inventory",
  "research",
  "credentials",
  "contact",
];

const NAV_IDS: readonly string[] = navItems.map((item) => item.id);
/** "Contact" gets its own outlined button on desktop, so it is left out of the inline list. */
const INLINE_LINKS = navItems.filter((item) => item.id !== "contact");
const CONTACT = navItems.find((item) => item.id === "contact");

const MENU_ID = "site-menu";
const DESKTOP_QUERY = "(min-width: 900px)";
const SCROLLED_AFTER = 24;

const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

function sectionNumber(id: string): string {
  return String(SECTION_ORDER.indexOf(id) + 1).padStart(2, "0");
}

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const isScrolled = () => window.scrollY > SCROLLED_AFTER;

/** Which nav section is crossing a thin band just above the middle of the viewport. */
function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const intersecting = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        setActive(NAV_IDS.find((id) => intersecting.has(id)) ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);
  const active = useActiveSection();

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 });

  // While the mobile menu is open: lock page scroll, make everything outside the
  // header inert (a modal without a focus-trap loop), move focus into the menu,
  // close on Escape, and close if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const header = headerRef.current;
    const outside = header?.parentElement
      ? Array.from(header.parentElement.children).filter(
          (el): el is HTMLElement => el instanceof HTMLElement && el !== header && !el.inert,
        )
      : [];
    outside.forEach((el) => {
      el.inert = true;
    });

    firstMenuLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onViewportChange = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);

    return () => {
      root.style.overflow = previousOverflow;
      outside.forEach((el) => {
        el.inert = false;
      });
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [open]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      menuButtonRef.current?.focus();
    } else {
      setOpen(true);
    }
  }

  // Following a link closes the menu; the browser's fragment navigation then
  // scrolls to the section and moves the focus starting point there.
  const closeMenu = () => setOpen(false);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={scrolled ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      <motion.div
        className={styles.progress}
        style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }}
        aria-hidden="true"
      />

      <nav aria-label="Primary" className={styles.nav}>
        <div className={`container ${styles.bar}`}>
          <a
            href="#main"
            className={styles.monogram}
            aria-label={`${profile.name}, back to top`}
            onClick={closeMenu}
          >
            <span className={styles.monogramBox} aria-hidden="true">
              {initials}
            </span>
          </a>

          <ul className={styles.links}>
            {INLINE_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={styles.link}
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <ThemeToggle />
            {CONTACT ? (
              <a
                href={`#${CONTACT.id}`}
                className={styles.contact}
                aria-current={active === CONTACT.id ? "true" : undefined}
              >
                {CONTACT.label}
              </a>
            ) : null}
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls={MENU_ID}
              onClick={toggleMenu}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <div id={MENU_ID} className={styles.overlay} data-open={open ? "" : undefined}>
          <div className={`container ${styles.overlayInner}`}>
            <p className={`label ${styles.overlayLabel}`}>
              <span>Contents</span>
              <span>
                Case file · {initials}-{profile.year}
              </span>
            </p>
            <ol className={styles.menuList}>
              {navItems.map((item, index) => (
                <li key={item.id} className={styles.menuItem} style={{ "--i": index } as CSSProperties}>
                  <a
                    ref={index === 0 ? firstMenuLinkRef : undefined}
                    href={`#${item.id}`}
                    className={styles.menuLink}
                    aria-current={active === item.id ? "true" : undefined}
                    onClick={closeMenu}
                  >
                    <span className={styles.menuNumber}>§ {sectionNumber(item.id)}</span>
                    <span className={styles.menuLabel}>{item.label}</span>
                    <span className={styles.menuArrow} aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <div className={styles.menuFoot}>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
