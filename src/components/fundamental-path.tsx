import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, Check, ChevronRight, Lock, Trophy, X } from "lucide-react";

/* ---------- Mock data (prototype only) ---------- */

type SubjectId = "math" | "english" | "indonesia" | "logic";
type Level = { name: string; lessons: string[] };
type Subject = { id: SubjectId; name: string; description: string; basePct: number; levels: Level[] };

const FINAL = "Final Challenge";

const subjects: Subject[] = [
  {
    id: "math", name: "Mathematics", description: "Arithmetic, fractions, percentages, ratios, algebra", basePct: 72,
    levels: [
      { name: "Level 1", lessons: ["Addition", "Subtraction", "Multiplication", "Division", FINAL] },
      { name: "Level 2", lessons: ["Fractions", "Decimals", "Percentages", "Ratios", FINAL] },
      { name: "Level 3", lessons: ["Powers", "Roots", "Algebra", "Equations", FINAL] },
    ],
  },
  {
    id: "english", name: "English", description: "Vocabulary, grammar, sentence structure, reading", basePct: 45,
    levels: [
      { name: "Level 1", lessons: ["Basic Vocabulary", "Common Words", "Sentence Structure", "Basic Grammar", FINAL] },
      { name: "Level 2", lessons: ["Tenses", "Prepositions", "Context Clues", "Reading", FINAL] },
    ],
  },
  {
    id: "indonesia", name: "Bahasa Indonesia", description: "EYD, SPOK, vocabulary, punctuation, effective sentences", basePct: 28,
    levels: [
      { name: "Level 1", lessons: ["Kata Baku", "EYD", "Tanda Baca", "SPOK", FINAL] },
      { name: "Level 2", lessons: ["Kalimat Efektif", "Sinonim", "Antonim", "Struktur Kalimat", FINAL] },
    ],
  },
  {
    id: "logic", name: "Logika", description: "Patterns, sequences, classification, analogy", basePct: 12,
    levels: [
      { name: "Level 1", lessons: ["Classification", "Sequences", "Patterns", "Analogy", FINAL] },
      { name: "Level 2", lessons: ["Number Patterns", "Logical Relationships", "Verbal Logic", "Mixed Logic", FINAL] },
    ],
  },
];

type Question = { q: string; options: string[]; answer: number; why: string };

const questionBank: Record<SubjectId, Question[]> = {
  math: [
    { q: "What is 7 + 8?", options: ["14", "15", "16", "17"], answer: 1, why: "7 + 8 = 15. Split 8 into 3 + 5: 7 + 3 = 10, then 10 + 5 = 15." },
    { q: "What is 6 × 7?", options: ["36", "42", "48", "49"], answer: 1, why: "6 × 7 = 42. Think of 6 × 5 = 30 plus 6 × 2 = 12." },
    { q: "What is 45 − 18?", options: ["27", "23", "33", "37"], answer: 0, why: "45 − 20 = 25, then add back 2: 27." },
  ],
  english: [
    { q: "Choose the correct sentence.", options: ["She go to school.", "She goes to school.", "She going school.", "She gone to school."], answer: 1, why: "Third-person singular in the present simple takes -s: goes." },
    { q: "Synonym of \"rapid\"?", options: ["Slow", "Quick", "Late", "Weak"], answer: 1, why: "Rapid means fast or quick." },
    { q: "\"I ___ a book yesterday.\"", options: ["read", "reads", "reading", "am read"], answer: 0, why: "Past tense of read is spelled read (pronounced \"red\")." },
  ],
  indonesia: [
    { q: "Manakah kata baku?", options: ["Apotik", "Apotek", "Apotiek", "Apothek"], answer: 1, why: "Menurut KBBI, bentuk baku adalah apotek." },
    { q: "Penulisan yang benar?", options: ["di rumah", "dirumah", "di-rumah", "Dirumah"], answer: 0, why: "\"di\" sebagai kata depan ditulis terpisah dari kata tempat." },
    { q: "Subjek dari \"Adik membaca buku\"?", options: ["Membaca", "Buku", "Adik", "Membaca buku"], answer: 2, why: "Subjek adalah pelaku: Adik." },
  ],
  logic: [
    { q: "2, 4, 8, 16, …", options: ["18", "24", "32", "30"], answer: 2, why: "Each number doubles: 16 × 2 = 32." },
    { q: "Which does not belong?", options: ["Apple", "Banana", "Carrot", "Mango"], answer: 2, why: "Carrot is a vegetable; the others are fruits." },
    { q: "Bird : Fly = Fish : ?", options: ["Water", "Swim", "Fin", "Sea"], answer: 1, why: "A bird flies; a fish swims — the relationship is movement." },
  ],
};

/* ---------- Prototype progress store (in-memory) ---------- */

const initialCompleted: Record<SubjectId, number> = { math: 2, english: 1, indonesia: 0, logic: 0 };
let completed = { ...initialCompleted };
const listeners = new Set<() => void>();
const store = {
  subscribe: (l: () => void) => (listeners.add(l), () => listeners.delete(l)),
  get: () => completed,
  getServer: () => initialCompleted,
  complete(id: SubjectId, index: number) {
    if (index === completed[id]) {
      completed = { ...completed, [id]: completed[id] + 1 };
      listeners.forEach((l) => l());
    }
  },
};
const useCompleted = () => useSyncExternalStore(store.subscribe, store.get, store.getServer);

const totalLessons = (s: Subject) => s.levels.reduce((n, l) => n + l.lessons.length, 0);
const pct = (s: Subject, done: number) =>
  Math.min(100, s.basePct + Math.round(((done - initialCompleted[s.id]) / totalLessons(s)) * 100));

function locate(s: Subject, index: number) {
  let i = index;
  for (let l = 0; l < s.levels.length; l++) {
    if (i < s.levels[l]!.lessons.length) return { level: l, pos: i };
    i -= s.levels[l]!.lessons.length;
  }
  return { level: s.levels.length - 1, pos: s.levels.at(-1)!.lessons.length - 1 };
}

/* ---------- Views ---------- */

type View =
  | { name: "entry" }
  | { name: "path"; subject: SubjectId }
  | { name: "lesson"; subject: SubjectId; index: number }
  | { name: "done"; subject: SubjectId; index: number };

export function FundamentalPath() {
  const [view, setView] = useState<View>({ name: "entry" });
  const done = useCompleted();

  if (view.name === "entry") return <Entry done={done} onPick={(id) => setView({ name: "path", subject: id })} />;
  const subject = subjects.find((s) => s.id === view.subject)!;
  if (view.name === "path")
    return <PathView subject={subject} done={done[subject.id]} onBack={() => setView({ name: "entry" })} onOpen={(i) => setView({ name: "lesson", subject: subject.id, index: i })} />;
  if (view.name === "lesson")
    return (
      <Lesson
        subject={subject}
        index={view.index}
        onExit={() => setView({ name: "path", subject: subject.id })}
        onFinish={() => {
          store.complete(subject.id, view.index);
          setView({ name: "done", subject: subject.id, index: view.index });
        }}
      />
    );
  return <Complete subject={subject} index={view.index} onContinue={() => setView({ name: "path", subject: subject.id })} />;
}

function Entry({ done, onPick }: { done: Record<SubjectId, number>; onPick: (id: SubjectId) => void }) {
  const [open, setOpen] = useState(false);
  const overall = Math.round(subjects.reduce((n, s) => n + pct(s, done[s.id]), 0) / subjects.length) - 7;
  return (
    <section className="max-w-2xl">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="tap w-full rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-border-strong"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[18px] font-semibold tracking-tight">Fundamental.</p>
            <p className="mt-1 text-[14px] text-muted-foreground">Build the skills everything else depends on.</p>
          </div>
          <ChevronRight size={20} aria-hidden="true" className={`mt-1 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
        <div className="mt-5 flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="font-semibold tabular-nums">{overall}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${overall}%` }} />
        </div>
      </button>

      {open && (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {subjects.map((s) => {
            const p = pct(s, done[s.id]);
            return (
              <button key={s.id} type="button" onClick={() => onPick(s.id)} className="tap flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left hover:border-border-strong">
                <ProgressRing value={p} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{s.name}</p>
                  <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{s.description}</p>
                  <p className="mt-1 text-[12px] font-medium text-primary">{p}% complete</p>
                </div>
                <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 16, c = 2 * Math.PI * r;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="20" cy="20" r={r} fill="none" strokeWidth="3.5" className="stroke-muted" />
      <circle cx="20" cy="20" r={r} fill="none" strokeWidth="3.5" strokeLinecap="round" className="stroke-primary" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  );
}

const offsets = [0, -1, -1.6, -1, 0, 1, 1.6, 1];

function PathView({ subject, done, onBack, onOpen }: { subject: Subject; done: number; onBack: () => void; onOpen: (i: number) => void }) {
  const [hint, setHint] = useState<number | null>(null);
  const current = locate(subject, done);
  let flat = 0;

  return (
    <section>
      <button type="button" onClick={onBack} className="tap mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft size={15} aria-hidden="true" /> Semua subjek
      </button>
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-[20px] font-semibold tracking-tight">{subject.name}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Now: {subject.levels[current.level]!.name} — {subject.levels[current.level]!.lessons[current.pos]}
          </p>
        </div>
        <span className="text-[13px] font-semibold tabular-nums text-primary">{pct(subject, done)}%</span>
      </div>

      <div className="mx-auto max-w-md md:max-w-lg">
        {subject.levels.map((level, li) => {
          const levelDone = subject.levels.slice(0, li + 1).reduce((n, l) => n + l.lessons.length, 0) <= done;
          return (
            <div key={level.name} className="mb-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="label-xs">{level.name}{levelDone ? " · selesai" : ""}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <ol className="flex flex-col items-center gap-5">
                {level.lessons.map((lesson, pi) => {
                  const i = flat++;
                  const state = i < done ? "done" : i === done ? "current" : "locked";
                  const isFinal = lesson === FINAL;
                  const x = isFinal ? 0 : (offsets[pi % offsets.length] ?? 0);
                  return (
                    <li key={i} className="relative flex flex-col items-center" style={{ transform: `translateX(calc(${x} * clamp(28px, 7vw, 56px)))` }}>
                      <Node state={state} final={isFinal} label={lesson} letter={String.fromCharCode(65 + pi)} onClick={() => (state === "locked" ? setHint(i) : onOpen(i))} />
                      <span className={`mt-2 text-center text-[12.5px] font-medium ${state === "locked" ? "text-muted-foreground" : ""}`}>{lesson}</span>
                      {state === "current" && <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">Mulai</span>}
                      {hint === i && (
                        <span role="status" className="mt-1.5 rounded-md bg-muted px-2.5 py-1 text-[12px] text-muted-foreground">
                          Complete the previous lesson to unlock this.
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Node({ state, final, label, letter, onClick }: { state: "done" | "current" | "locked"; final: boolean; label: string; letter: string; onClick: () => void }) {
  const size = final ? "h-[72px] w-[72px]" : "h-14 w-14";
  const styles =
    state === "done"
      ? "bg-success text-success-foreground"
      : state === "current"
        ? "bg-primary text-primary-foreground ring-4 ring-primary-soft shadow-[0_4px_0_0_var(--color-border-strong)]"
        : "bg-muted text-muted-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={state === "locked"}
      aria-label={`${label}${state === "locked" ? " (terkunci)" : state === "done" ? " (selesai)" : " (pelajaran saat ini)"}`}
      className={`tap grid place-items-center rounded-full transition-transform active:scale-95 ${size} ${styles} ${final && state !== "locked" ? "ring-4 ring-warm-soft" : ""} ${state === "locked" ? "cursor-not-allowed" : ""}`}
    >
      {state === "locked" ? (final ? <Trophy size={24} aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />) : state === "done" ? <Check size={22} strokeWidth={3} aria-hidden="true" /> : final ? <Trophy size={26} aria-hidden="true" /> : <span className="text-[17px] font-bold">{letter}</span>}
    </button>
  );
}

function Lesson({ subject, index, onExit, onFinish }: { subject: Subject; index: number; onExit: () => void; onFinish: () => void }) {
  const questions = questionBank[subject.id];
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const loc = locate(subject, index);
  const lessonName = subject.levels[loc.level]!.lessons[loc.pos];
  const q = questions[step]!;
  const answered = picked !== null;
  const correct = picked === q.answer;

  const next = () => {
    if (!correct) return setPicked(null);
    if (step === questions.length - 1) return onFinish();
    setStep(step + 1);
    setPicked(null);
  };

  return (
    <section className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={onExit} aria-label="Keluar dari pelajaran" className="tap grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted">
          <X size={18} />
        </button>
        <div className="flex flex-1 gap-1.5" aria-label={`Soal ${step + 1} dari ${questions.length}`}>
          {questions.map((_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < step || (i === step && answered && correct) ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      </div>
      <p className="label-xs">{subject.name}</p>
      <p className="mt-1 text-[14px] text-muted-foreground">{subject.levels[loc.level]!.name} — {lessonName}</p>
      <h2 className="mt-6 text-[22px] font-semibold tracking-tight">{q.q}</h2>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {q.options.map((o, i) => {
          const tone = !answered ? "border-border hover:border-border-strong" : i === q.answer ? "border-success bg-success/10" : i === picked ? "border-destructive bg-destructive/10" : "border-border opacity-60";
          return (
            <button key={o} type="button" disabled={answered} onClick={() => setPicked(i)} className={`tap rounded-xl border-2 bg-card px-4 py-3.5 text-left text-[15px] font-medium ${tone}`}>
              {o}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-5 rounded-xl p-4 ${correct ? "bg-success/10" : "bg-destructive/10"}`}>
          <p className={`text-[15px] font-semibold ${correct ? "text-success" : "text-destructive"}`}>{correct ? "Benar!" : "Belum tepat"}</p>
          <p className="mt-1 text-[14px] leading-6 text-muted-foreground">{q.why}</p>
          <button type="button" onClick={next} className="tap mt-4 w-full rounded-xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground sm:w-auto sm:px-8">
            {!correct ? "Coba lagi" : step === questions.length - 1 ? "Selesai" : "Lanjut"}
          </button>
        </div>
      )}
    </section>
  );
}

function Complete({ subject, index, onContinue }: { subject: Subject; index: number; onContinue: () => void }) {
  const loc = locate(subject, index);
  const level = subject.levels[loc.level]!;
  const name = level.lessons[loc.pos];
  const hasNext = index + 1 < totalLessons(subject);
  const nextName = hasNext ? (() => { const n = locate(subject, index + 1); return subject.levels[n.level]!.lessons[n.pos]; })() : null;
  return (
    <section className="mx-auto max-w-md py-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-success-foreground">
        <Check size={30} strokeWidth={3} aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-[24px] font-semibold tracking-tight">Lesson Complete</h2>
      <p className="mt-1 text-[15px] text-muted-foreground">✓ {name}</p>
      <p className="mt-4 text-[13px] font-medium tabular-nums">{level.name} · {Math.min(loc.pos + 1, 4)} / 4{name === FINAL ? " · level selesai" : ""}</p>
      {nextName && (
        <p className="mt-5 rounded-xl border border-border bg-card px-4 py-3 text-[14px]">
          Next lesson unlocked: <span className="font-semibold">{nextName}</span>
        </p>
      )}
      <button type="button" onClick={onContinue} className="tap mt-6 w-full rounded-xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground">
        Continue
      </button>
    </section>
  );
}
