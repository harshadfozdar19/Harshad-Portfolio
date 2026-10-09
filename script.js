(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* Calls cb(true) while `el` is on screen AND the tab is visible, cb(false) otherwise.
     Used to stop timers / rAF loops that would otherwise run forever. */
  const whileActive = (el, cb, rootMargin = "0px") => {
    if (!el) return;
    let inView = false, last;
    const update = () => {
      const on = inView && !document.hidden;
      if (on !== last) cb((last = on));
    };
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      update();
    }, { rootMargin }).observe(el);
    document.addEventListener("visibilitychange", update);
  };

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Split hero title into letters ---------- */
  $$(".split").forEach((el) => {
    const chars = [...el.textContent];
    const isGrad = el.classList.contains("grad-text");
    el.textContent = "";
    chars.forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      if (isGrad) {
        // one continuous gradient spread across the letters
        s.style.backgroundSize = `${chars.length * 100}% 100%`;
        s.style.backgroundPosition = `${(i / Math.max(chars.length - 1, 1)) * 100}% 0`;
      }
      s.style.transitionDelay = `${0.15 + i * 0.045 + (isGrad ? 0.25 : 0)}s`;
      el.appendChild(s);
    });
  });
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add("loaded"), 60));

  /* ---------- Marquee: append an aria-hidden copy so the -50% loop is seamless ---------- */
  const track = $(".marquee-track");
  if (track) {
    [...track.children].forEach((n) => {
      const c = n.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      track.appendChild(c);
    });
    track.classList.add("looped");
  }

  /* ---------- Pause CSS animations in off-screen sections ---------- */
  const animIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle("is-offscreen", !e.isIntersecting)),
    { rootMargin: "120px 0px" }
  );
  $$("main > section").forEach((s) => animIO.observe(s));

  /* ---------- Reveal on scroll (with sibling stagger) ---------- */
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("in");
        revealIO.unobserve(el);
        // once the reveal has finished, hand transitions back to the element's own CSS
        const delay = parseFloat(el.style.getPropertyValue("--d")) || 0;
        setTimeout(() => el.classList.add("revealed"), reduceMotion ? 0 : 1100 + delay * 1000);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const idx = sibs.indexOf(el);
    if (idx > 0) el.style.setProperty("--d", `${Math.min(idx * 0.08, 0.5)}s`);
    revealIO.observe(el);
  });

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        countIO.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.decimals || "0", 10);
        const suffix = el.dataset.suffix || "";
        if (reduceMotion) {
          el.textContent = target.toFixed(dec) + suffix;
          return;
        }
        const dur = 1600;
        let start;
        const tick = (now) => {
          if (start === undefined) start = now; // rAF time can be earlier than performance.now()
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = (target * eased).toFixed(dec) + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => {
    // screen readers get the real value instead of the animated "0"
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = parseFloat(el.dataset.count).toFixed(dec) + (el.dataset.suffix || "");
    el.setAttribute("aria-hidden", "true");
    el.after(sr);
    countIO.observe(el);
  });

  /* ---------- Nav: scrolled state, progress, active link ---------- */
  const nav = $(".nav");
  const progress = $(".progress");
  let scrollQueued = false;
  const updateScroll = () => {
    scrollQueued = false;
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 30);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };
  const onScroll = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateScroll);
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  updateScroll();

  const links = $$(".nav-links a");
  const sectionIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const href = e.target.id ? `#${e.target.id}` : "";
        links.forEach((a) => {
          const on = a.getAttribute("href") === href;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  // the hero is observed too, so scrolling back to the top clears the highlight
  $$(".hero, section[id]").forEach((s) => sectionIO.observe(s));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $(".menu-btn");
  const menu = $(".mobile-menu");
  if (menuBtn && menu) {
    const behind = [$("main"), $("footer")].filter(Boolean);
    const isOpen = () => document.body.classList.contains("menu-open");
    const setMenu = (open, restoreFocus = true) => {
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      behind.forEach((el) => (el.inert = open)); // keep Tab inside header + menu while open
      if (open) {
        const first = menu.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      } else if (restoreFocus) {
        menuBtn.focus({ preventScroll: true });
      }
    };
    menuBtn.addEventListener("click", () => setMenu(!isOpen()));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false, false)));
    menu.addEventListener("click", (e) => {
      if (e.target === menu) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) setMenu(false);
    });
    // menu is hidden by CSS above 920px: don't leave the page scroll-locked / inert
    const wide = window.matchMedia("(min-width: 921px)");
    const onWide = () => {
      if (wide.matches && isOpen()) setMenu(false, false);
    };
    if (wide.addEventListener) wide.addEventListener("change", onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- Role rotator ---------- */
  const roles = [
    "AI investigation engines",
    "LangGraph agents",
    "OSINT pipelines",
    "RAG systems",
    "async worker queues",
    "full-stack products",
  ];
  const word = $(".rot-word");
  if (word && !reduceMotion) {
    let ri = 0, rotTimer = 0;
    const swap = () => {
      word.classList.add("out");
      setTimeout(() => {
        ri = (ri + 1) % roles.length;
        word.textContent = roles[ri];
        // jump (untransitioned) to the "below" position, then animate up into place
        word.style.transition = "none";
        word.classList.remove("out");
        word.classList.add("in");
        void word.offsetWidth;
        word.style.transition = "";
        word.classList.remove("in");
      }, 420);
    };
    whileActive($(".hero"), (on) => {
      clearInterval(rotTimer);
      rotTimer = on ? setInterval(swap, 2600) : 0;
    });
  }

  /* ---------- Terminal typing ---------- */
  const term = $("#terminal");
  const script = [
    [["c-d", "$ "], ["c-v", "agent"], ["", " investigate --target "], ["c-c", "acme-corp"]],
    [["c-d", "› "], ["", "scheduler: "], ["c-g", "3 new targets detected"]],
    [["c-d", "› "], ["", "queue "], ["c-a", "bullmq:enrich"], ["", " priority="], ["c-r", "HIGH"]],
    [["c-d", "› "], ["", "worker#2 playwright → "], ["c-g", "14 accounts extracted"]],
    [["c-d", "› "], ["", "dedupe + enrich → "], ["c-c", "repos, commits, identities"]],
    [["c-d", "› "], ["", "semantic search: "], ["c-g", "6 correlated signals"]],
    [["c-d", "› "], ["c-v", "langgraph"], ["", " tools: github · search · embeddings"]],
    [["c-d", "› "], ["c-v", "gemini"], ["", " reasoning over evidence…"]],
    [["c-g", "✔ verdict "], ["", "{ risk: "], ["c-r", "\"high\""], ["", ", type: "], ["c-a", "\"impersonation\""], ["", " }"]],
  ];

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const renderLine = (parts, upto) => {
    let out = "", n = upto;
    for (const [cls, txt] of parts) {
      if (n <= 0) break;
      const t = txt.slice(0, n);
      n -= t.length;
      out += cls ? `<span class="${cls}">${esc(t)}</span>` : esc(t);
    }
    return out;
  };
  const lineLen = (parts) => parts.reduce((a, [, t]) => a + t.length, 0);

  if (term) {
    const fullText = script.map((l) => renderLine(l, Infinity)).join("\n");

    if (reduceMotion) {
      term.innerHTML = fullText;
    } else {
      // Reserve the height of the finished output so the hero doesn't grow while typing
      // (lines wrap on narrow screens) and shrink again when the loop restarts.
      let reservedFor = -1;
      const reserve = () => {
        const w = term.clientWidth;
        if (w === reservedFor) return;
        reservedFor = w;
        const current = term.innerHTML;
        term.style.minHeight = "";
        term.innerHTML = fullText + '\n<span class="caret"></span>';
        const h = term.getBoundingClientRect().height;
        term.innerHTML = current;
        term.style.minHeight = `${Math.ceil(h)}px`;
      };
      reserve();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { reservedFor = -1; reserve(); });
      let rz;
      addEventListener("resize", () => {
        clearTimeout(rz);
        rz = setTimeout(reserve, 150);
      });

      // typing only advances while the terminal is visible and the tab is in the foreground
      let active = false, resume = null;
      whileActive(term, (on) => {
        active = on;
        if (on && resume) {
          resume();
          resume = null;
        }
      });
      const whenActive = () => (active ? null : new Promise((r) => (resume = r)));

      (async () => {
        while (true) {
          const done = [];
          for (const line of script) {
            const len = lineLen(line);
            const speed = done.length === 0 ? 38 : 12;
            for (let i = 1; i <= len; i++) {
              await whenActive();
              term.innerHTML = [...done, renderLine(line, i) + '<span class="caret"></span>'].join("\n");
              await wait(speed + Math.random() * 18);
            }
            done.push(renderLine(line, len));
            await wait(done.length === 1 ? 500 : 260);
          }
          term.innerHTML = done.join("\n") + '\n<span class="caret"></span>';
          await wait(4200);
          await whenActive();
        }
      })();
    }
  }

  /* ---------- Pipeline sequential glow ---------- */
  const nodes = $$(".pipeline .node");
  if (nodes.length && !reduceMotion) {
    let ni = 0, pipeTimer = 0;
    const step = () => {
      nodes.forEach((n, i) => n.classList.toggle("lit", i === ni));
      ni = (ni + 1) % nodes.length;
    };
    whileActive($(".pipeline"), (on) => {
      clearInterval(pipeTimer);
      pipeTimer = on ? setInterval(step, 900) : 0;
    });
  }

  /* ---------- Copy email ---------- */
  const toast = $(".toast");
  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    const mailLink = $('a[href^="mailto:"]');
    const email = mailLink ? decodeURIComponent(mailLink.getAttribute("href").slice(7).split("?")[0]) : "harshad622004fozdar@gmail.com";
    // The toast is a live region: keep it empty until it's shown, so the message is
    // actually announced (a live region whose text never changes is never read out).
    const toastHTML = toast ? toast.innerHTML : "";
    if (toast) toast.textContent = "";
    let toastTimer, clearTimer;
    const showToast = () => {
      if (!toast) return;
      clearTimeout(toastTimer);
      clearTimeout(clearTimer);
      toast.innerHTML = toastHTML;
      toast.classList.add("show");
      toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        clearTimer = setTimeout(() => (toast.textContent = ""), 450);
      }, 1800);
    };
    const legacyCopy = (text) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {}
      ta.remove();
      copyBtn.focus({ preventScroll: true }); // select() moved focus away
      return ok;
    };
    copyBtn.addEventListener("click", async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(email);
        ok = true;
      } catch {
        ok = legacyCopy(email);
      }
      if (ok) {
        showToast();
      } else if (mailLink) {
        // couldn't copy: select the address so the user can copy it themselves
        const sel = window.getSelection();
        sel.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(mailLink);
        sel.addRange(range);
      }
    });
  }

  if (finePointer && !reduceMotion) {
    /* ---------- Cursor glow (rAF only runs while easing toward the pointer) ---------- */
    const glow = $(".cursor-glow");
    if (glow) {
      let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy, glowRaf = 0;
      const glowStep = () => {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        glowRaf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.25 ? requestAnimationFrame(glowStep) : 0;
      };
      addEventListener("pointermove", (e) => {
        tx = e.clientX;
        ty = e.clientY;
        glow.style.opacity = 1;
        if (!glowRaf) glowRaf = requestAnimationFrame(glowStep);
      }, { passive: true });
      // pointer left the window
      document.addEventListener("mouseout", (e) => {
        if (!e.relatedTarget) glow.style.opacity = 0;
      });
    }

    /* ---------- Spotlight position ---------- */
    $$(".spotlight").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }, { passive: true });
    });

    /* ---------- 3D tilt ---------- */
    $$(".tilt").forEach((el) => {
      const max = el.classList.contains("terminal") ? 8 : 3.5;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        // keep the hover box-shadow fade that the CSS transition provides
        el.style.transition = "transform .15s ease-out, box-shadow .5s var(--ease)";
        el.style.transform = `perspective(1100px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
      }, { passive: true });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "";
        el.style.transform = "";
      });
    });

    /* ---------- Magnetic buttons ---------- */
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      }, { passive: true });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  startConstellation();

  /* ---------- Hero constellation (signal graph) ---------- */
  function startConstellation() {
    const canvas = $("#constellation");
    const hero = $(".hero");
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, pts = [], raf = 0, active = false;
    const mouse = { x: -9999, y: -9999 };
    const colors = ["164,139,255", "106,168,255", "34,211,238"];
    const LINK = 130, LINK2 = LINK * LINK;
    const PULL = 180, PULL2 = PULL * PULL;
    const MAX_DEVICE_PX = 3.5e6; // cap backing-store size on big / hi-DPI screens

    const makePoint = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      c: colors[(Math.random() * colors.length) | 0],
    });

    const resize = () => {
      const nw = hero.clientWidth, nh = hero.clientHeight;
      // mobile URL-bar show/hide fires resize without changing the hero: keep the points
      if (nw === w && nh === h) return;
      if (w && h) {
        for (const p of pts) {
          p.x *= nw / w;
          p.y *= nh / h;
        }
      }
      w = nw;
      h = nh;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w * h * dpr * dpr > MAX_DEVICE_PX) dpr = Math.max(1, Math.sqrt(MAX_DEVICE_PX / (w * h)));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.floor((w * h) / 14000));
      while (pts.length < count) pts.push(makePoint());
      pts.length = count;
      render(); // resizing clears the canvas; repaint now (matters for the static reduced-motion frame)
    };

    const step = () => {
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        if (dx * dx + dy * dy < PULL2) {
          p.x += dx * 0.006;
          p.y += dy * 0.006;
        }
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        else if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        else if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy); }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.7;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            ctx.strokeStyle = `rgba(${a.c},${(1 - Math.sqrt(d2) / LINK) * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const mx = mouse.x - a.x, my = mouse.y - a.y, md2 = mx * mx + my * my;
        if (md2 < PULL2) {
          ctx.strokeStyle = `rgba(${a.c},${(1 - Math.sqrt(md2) / PULL) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${a.c},0.9)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = () => {
      raf = 0;
      if (!active) return;
      step();
      render();
      raf = requestAnimationFrame(frame);
    };

    resize();
    let rz;
    addEventListener("resize", () => {
      clearTimeout(rz);
      rz = setTimeout(resize, 150);
    });

    if (reduceMotion) return; // one static frame, no loop, no pointer tracking

    hero.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener("pointerleave", () => (mouse.x = mouse.y = -9999));

    // exactly one rAF loop, and only while the hero is visible in a foreground tab
    whileActive(hero, (on) => {
      active = on;
      if (on && !raf) raf = requestAnimationFrame(frame);
      if (!on && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
  }
})();
