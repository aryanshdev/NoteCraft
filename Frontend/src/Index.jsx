import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import WordRotate from "./components/word-rotate";
import DotGrid from "./components/DotGrid";
import PaperNote from "./components/PaperNote";

const heroNotes = [
  { title: "Welcome", body: "NoteCraft: note taking, made a little easier.", color: "green", tilt: -5, pos: "left-0 top-6", depth: 1 },
  { title: "Live collab", body: "Share a group, edit together, chat in real time.", color: "blue", tilt: 4, pos: "right-0 top-0", depth: 2 },
  { title: "@NC-AI", body: "Mention the assistant in chat to ask about any note.", color: "yellow", tilt: -2, pos: "left-2 top-64", depth: 3 },
  { title: "Demo?", body: "Why watch one — try it yourself and find out.", color: "pink", tilt: 6, pos: "right-0 top-[21rem]", depth: 1.5 },
];

const steps = [
  { n: "01", title: "Make a group", body: "One folder per subject, project or week. Up to eight." },
  { n: "02", title: "Stick notes in it", body: "Twenty notes a group. Star the ones that matter, edit in place." },
  { n: "03", title: "Share & ask", body: "Invite up to three editors, or @mention NC-AI to summarise, quiz or explain." },
];

function HeroNote({ note, index, drift }) {
  const y = useTransform(drift, (v) => v * note.depth * 0.5);
  return (
    <motion.div className={`absolute w-48 md:w-56 ${note.pos}`} style={{ y }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + index * 0.12, type: "spring", stiffness: 140, damping: 14 }}
      >
        <PaperNote title={note.title} body={note.body} color={note.color} tilt={note.tilt} />
      </motion.div>
    </motion.div>
  );
}

function Index() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const drift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), { stiffness: 120, damping: 20 });

  return (
    <>
      <div className="fixed inset-0 -z-10 opacity-70">
        <DotGrid
          dotSize={3}
          gap={26}
          baseColor="#2a2f36"
          activeColor="#ffd43b"
          proximity={110}
          shockRadius={220}
          shockStrength={4}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <header className="fixed z-[100] w-full border-b border-ink-700/70 bg-ink-950/90">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <img src="./notecraft-icon-transparent.png" alt="" className="h-9 w-9" />
            NoteCraft
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-ink-300 md:flex">
            <a href="#how" className="hover:text-ink-100">How it works</a>
            <Link to="/status" className="hover:text-ink-100">Status</Link>
            <a href="/Dashboard" className="btn-primary !py-1.5 text-sm">Open dashboard</a>
          </nav>
          <button
            onClick={() => document.getElementById("mobileMenu").classList.toggle("!hidden")}
            className="ml-auto grid h-9 w-9 place-items-center rounded-md text-ink-300 md:hidden"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div id="mobileMenu" className="!hidden border-t border-ink-700 px-5 py-4 md:!hidden">
          <ul className="flex flex-col gap-4">
            <li><a href="#how">How it works</a></li>
            <li><a href="/login">Get started</a></li>
            <li><a href="/Dashboard">Dashboard</a></li>
          </ul>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-14 px-5 pb-16 pt-28 md:flex-row md:items-center md:gap-8">
        <div className="max-w-xl md:w-[55%]">
          <p className="eyebrow mb-5">Notes · To-dos · Planner</p>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            A desk for
            <br />
            your{" "}
            <span className="inline-flex align-bottom">
              <WordRotate
                duration={2200}
                words={["notes.", "to-dos.", "plans."]}
                className="marked !pb-1"
              />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-300">
            Group your notes, pin them up, and work through them with friends — or with
            an assistant you can <span className="font-mono text-[0.9em] text-ink-100">@mention</span> right
            inside the chat.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/login" className="btn-primary !px-6 !py-3 text-lg">
              Start writing
            </Link>
            <a href="#how" className="btn-ghost !px-5 !py-3">
              How it works
            </a>
          </div>
          <p className="mt-5 text-sm text-ink-400">Free. Sign in with Google or GitHub.</p>
        </div>

        <div className="relative h-[26rem] w-full md:h-[34rem] md:w-[45%]">
          {heroNotes.map((n, i) => (
            <HeroNote key={n.title} note={n} index={i} drift={drift} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-ink-700 bg-ink-950/85">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow mb-3">What is NoteCraft?</p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Sticky notes, minus the fridge.
              </h2>
              <p className="mt-4 text-ink-300">
                Study notes, to-do lists, a weekly plan — keep them as notes on a board you can
                open from anywhere.
              </p>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-xl border border-ink-700 bg-ink-700 sm:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="flex flex-col gap-3 bg-ink-900 p-6">
                  <span className="font-mono text-sm text-marker">{s.n}</span>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-300">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20 grid gap-10 sm:grid-cols-3">
            <PaperNote color="green" tilt={-2} title="Easy to use" body="A plain board of notes. Click to edit, star to keep on top. That's most of it." />
            <PaperNote color="orange" tilt={1.5} title="Assistant on call" body="Type @NC-AI in a group's chat and it answers with your notes as context." />
            <PaperNote color="blue" tilt={-1} title="Work together" body="Share a view-only link, or add editors and watch changes land live." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-24 md:flex-row md:items-center md:justify-between">
        <h2 className="font-hand text-4xl font-bold md:text-5xl">Begin your note-making journey.</h2>
        <Link to="/login" className="btn-primary !px-8 !py-3 text-lg">
          Get started
        </Link>
      </section>

      <footer className="border-t border-ink-700">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-ink-400">
          <span>&copy; 2025 NoteCraft</span>
          <Link to="/status" className="hover:text-ink-100">Service status</Link>
        </div>
      </footer>
    </>
  );
}

export default Index;
