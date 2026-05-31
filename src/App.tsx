import { useState } from "react";

const vocab = [
  { w: "Articulate", pos: "adj", def: "Able to express ideas clearly and effectively in speech or writing.", ex: "She gave an articulate response that impressed the entire panel.", tags: ["Interview", "Communication"], lvl: 3 },
  { w: "Initiative", pos: "noun", def: "The ability to assess a situation and act independently without waiting for instructions.", ex: "He showed initiative by identifying the issue before it became a problem.", tags: ["Leadership", "Work"], lvl: 2 },
  { w: "Collaborate", pos: "verb", def: "To work jointly with others toward a shared goal.", ex: "We collaborated with the client team to deliver on time.", tags: ["Professional", "Teamwork"], lvl: 2 },
  { w: "Proactive", pos: "adj", def: "Creating or controlling a situation rather than just reacting to it.", ex: "A proactive approach means solving problems before they escalate.", tags: ["Interview", "Work"], lvl: 3 },
  { w: "Concise", pos: "adj", def: "Giving a lot of information clearly and in few words.", ex: "Keep your interview answers concise — aim for under two minutes.", tags: ["Communication"], lvl: 1 },
  { w: "Empathy", pos: "noun", def: "The ability to understand and share the feelings of another person.", ex: "Showing empathy during a client call builds trust instantly.", tags: ["Communication", "Professional"], lvl: 2 },
];

const interviews = [
  { cat: "Opening question", q: "Walk me through your background and what makes you the right fit for this role.", tip: "Use Present → Past → Future: what you do now, your experience, why this role. Keep it under 90 seconds.", ph: "Write your answer here..." },
  { cat: "Handling conflict", q: "Describe a time when you disagreed with a colleague. How did you resolve it?", tip: "Use the STAR method: Situation, Task, Action, Result. Highlight calm communication and a positive outcome.", ph: "Write your answer here..." },
  { cat: "Client communication", q: "How would you explain a technical problem to a frustrated client who does not understand technical terms?", tip: "Empathize first, then simplify. No jargon. Give a clear next step. Show the client they are your priority.", ph: "Write your answer here..." },
];

const grammar = [
  { q: ["I ", " to the office every day."], blank: "___", opts: ["go", "goes", "gone", "going"], ans: 0, exp: "With 'I', use the base verb form in simple present tense: 'go'. Use 'goes' only for he/she/it." },
  { q: ["She has been working here ", " five years."], blank: "___", opts: ["since", "for", "from", "during"], ans: 1, exp: "Use 'for' with a duration (five years). Use 'since' with a specific starting point (since 2020)." },
  { q: ["If I ", " you, I would apply for that role immediately."], blank: "___", opts: ["am", "was", "were", "be"], ans: 2, exp: "In hypothetical conditionals, always use 'were' for all persons: 'If I were you...'" },
  { q: ["Could you please ", " me the report by Friday?"], blank: "___", opts: ["send", "sent", "sending", "to send"], ans: 0, exp: "After modal verbs like 'could', always use the base form of the verb: 'send'." },
];

const scenarios = [
  { icon: "🎤", label: "Job Interview", sub: "Tough HR & technical questions", diff: "Intermediate", color: "#E1F5EE", tc: "#085041", msg: "Welcome! Thanks for coming in today. Can you start by telling me a little about yourself and why you are interested in this position?" },
  { icon: "📞", label: "Client Call", sub: "Handle concerns, build trust", diff: "Advanced", color: "#EEEDFE", tc: "#3C3489", msg: "Hi, I have been reviewing the proposal and I am a bit concerned about the delivery timeline. Can you walk me through how you will manage that?" },
  { icon: "👥", label: "Team Meeting", sub: "Lead updates, give feedback", diff: "Beginner", color: "#FAEEDA", tc: "#412402", msg: "The meeting is starting. Can you give the team a quick status update on your current tasks?" },
  { icon: "✉️", label: "Email Writing", sub: "Professional emails confidently", diff: "Beginner", color: "#FAECE7", tc: "#4A1B0C", msg: "Let us practice. Write an email to your manager requesting a day off next Friday. Include a reason and offer to prepare in advance." },
];

type Tab = "vocab" | "interview" | "grammar" | "scenarios";

const S: React.CSSProperties = {};

export default function App() {
  const [tab, setTab] = useState<Tab>("vocab");
  const [answers, setAnswers] = useState<string[]>(interviews.map(() => ""));
  const [quizIdx, setQuizIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatScenario, setChatScenario] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; from: "them" | "me" }[]>([]);
  const [markedWords, setMarkedWords] = useState<Record<number, "ok" | "hard">>({});
  const [wordCount, setWordCount] = useState(24);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  function checkAnswer(ci: number) {
    if (answered) return;
    setAnswered(true);
    setChosen(ci);
    setShowExp(true);
    setScore(s => ({ correct: s.correct + (ci === grammar[quizIdx].ans ? 1 : 0), total: s.total + 1 }));
  }

  function nextQuestion() {
    setQuizIdx((q) => (q + 1) % grammar.length);
    setAnswered(false);
    setChosen(null);
    setShowExp(false);
  }

  function startScenario(i: number) {
    setChatScenario(i);
    setMessages([{ text: scenarios[i].msg, from: "them" }]);
    setChatOpen(true);
    setChatInput("");
  }

  function sendChat() {
    const txt = chatInput.trim();
    if (!txt) return;
    setMessages((m) => [...m, { text: txt, from: "me" }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { text: "Good response! Keep practising — try to be more specific and confident in your next reply.", from: "them" }]);
    }, 900);
  }

  function markWord(i: number, status: "ok" | "hard") {
    setMarkedWords((m) => ({ ...m, [i]: status }));
    if (status === "ok" && markedWords[i] !== "ok") setWordCount((c) => c + 1);
  }

  const q = grammar[quizIdx];
  const pct = Math.round((quizIdx / grammar.length) * 100);
  const scorePercent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  /* ---- shared styles ---- */
  const card: React.CSSProperties = { background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem", marginBottom: 10 };
  const btn = (bg: string, color: string, border: string): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: `1px solid ${border}`, background: bg, fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer", color });
  const navBtn = (active: boolean): React.CSSProperties => ({ padding: "8px 18px", borderRadius: 99, border: active ? "none" : "1px solid #e5e7eb", background: active ? "#111827" : "transparent", color: active ? "#ffffff" : "#6b7280", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer" });

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem 3rem", background: "#f9fafb", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ background: "#ffffff", borderRadius: 16, padding: "2rem 1.5rem 1.5rem", marginBottom: "1.5rem", border: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} /> English for real life
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 700, color: "#111827", lineHeight: 1.2, marginBottom: 8 }}>
          Speak with <span style={{ color: "#1D9E75", fontStyle: "italic" }}>confidence.</span>
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, maxWidth: 420, marginBottom: "1.25rem" }}>
          Build vocabulary, ace job interviews, and communicate naturally — from client calls to everyday conversations.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setTab("vocab")} style={{ padding: "9px 22px", background: "#111827", color: "#ffffff", border: "none", borderRadius: 99, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Start learning</button>
          <button onClick={() => setTab("scenarios")} style={{ padding: "9px 22px", background: "transparent", color: "#111827", border: "1px solid #d1d5db", borderRadius: 99, fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Practice scenarios →</button>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #e5e7eb", flexWrap: "wrap" }}>
          {[["500+", "Vocabulary words"], [`🔥 ${wordCount}`, "Words learned"], [`${scorePercent}%`, "Quiz score"]].map(([n, l]) => (
            <div key={String(l)}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{n}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NAV */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {(["vocab", "interview", "grammar", "scenarios"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={navBtn(tab === t)}>
            {t === "vocab" ? "📚 Vocabulary" : t === "interview" ? "💼 Interviews" : t === "grammar" ? "✏️ Grammar" : "💬 Scenarios"}
          </button>
        ))}
      </div>

      {/* ── VOCABULARY ── */}
      {tab === "vocab" && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 14 }}>Today's words</div>
          {vocab.map((v, i) => {
            const marked = markedWords[i];
            const borderCol = marked === "ok" ? "#5DCAA5" : marked === "hard" ? "#F09595" : "#e5e7eb";
            const posBg = v.pos === "verb" ? "#E1F5EE" : v.pos === "noun" ? "#EEEDFE" : "#FAECE7";
            const posCol = v.pos === "verb" ? "#085041" : v.pos === "noun" ? "#3C3489" : "#712B13";
            return (
              <div key={v.w} style={{ ...card, border: `1px solid ${borderCol}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: posBg, color: posCol, display: "inline-block", marginBottom: 6 }}>{v.pos}</span>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: "#111827" }}>{v.w}</div>
                  </div>
                  <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                    {[1, 2, 3].map((d) => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: d <= v.lvl ? "#1D9E75" : "#e5e7eb", display: "inline-block" }} />)}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, marginBottom: 8 }}>{v.def}</div>
                <div style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic", borderLeft: "3px solid #e5e7eb", paddingLeft: 10, background: "#f9fafb", padding: "8px 10px", borderRadius: "0 6px 6px 0" }}>"{v.ex}"</div>
                <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
                  {v.tags.map((t) => <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99, border: "1px solid #e5e7eb", color: "#9ca3af", background: "#f9fafb" }}>{t}</span>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginTop: 12 }}>
                  <button onClick={() => markWord(i, "hard")} style={btn("#fff5f5", "#991B1B", "#fca5a5")}>✕ Needs work</button>
                  <button onClick={() => markWord(i, marked === "ok" ? "hard" : "ok")} style={btn("#f9fafb", "#374151", "#d1d5db")}>✎ Mark reviewed</button>
                  <button onClick={() => markWord(i, "ok")} style={btn("#f0fdf4", "#166534", "#86efac")}>✓ Got it!</button>
                </div>
                {marked && (
                  <div style={{ marginTop: 10, fontSize: 12, color: marked === "ok" ? "#166534" : "#991B1B", background: marked === "ok" ? "#f0fdf4" : "#fff5f5", padding: "6px 10px", borderRadius: 6 }}>
                    {marked === "ok" ? "✓ Marked as learned — great job!" : "Keep practising this word — you'll get it!"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── INTERVIEW ── */}
      {tab === "interview" && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 14 }}>Practice questions</div>
          {interviews.map((item, i) => (
            <div key={i} style={card}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: "#E1F5EE", color: "#085041", letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.cat}</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "12px 0 10px", lineHeight: 1.5 }}>{item.q}</div>
              <div style={{ display: "flex", gap: 8, background: "#fffbeb", borderRadius: 8, padding: "10px 12px", marginBottom: 14, border: "1px solid #fde68a" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}><strong>Tip:</strong> {item.tip}</div>
              </div>
              <textarea
                value={answers[i]}
                onChange={(e) => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
                placeholder={item.ph}
                style={{ width: "100%", minHeight: 80, resize: "vertical", fontFamily: "inherit", fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", outline: "none", lineHeight: 1.6, color: "#111827", background: "#ffffff", display: "block" }}
              />
              <div style={{ marginTop: 6, fontSize: 11, color: "#9ca3af" }}>
                {answers[i].length > 0 ? `${answers[i].split(" ").filter(Boolean).length} words written` : "Start typing your answer above"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => alert(answers[i].trim() ? `Your answer has ${answers[i].split(" ").filter(Boolean).length} words. Good start! Focus on: clarity, specific examples, and a strong conclusion.` : "Please write your answer first!")}
                  style={btn("#f0fdf4", "#166534", "#86efac")}>✨ Check my answer</button>
                <button
                  onClick={() => alert(`Model answer for: "${item.q}"\n\nA strong answer uses the STAR method — describe the Situation, your Task, the Action you took, and the Result. Be specific, stay positive, and keep it under 90 seconds when spoken.`)}
                  style={btn("#eff6ff", "#1e40af", "#bfdbfe")}>👁 Show model answer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GRAMMAR ── */}
      {tab === "grammar" && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 14 }}>Grammar quiz</div>
          <div style={card}>
            {/* progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", whiteSpace: "nowrap" }}>Question {quizIdx + 1} of {grammar.length}</span>
              <div style={{ flex: 1, height: 4, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "#1D9E75", borderRadius: 99, transition: "width 0.4s" }} />
              </div>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{score.total > 0 ? `${scorePercent}%` : "–"}</span>
            </div>

            {/* question — blank shown as gap, NOT pre-filled with answer */}
            <div style={{ fontSize: 16, color: "#111827", lineHeight: 1.7, marginBottom: 24, background: "#f9fafb", padding: "14px 16px", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>Fill in the blank</span>
              {q.q[0]}
              <span style={{ display: "inline-block", minWidth: 80, borderBottom: "2px solid #1D9E75", textAlign: "center", fontWeight: 700, color: answered ? "#1D9E75" : "#1D9E75", padding: "0 6px", fontSize: 18 }}>
                {answered ? q.opts[q.ans] : "?"}
              </span>
              {q.q[1]}
            </div>

            {/* choices */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {q.opts.map((opt, ci) => {
                let bg = "#ffffff", border = "1px solid #d1d5db", color = "#374151";
                if (answered) {
                  if (ci === q.ans) { bg = "#f0fdf4"; border = "2px solid #22c55e"; color = "#166534"; }
                  else if (ci === chosen) { bg = "#fff5f5"; border = "2px solid #ef4444"; color = "#991b1b"; }
                }
                return (
                  <button key={ci} onClick={() => checkAnswer(ci)}
                    style={{ padding: "12px 16px", borderRadius: 8, border, background: bg, fontFamily: "inherit", fontSize: 14, cursor: answered ? "default" : "pointer", textAlign: "left", color, fontWeight: ci === q.ans && answered ? 600 : 400, transition: "all 0.2s" }}>
                    {ci === q.ans && answered ? "✓ " : ci === chosen && chosen !== q.ans && answered ? "✗ " : ""}{opt}
                  </button>
                );
              })}
            </div>

            {/* explanation — only shows AFTER answering */}
            {showExp && (
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>📘 Explanation</div>
                <div style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.65 }}>{q.exp}</div>
              </div>
            )}

            {/* next button — only shows after answering */}
            {answered && (
              <button onClick={nextQuestion} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "#111827", color: "#ffffff", fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Next question →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SCENARIOS ── */}
      {tab === "scenarios" && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 14 }}>Choose a scenario</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {scenarios.map((s, i) => (
              <div key={i} onClick={() => startScenario(i)}
                style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#9ca3af")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8, lineHeight: 1.4 }}>{s.sub}</div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: s.color, color: s.tc }}>{s.diff}</span>
              </div>
            ))}
          </div>

          {chatOpen && (
            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              {/* chat header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: scenarios[chatScenario].color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{scenarios[chatScenario].icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{scenarios[chatScenario].label}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>Practice conversation — type your reply</div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ padding: "5px 12px", borderRadius: 99, border: "1px solid #e5e7eb", background: "#ffffff", fontFamily: "inherit", fontSize: 12, cursor: "pointer", color: "#6b7280" }}>End chat</button>
              </div>

              {/* messages */}
              <div style={{ padding: "1rem", minHeight: 180, maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, background: "#ffffff" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{
                    maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.55,
                    alignSelf: m.from === "me" ? "flex-end" : "flex-start",
                    background: m.from === "me" ? "#111827" : "#f3f4f6",
                    color: m.from === "me" ? "#ffffff" : "#111827",
                    borderBottomRightRadius: m.from === "me" ? 3 : 12,
                    borderBottomLeftRadius: m.from === "them" ? 3 : 12,
                  }}>{m.text}</div>
                ))}
              </div>

              {/* input */}
              <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 12px", display: "flex", gap: 8, background: "#f9fafb" }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Type your reply and press Enter..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 99, border: "1px solid #d1d5db", fontFamily: "inherit", fontSize: 13, outline: "none", background: "#ffffff", color: "#111827" }}
                />
                <button onClick={sendChat} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "#111827", color: "#ffffff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
