import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAssessmentTrack } from "./services/assessmentTrack";
import type { AssessmentTrack } from "./types/onboarding";

interface JourneyOption {
  index: string;
  title: string;
  body: string;
  action: string;
  assessmentTrack: AssessmentTrack;
}

interface PathStep {
  index: string;
  title: string;
  body: string;
}

const journeyOptions: JourneyOption[] = [
  {
    index: "01",
    title: "I'm Still Exploring",
    body: "I don't know which tech direction fits me yet.",
    action: "Start Exploring",
    assessmentTrack: "exploring"
  },
  {
    index: "02",
    title: "I Know My Goal",
    body: "I have some experience and want a clear roadmap.",
    action: "Build My Roadmap",
    assessmentTrack: "goal-focused"
  }
];

const pathSteps: PathStep[] = [
  {
    index: "01",
    title: "Tell us about yourself",
    body: "Share your background, interests, and how you like to work."
  },
  {
    index: "02",
    title: "Discover your direction",
    body: "The assessment maps your answers to the tech fields that fit."
  },
  {
    index: "03",
    title: "Get your roadmap",
    body: "Turn your direction into practical next steps and milestones."
  }
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="tw-arrow-icon">
      <path d="M4.5 10h10M10.5 6l4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="tw-icon">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="tw-icon">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function BrandMark() {
  return (
    <Link to="/" className="tw-brand" aria-label="The Way home">
      <span className="tw-brand-mark" aria-hidden="true">
        <span />
      </span>
      <span>The Way</span>
    </Link>
  );
}

function CareerNetwork() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    setTilt({
      x: Number((x * 7).toFixed(2)),
      y: Number((y * -5).toFixed(2))
    });
  }

  return (
    <div
      className="career-network"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        "--network-rotate-x": `${tilt.y}deg`,
        "--network-rotate-y": `${tilt.x}deg`
      } as CSSProperties}
    >
      <div className="career-network__orb career-network__orb--one" />
      <div className="career-network__orb career-network__orb--two" />
      <svg className="career-network__lines" viewBox="0 0 520 520">
        <path className="career-network__path career-network__path--primary" d="M260 258 C190 210 164 151 112 133" />
        <path className="career-network__path career-network__path--primary" d="M260 258 C335 202 369 144 422 119" />
        <path className="career-network__path" d="M260 258 C176 284 127 339 89 401" />
        <path className="career-network__path" d="M260 258 C343 285 386 350 440 405" />
        <path className="career-network__path career-network__path--soft" d="M112 133 C221 82 332 82 422 119" />
        <path className="career-network__path career-network__path--soft" d="M89 401 C184 456 319 455 440 405" />
      </svg>
      <div className="career-node career-node--center">
        <span>AI</span>
        <small>Guide point</small>
      </div>
      <div className="career-node career-node--frontend">
        <span>Frontend</span>
      </div>
      <div className="career-node career-node--backend">
        <span>Backend</span>
      </div>
      <div className="career-node career-node--data">
        <span>Data</span>
      </div>
      <div className="career-node career-node--devops">
        <span>DevOps</span>
      </div>
      <div className="career-particle career-particle--one" />
      <div className="career-particle career-particle--two" />
      <div className="career-particle career-particle--three" />
    </div>
  );
}

function JourneyCard({ option }: { option: JourneyOption }) {
  const navigate = useNavigate();

  function handleChooseTrack() {
    saveAssessmentTrack(option.assessmentTrack);
    navigate("/auth", { state: { assessmentTrack: option.assessmentTrack } });
  }

  return (
    <article className="journey-card reveal-card">
      <div className="journey-card__top">
        <span>{option.index}</span>
      </div>
      <h3>{option.title}</h3>
      <p>{option.body}</p>
      <button type="button" className="tw-button tw-button--ghost journey-card__button" onClick={handleChooseTrack}>
        <span>{option.action}</span>
        <ArrowIcon />
      </button>
    </article>
  );
}

function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function start(track: AssessmentTrack) {
    saveAssessmentTrack(track);
    navigate("/auth", { state: { assessmentTrack: track } });
  }

  return (
    <header className={`landing-nav ${isScrolled ? "landing-nav--scrolled" : ""}`}>
      <div className="landing-nav__inner">
        <BrandMark />
        <nav className="landing-nav__links" aria-label="Landing sections">
          <a href="#how-it-works">How it Works</a>
          <a href="#choose-journey">Why The Way</a>
        </nav>
        <div className="landing-nav__actions">
          <Link to="/auth" className="tw-button tw-button--subtle">
            Sign In
          </Link>
          <button type="button" className="tw-button tw-button--primary tw-button--small" onClick={() => start("exploring")}>
            Get Started
          </button>
        </div>
        <button
          type="button"
          className="tw-icon-button landing-nav__menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <div className={`mobile-menu ${isMenuOpen ? "mobile-menu--open" : ""}`}>
        <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
          How it Works
        </a>
        <a href="#choose-journey" onClick={() => setIsMenuOpen(false)}>
          Why The Way
        </a>
        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
          Sign In
        </Link>
        <button type="button" onClick={() => start("exploring")}>
          Get Started
        </button>
      </div>
    </header>
  );
}

export default function App() {
  const navigate = useNavigate();

  function start(track: AssessmentTrack) {
    saveAssessmentTrack(track);
    navigate("/auth", { state: { assessmentTrack: track } });
  }

  return (
    <main className="tw-page landing-page">
      <div className="tw-bg" aria-hidden="true">
        <span className="tw-bg__grid" />
        <span className="tw-bg__light tw-bg__light--left" />
        <span className="tw-bg__light tw-bg__light--right" />
      </div>

      <LandingNav />

      <section className="landing-hero page-enter" aria-labelledby="landing-title">
        <div className="landing-hero__content">
          <p className="tw-eyebrow hero-stagger hero-stagger--one">AI-powered career guidance</p>
          <h1 id="landing-title" className="tw-display hero-stagger hero-stagger--two">
            <span>Find your way</span>
            <span>into tech.</span>
          </h1>
          <p className="tw-body-large hero-stagger hero-stagger--three">
            Discover the tech career that fits you and turn it into a clear learning path.
          </p>
          <div className="landing-hero__actions hero-stagger hero-stagger--four">
            <button type="button" className="tw-button tw-button--primary" onClick={() => start("exploring")}>
              <span>Start Exploring</span>
              <ArrowIcon />
            </button>
            <button type="button" className="tw-button tw-button--secondary" onClick={() => start("goal-focused")}>
              <span>Build My Roadmap</span>
              <ArrowIcon />
            </button>
          </div>
        </div>
        <div className="landing-hero__visual hero-stagger hero-stagger--five">
          <CareerNetwork />
        </div>
      </section>

      <section id="how-it-works" className="landing-section landing-path-section reveal-section" aria-labelledby="how-title">
        <div className="landing-section__heading">
          <p className="tw-eyebrow">How it works</p>
          <h2 id="how-title" className="tw-h2">A short path from uncertainty to direction.</h2>
        </div>
        <div className="path-steps">
          <span className="path-steps__line" aria-hidden="true" />
          {pathSteps.map((step) => (
            <article key={step.index} className="path-step">
              <span className="path-step__number">{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="choose-journey" className="landing-section journey-section reveal-section" aria-labelledby="journey-title">
        <div className="landing-section__heading">
          <p className="tw-eyebrow">Choose your journey</p>
          <h2 id="journey-title" className="tw-h2">Start with the question you actually have.</h2>
        </div>
        <div className="journey-grid">
          {journeyOptions.map((option) => (
            <JourneyCard key={option.assessmentTrack} option={option} />
          ))}
        </div>
      </section>
    </main>
  );
}
