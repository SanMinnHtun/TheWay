import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import StarField from "./components/effects/StarField";
import { useRevealOnView } from "./hooks/useRevealOnView";
import { saveAssessmentTrack } from "./services/assessmentTrack";
import type { AssessmentTrack } from "./types/onboarding";

interface Option {
  title: string;
  body: string;
  items: string[];
  action: string;
  assessmentTrack: AssessmentTrack;
}

interface InfoCardContent {
  className: string;
  title: string;
  accent: string;
  text: string;
}

const options: Option[] = [
  {
    title: "I’m Still Exploring",
    body: "For students who aren’t sure which career path fits them yet",
    items: [
      "Discover careers based on your interest",
      "Understand what kind of work suits you",
      "See what skills and projects to focus on"
    ],
    action: "Start Exploring",
    assessmentTrack: "exploring"
  },
  {
    title: "I Know My Goal",
    body: "For students who already have a target career but need a clear roadmap.",
    items: [
      "Turn your goal into a step-by-step plan",
      "Get guidance on what to do next",
      "See what skills and projects to focus on"
    ],
    action: "Build My Roadmap",
    assessmentTrack: "goal-focused"
  }
];

const infoCards: InfoCardContent[] = [
  {
    className: "info-one",
    title: "What Is ",
    accent: "The Way?",
    text: "The Way is an intelligent career guidance platform designed to eliminate academic uncertainty. We provide students with clear, actionable roadmaps to navigate learning paths and reach their dream careers.\n\nWe break down overwhelming goals into manageable daily milestones. Whether you are discovering your passion or building targeted skills, our step-by-step guidance gives you a direct, predictable path to success."
  },
  {
    className: "info-two",
    title: "Who ",
    accent: "We Are?",
    text: "We are 4th-year IT engineering students passionate about solving real-world student challenges. Combining our technical background with intelligent automation, we build smart, accessible tools that eliminate career confusion and help learners navigate their future with confidence."
  },
  {
    className: "info-three",
    title: "What You Have To ",
    accent: "Do?",
    text: "Share your goal or explore your interests. Follow your customized roadmap, complete practical milestones, and build a career-ready portfolio step by step."
  }
];

function CheckIcon() {
  return (
    <span className="check-icon" aria-hidden="true">
      <svg viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.2 9.1 7.7 11.6 12.9 6.4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function OptionCard({
  option,
  isSelected,
  isMuted,
  onChoose
}: {
  option: Option;
  isSelected: boolean;
  isMuted: boolean;
  onChoose: (track: AssessmentTrack) => void;
}) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateY = ((x / bounds.width - 0.5) * 6).toFixed(2);
    const rotateX = ((0.5 - y / bounds.height) * 4).toFixed(2);

    card.style.setProperty("--card-pointer-x", `${x}px`);
    card.style.setProperty("--card-pointer-y", `${y}px`);
    card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
    card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--card-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--card-rotate-y", "0deg");
  }

  return (
    <section
      className={`choice-card ${isSelected ? "choice-card--selected" : ""} ${isMuted ? "choice-card--muted" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <h2>{option.title}</h2>
      <p>{option.body}</p>
      <ul>
        {option.items.map((item, index) => (
          <li key={item} style={{ "--item-index": index } as CSSProperties}>
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChoose(option.assessmentTrack)}
      >
        {option.action} <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function InfoCard({ card }: { card: InfoCardContent }) {
  const { ref, isVisible } = useRevealOnView<HTMLElement>();

  return (
    <article ref={ref} className={`info-card reveal-on-scroll ${isVisible ? "is-visible" : ""} ${card.className}`}>
      <h3>
        {card.title}
        <span>{card.accent}</span>
      </h3>
      {card.text.split("\n\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [choosingTrack, setChoosingTrack] = useState<AssessmentTrack | null>(null);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  function handleChooseTrack(track: AssessmentTrack) {
    if (choosingTrack) {
      return;
    }

    saveAssessmentTrack(track);
    setChoosingTrack(track);

    transitionTimer.current = window.setTimeout(() => {
      navigate("/auth", { state: { assessmentTrack: track } });
    }, 260);
  }

  return (
    <main className={`min-h-screen overflow-hidden bg-[#02090f] text-white page-transition ${choosingTrack ? "page-transition--exit" : ""}`}>
      <div className="landing-shell">
        <StarField density={1.18} intensity={0.98} />
        <div className="glow glow-left" />
        <div className="glow glow-bottom" />

        <section className="hero page-enter">
          <p className="eyebrow hero-kicker">CAREER GUIDANCE</p>
          <h1>
            <span className="hero-line hero-line--one">Find The Right Career Starting</span>
            <span className="hero-line hero-line--two">Point For Your Journey</span>
          </h1>
          <p className="subcopy hero-copy">
            Choose the kind of guidance you need right now.<br />
            You can either explore career paths that fit you, or get a roadmap for<br />
            a goal you already have.
          </p>

          <div className="choice-grid">
            {options.map((option) => (
              <OptionCard
                key={option.title}
                option={option}
                isSelected={choosingTrack === option.assessmentTrack}
                isMuted={Boolean(choosingTrack && choosingTrack !== option.assessmentTrack)}
                onChoose={handleChooseTrack}
              />
            ))}
          </div>
        </section>

        <section className="info-grid" aria-label="About The Way">
          {infoCards.map((card) => (
            <InfoCard key={card.accent} card={card} />
          ))}
        </section>
      </div>
    </main>
  );
}
