"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.92); }
    60% { transform: scale(1.03); }
    100% { opacity: 1; transform: scale(1); }
  }
  .anim-fade-in-up { animation: fadeInUp 0.4s ease forwards; }
  .anim-pop-in { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .anim-fade-out { opacity: 0 !important; transform: translateY(-12px) !important; transition: opacity 0.25s ease, transform 0.25s ease; }
  .anim-fade-visible { opacity: 1; transform: translateY(0); transition: opacity 0.3s ease, transform 0.3s ease; }
`;

type Personality = "Cozy Classic" | "Social Butterfly" | "Health Nut" | "Indulgent Treat";

interface Option {
  emoji: string;
  text: string;
  personality: Personality;
}

interface Question {
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    question: "What does your ideal weekend look like?",
    options: [
      { emoji: "🏡", text: "Curled up at home with Netflix and takeout", personality: "Cozy Classic" },
      { emoji: "🎉", text: "Brunch and hanging out with a big group", personality: "Social Butterfly" },
      { emoji: "🥗", text: "Farmers market, meal prep, early bedtime", personality: "Health Nut" },
      { emoji: "🍰", text: "Sleeping in, then treating yourself to something indulgent", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "How do you take your vacations?",
    options: [
      { emoji: "🏖️", text: "All-inclusive resort — relaxation is the point", personality: "Cozy Classic" },
      { emoji: "🗺️", text: "Group trip with lots of people and activities", personality: "Social Butterfly" },
      { emoji: "🧘", text: "Wellness retreat or hiking in nature", personality: "Health Nut" },
      { emoji: "🛎️", text: "Boutique hotel with great food and spa", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "What's your approach to Friday night?",
    options: [
      { emoji: "📺", text: "Early night in — recharge for the weekend", personality: "Cozy Classic" },
      { emoji: "🍹", text: "Happy hour that turns into a late night", personality: "Social Butterfly" },
      { emoji: "🏃", text: "Evening run or gym session", personality: "Health Nut" },
      { emoji: "🍽️", text: "A really good dinner, maybe dessert too", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "How do you handle a stressful day?",
    options: [
      { emoji: "🛋️", text: "Comfort food and your favorite show", personality: "Cozy Classic" },
      { emoji: "📱", text: "Vent to a friend or call someone", personality: "Social Butterfly" },
      { emoji: "🚶", text: "Go for a walk or do something active", personality: "Health Nut" },
      { emoji: "🛁", text: "Long bath, candles, full self-care mode", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "What's your ideal coffee shop experience?",
    options: [
      { emoji: "🪑", text: "A quiet corner table, alone with your thoughts", personality: "Cozy Classic" },
      { emoji: "👯", text: "Meeting a friend — the coffee is secondary", personality: "Social Butterfly" },
      { emoji: "🌿", text: "Clean, bright space, maybe a plant-based snack", personality: "Health Nut" },
      { emoji: "🧁", text: "Something seasonal on the menu and a pastry", personality: "Indulgent Treat" },
    ],
  },
];

const personalities: Record<Personality, { coffee: string; tagline: string; image: string; description: string }> = {
  "Cozy Classic": {
    coffee: "Medium Roast Drip",
    tagline: "Comfort in every cup",
    image: "/cozy-classic.jpg",
    description: "You know what you like and you like what you know. There's real sophistication in that.",
  },
  "Social Butterfly": {
    coffee: "Cappuccino",
    tagline: "Coffee is better with company",
    image: "/social-butterfly.jpg",
    description: "For you, coffee is a reason to connect. The drink is great — the conversation is better.",
  },
  "Health Nut": {
    coffee: "Oat Milk Americano",
    tagline: "Wellness in every sip",
    image: "/health-nut.jpg",
    description: "You treat your body well and your coffee reflects that. Clean, intentional, and genuinely good.",
  },
  "Indulgent Treat": {
    coffee: "Mocha with Whip",
    tagline: "Coffee is dessert",
    image: "/indulgent-treat.jpg",
    description: "Life is short and you refuse to be boring about it. Your coffee is a full experience.",
  },
};

type Screen = "intro" | "quiz" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Personality, number>>({
    "Cozy Classic": 0,
    "Social Butterfly": 0,
    "Health Nut": 0,
    "Indulgent Treat": 0,
  });
  const [selected, setSelected] = useState<Personality | null>(null);
  const [result, setResult] = useState<Personality | null>(null);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [currentQuestion]);

  function handleSelect(personality: Personality) {
    setSelected(personality);
  }

  function handleNext() {
    if (!selected || animating) return;
    setAnimating(true);
    setVisible(false);
    setTimeout(() => {
      const newScores = { ...scores, [selected]: scores[selected] + 1 };
      setScores(newScores);
      setSelected(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const top = (Object.keys(newScores) as Personality[]).reduce((a, b) =>
          newScores[a] >= newScores[b] ? a : b
        );
        setResult(top);
        setScreen("result");
      }
      setVisible(true);
      setAnimating(false);
    }, 300);
  }

  function handleRetake() {
    setScreen("intro");
    setCurrentQuestion(0);
    setScores({ "Cozy Classic": 0, "Social Butterfly": 0, "Health Nut": 0, "Indulgent Treat": 0 });
    setSelected(null);
    setResult(null);
  }

  const cardStyle: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "48px",
    maxWidth: "480px",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "sans-serif",
    fontSize: "11px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "var(--accent)",
    display: "block",
    marginBottom: "24px",
  };

  if (screen === "intro") {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--background)" }}>
        <style>{animationStyles}</style>
        <div style={cardStyle} className="anim-fade-in-up">
          <span style={labelStyle}>☕ Basecamp Coffee</span>
          <h1 style={{ fontSize: "28px", fontWeight: "400", color: "var(--foreground)", marginBottom: "12px", lineHeight: "1.4" }}>
            What&apos;s Your Coffee Personality?
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "40px", fontStyle: "italic", fontFamily: "sans-serif" }}>
            Five questions. One perfect brew.
          </p>
          <button
            onClick={() => setScreen("quiz")}
            style={{ background: "var(--accent)", color: "white", border: "none", padding: "14px 32px", fontSize: "14px", letterSpacing: "1px", cursor: "pointer", fontFamily: "sans-serif", width: "100%" }}
          >
            Find My Coffee →
          </button>
        </div>
      </main>
    );
  }

  if (screen === "quiz") {
    const q = questions[currentQuestion];
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--background)" }}>
        <style>{animationStyles}</style>
        <div style={cardStyle} className={visible ? "anim-fade-visible" : "anim-fade-out"}>
          <span style={labelStyle}>☕ Basecamp Coffee</span>

          <div style={{ display: "flex", gap: "6px", marginBottom: "40px" }}>
            {questions.map((_, i) => (
              <div key={i} style={{ width: "32px", height: "3px", background: i <= currentQuestion ? "var(--accent)" : "var(--border)", borderRadius: "2px" }} />
            ))}
          </div>

          <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "var(--muted)", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <div style={{ fontSize: "19px", color: "var(--foreground)", marginBottom: "28px", lineHeight: "1.5" }}>
            {q.question}
          </div>

          <div style={{ marginBottom: "28px" }}>
            {q.options.map((opt) => (
              <button
                key={opt.personality}
                onClick={() => handleSelect(opt.personality)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "16px 0",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid var(--border)",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "sans-serif",
                  fontSize: "15px",
                  color: selected === opt.personality ? "var(--accent)" : "#c4a882",
                  fontWeight: selected === opt.personality ? "600" : "400",
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "20px" }}>{opt.emoji}</span>
                  {opt.text}
                </span>
                <span style={{ color: selected === opt.personality ? "var(--accent)" : "var(--border)", fontSize: "12px", flexShrink: 0, marginLeft: "8px" }}>→</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              background: selected ? "var(--accent)" : "var(--border)",
              color: selected ? "white" : "var(--muted)",
              border: "none",
              padding: "14px 32px",
              fontSize: "14px",
              letterSpacing: "1px",
              cursor: selected ? "pointer" : "not-allowed",
              fontFamily: "sans-serif",
              width: "100%",
            }}
          >
            {currentQuestion < questions.length - 1 ? "Next →" : "See My Result →"}
          </button>
        </div>
      </main>
    );
  }

  if (screen === "result" && result) {
    const p = personalities[result];
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--background)" }}>
        <style>{animationStyles}</style>
        <div style={cardStyle} className="anim-pop-in">
          <span style={labelStyle}>☕ Your Result</span>

          <div style={{ position: "relative", width: "100%", height: "200px", marginBottom: "28px", overflow: "hidden", borderRadius: "2px" }}>
            <Image src={p.image} alt={result} fill style={{ objectFit: "cover" }} />
          </div>

          <div style={{ fontFamily: "sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
            You&apos;re a
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "400", color: "var(--foreground)", marginBottom: "6px" }}>
            {result}
          </h2>
          <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: "var(--accent)", letterSpacing: "1px", marginBottom: "16px", fontStyle: "italic" }}>
            {p.tagline}
          </div>
          <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#c4a882", lineHeight: "1.6", marginBottom: "28px" }}>
            {p.description}
          </p>

          <div style={{ background: "var(--background)", padding: "18px 20px", borderRadius: "2px", border: "1px solid var(--border)", marginBottom: "28px" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
              Your Basecamp Coffee
            </div>
            <div style={{ fontSize: "18px", color: "var(--foreground)", fontWeight: "400" }}>
              {p.coffee}
            </div>
          </div>

          <button
            onClick={handleRetake}
            style={{ background: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: "12px 32px", fontSize: "13px", letterSpacing: "1px", cursor: "pointer", fontFamily: "sans-serif", width: "100%" }}
          >
            Retake Quiz
          </button>
        </div>
      </main>
    );
  }

  return null;
}
