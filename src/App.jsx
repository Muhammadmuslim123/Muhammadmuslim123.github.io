import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Crosshair,
  GithubLogo,
  List,
  ShieldCheck,
  Sword,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const CharacterScene = lazy(() => import("./components/CharacterScene.jsx"));

const navItems = [
  ["Profile", "profile"],
  ["Skills", "skills"],
  ["Quests", "quests"],
  ["Work", "work"],
  ["About", "about"],
];

const skillGroups = [
  {
    title: "Used in real work",
    items: ["Incident triage", "Networks and POS systems", "Salesforce and Jira", "Technical documentation"],
  },
  {
    title: "Built and tested",
    items: ["Python tooling", "Honeypot deployment", "Log review", "Synchronized lab replay"],
  },
  {
    title: "Practicing now",
    items: ["Linux", "Web security", "Independent labs", "Evidence-led reporting"],
  },
  {
    title: "Exploring next",
    items: ["Security operations", "Threat intelligence", "Infrastructure security", "Authorized adversary practice"],
  },
];

const workItems = [
  {
    title: "Cast Sync Replay",
    type: "Public Python tool",
    description:
      "Aligns multiple terminal recordings by timestamp and serves a synchronized browser replay for clearer lab reconstruction.",
    href: "https://github.com/muslimaamir72/Cast-sync-replay",
    action: "View repository",
  },
  {
    title: "Honeypot research",
    type: "Bachelor's project",
    description:
      "Deployed a honeypot, reviewed collected activity, and studied attacker behavior through logs and observed events.",
  },
  {
    title: "Practice evidence workflow",
    type: "Security learning system",
    description:
      "Combines independent lab attempts, terminal recordings, post-session debriefs, and honest evidence labels without exposing private walkthroughs.",
  },
];

class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <CharacterPoster status="3D preview unavailable" />;
    return this.props.children;
  }
}

function CharacterPoster({ status }) {
  return (
    <div className="poster-wrap">
      <img
        src="/character-poster.webp"
        alt="Stylized 3D character of Muhammad wearing a black hoodie, dark jeans, and wheat boots"
        width="512"
        height="626"
      />
      {status ? <p className="scene-status">{status}</p> : null}
    </div>
  );
}

function useDesktopScene() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (min-height: 620px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktop;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Navigation({ menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Muhammad Muslim home">
        MM
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(([label, id]) => (
          <a href={`#${id}`} key={id}>
            {label}
          </a>
        ))}
        <a className="nav-linkedin" href="https://www.linkedin.com/in/muhammad-muslim-67b541268/">
          LinkedIn <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
        </a>
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} /> : <List size={22} />}
        <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
      </button>
      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {navItems.map(([label, id]) => (
              <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <a href="https://www.linkedin.com/in/muhammad-muslim-67b541268/">LinkedIn</a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function PerspectiveToggle({ perspective, setPerspective }) {
  const isBlue = perspective === "blue";
  return (
    <div className="perspective-control" role="group" aria-label="Security perspective">
      <button
        type="button"
        className={isBlue ? "is-active" : ""}
        aria-pressed={isBlue}
        onClick={() => setPerspective("blue")}
      >
        <ShieldCheck size={17} weight="bold" aria-hidden="true" />
        Defense
      </button>
      <button
        type="button"
        className={!isBlue ? "is-active" : ""}
        aria-pressed={!isBlue}
        onClick={() => setPerspective("red")}
      >
        <Sword size={17} weight="bold" aria-hidden="true" />
        Adversary
      </button>
    </div>
  );
}

function App() {
  const [perspective, setPerspective] = useState(() => localStorage.getItem("mm-perspective") || "blue");
  const [introState, setIntroState] = useState("opening");
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const desktopScene = useDesktopScene();

  useEffect(() => {
    document.documentElement.dataset.perspective = perspective;
    localStorage.setItem("mm-perspective", perspective);
  }, [perspective]);

  const enter = () => setIntroState("entered");
  const skip = () => {
    setIntroState("skipped");
    scrollToSection("profile");
  };

  return (
    <div id="top" className="app-shell">
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <aside className="scene-rail" aria-label="Character presentation">
        <div className="scene-frame">
          {desktopScene ? (
            <SceneErrorBoundary>
              <Suspense fallback={<CharacterPoster status="Loading 3D character" />}>
                <CharacterScene perspective={perspective} />
              </Suspense>
            </SceneErrorBoundary>
          ) : (
            <CharacterPoster />
          )}
        </div>
        <PerspectiveToggle perspective={perspective} setPerspective={setPerspective} />
      </aside>

      <main className="content-rail">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Cybersecurity practitioner</p>
            <h1 id="hero-title">Muhammad Muslim</h1>
            <p className="hero-text">Networks, incident triage, Linux, and security practice, shaped into clear evidence.</p>
            <div className="hero-actions">
              <button className="button-primary" type="button" onClick={enter}>
                Enter
              </button>
              <button className="button-secondary" type="button" onClick={skip}>
                Skip intro
              </button>
            </div>
          </div>

          <AnimatePresence>
            {introState === "entered" ? (
              <motion.div
                className="signal-panel"
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.45 }}
              >
                <p>Choose a signal point</p>
                <div>
                  <button type="button" onClick={() => scrollToSection("profile")}>Profile</button>
                  <button type="button" onClick={() => scrollToSection("skills")}>Skills</button>
                  <button type="button" onClick={() => scrollToSection("quests")}>Quests</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        <section id="profile" className="content-section profile-section" aria-labelledby="profile-title">
          <h2 id="profile-title">Security work starts with clear thinking.</h2>
          <p className="section-lead">
            I am a cybersecurity graduate in Vilnius with live technical-support experience across incidents, networks, POS systems, and evidence-driven escalation.
          </p>
          <div className="profile-facts">
            <p>Now building deeper offensive-security and security-operations ability through structured independent practice.</p>
            <p>Comfortable turning messy technical symptoms into a clear next action, a useful note, or a tested tool.</p>
          </div>
        </section>

        <section id="skills" className="content-section skills-section" aria-labelledby="skills-title">
          <h2 id="skills-title">Evidence groups, not percentages.</h2>
          <div className="skills-grid">
            {skillGroups.map((group, index) => (
              <motion.article
                key={group.title}
                className="skill-group"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reducedMotion ? 0 : 0.5, delay: index * 0.05 }}
              >
                <h3>{group.title}</h3>
                <div className="skill-items">
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="quests" className="content-section quests-section" aria-labelledby="quests-title">
          <h2 id="quests-title">Current trajectory</h2>
          <div className="quest-list">
            <article>
              <Crosshair size={22} weight="bold" aria-hidden="true" />
              <div><h3>Independent security practice</h3><p>OSCP-oriented labs with honest tracking of help, blockers, understanding, and reproducibility.</p></div>
            </article>
            <article>
              <ShieldCheck size={22} weight="bold" aria-hidden="true" />
              <div><h3>Cybersecurity degree and honeypot research</h3><p>A completed foundation in security concepts, deployment, log review, and observed attacker behavior.</p></div>
            </article>
            <article>
              <GithubLogo size={22} weight="bold" aria-hidden="true" />
              <div><h3>Tools for better evidence</h3><p>Small systems that make technical practice easier to replay, explain, and improve.</p></div>
            </article>
          </div>
        </section>

        <section id="work" className="content-section work-section" aria-labelledby="work-title">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-title">A small amount of real proof.</h2>
          <div className="work-list">
            {workItems.map((item) => (
              <article key={item.title}>
                <p className="work-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.href ? (
                  <a href={item.href}>
                    {item.action} <ArrowUpRight size={17} weight="bold" aria-hidden="true" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-title">
          <h2 id="about-title">From support pressure to security depth.</h2>
          <p>
            Technical support taught me to stay calm around incomplete information. Cybersecurity gives that habit a sharper direction: understand the system, test the assumption, preserve the evidence, and communicate what matters.
          </p>
          <a className="linkedin-cta" href="https://www.linkedin.com/in/muhammad-muslim-67b541268/">
            Connect on LinkedIn <ArrowUpRight size={19} weight="bold" aria-hidden="true" />
          </a>
        </section>

        <footer>
          <p>Muhammad Muslim</p>
          <p>Cybersecurity practice and technical tooling</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
