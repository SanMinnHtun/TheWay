import { useNavigate } from "react-router-dom";
import StarField from "./components/effects/StarField";
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

function OptionCard({ option }: { option: Option }) {
  const navigate = useNavigate();

  const handleChooseTrack = () => {
    saveAssessmentTrack(option.assessmentTrack);
    navigate("/auth", { state: { assessmentTrack: option.assessmentTrack } });
  };

  return (
    <section className="choice-card">
      <h2>{option.title}</h2>
      <p>{option.body}</p>
      <ul>
        {option.items.map((item) => (
          <li key={item}>
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleChooseTrack}
      >
        {option.action} <span>→</span>
      </button>
    </section>
  );
}

function InfoCard({ card }: { card: InfoCardContent }) {
  return (
    <article className={`info-card ${card.className}`}>
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
  return (
    <main className="min-h-screen overflow-hidden bg-[#02090f] text-white">
      <div className="landing-shell">
        <StarField />
        <div className="glow glow-left" />
        <div className="glow glow-bottom" />

        <section className="hero">
          <p className="eyebrow">CAREER GUIDANCE</p>
          <h1>Find The Right Career Starting Point For Your Journey</h1>
          <p className="subcopy">
            Choose the kind of guidance you need right now.<br />
            You can either explore career paths that fit you, or get a roadmap for<br />
            a goal you already have.
          </p>

          <div className="choice-grid">
            {options.map((option) => (
              <OptionCard key={option.title} option={option} />
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
