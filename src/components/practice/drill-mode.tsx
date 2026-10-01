import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock, X } from "lucide-react";
import { exams, getQuestions, type Question } from "@/data/prototype";
import { cn } from "@/lib/utils";
import { CardGrid, Chip, SelectCard, StepHeader, fmtTime } from "./select-card";

type Difficulty = "Easy" | "Medium" | "Hard" | "Mixed";
type Config = { count: number; minutes: number | null; difficulty: Difficulty; order: "Random" | "Sequential" };
type Scope = { trail: string[] };

const FUND_SCOPES = ["Mathematics", "English", "Bahasa Indonesia", "Logika"];

/** Drill: the most customizable mode. Pick any scope, then configure every aspect. */
export function DrillMode() {
  const [examId, setExamId] = useState<string | null>(null);
  const [subtestId, setSubtestId] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope | null>(null);
  const [run, setRun] = useState<Config | null>(null);
  const [result, setResult] = useState<{ correct: number; total: number; answered: number; seconds: number; config: Config } | null>(null);

  const exam = exams.find((e) => e.id === examId);
  const subtest = exam?.subtests.find((s) => s.id === subtestId);

  if (result && scope)
    return <DrillResult {...result} trail={scope.trail} onAgain={() => { setResult(null); setRun(result.config); }} onConfigure={() => setResult(null)} />;

  if (run && scope)
    return <DrillRunner config={run} trail={scope.trail} onExit={() => setRun(null)} onDone={(r) => { setRun(null); setResult({ ...r, config: run }); }} />;

  if (scope) return <DrillConfig trail={scope.trail} onBack={() => setScope(null)} onStart={setRun} />;

  if (examId === "fundamental")
    return (
      <>
        <StepHeader trail={["Drill", "Fundamental."]} title="Pilih subjek" onBack={() => setExamId(null)} />
        <CardGrid>
          {FUND_SCOPES.map((s) => (
            <SelectCard key={s} title={s} onClick={() => setScope({ trail: ["Drill", "Fundamental.", s] })} />
          ))}
        </CardGrid>
      </>
    );

  if (!exam)
    return (
      <>
        <StepHeader trail={["Drill"]} title="Pilih kategori" caption="Latih persis apa yang kamu pilih." />
        <CardGrid cols={3}>
          {exams.map((e) => (
            <SelectCard key={e.id} title={e.name} description={e.caption} onClick={() => setExamId(e.id)} />
          ))}
          <SelectCard title="Fundamental." description="Kemampuan dasar" onClick={() => setExamId("fundamental")} />
        </CardGrid>
      </>
    );

  if (!subtest)
    return (
      <>
        <StepHeader trail={["Drill", exam.name]} title="Pilih subtes" onBack={() => setExamId(null)} />
        <CardGrid cols={3}>
          <SelectCard title={`Semua ${exam.name}`} description="Campuran seluruh subtes" onClick={() => setScope({ trail: ["Drill", exam.name, "Semua"] })} />
          {exam.subtests.map((s) => (
            <SelectCard key={s.id} title={s.name} description={s.caption} onClick={() => setSubtestId(s.id)} />
          ))}
        </CardGrid>
      </>
    );

  return (
    <>
      <StepHeader trail={["Drill", exam.name, subtest.name]} title="Pilih materi" onBack={() => setSubtestId(null)} />
      <CardGrid cols={3}>
        <SelectCard title={`Semua ${subtest.name}`} description="Campuran seluruh materi" onClick={() => setScope({ trail: ["Drill", exam.name, subtest.name, "Semua"] })} />
        {subtest.materials.map((m) => (
          <SelectCard key={m.id} title={m.name} onClick={() => setScope({ trail: ["Drill", exam.name, subtest.name, m.name] })} />
        ))}
      </CardGrid>
    </>
  );
}

function DrillConfig({ trail, onBack, onStart }: { trail: string[]; onBack: () => void; onStart: (c: Config) => void }) {
  const [count, setCount] = useState<number | "custom">(20);
  const [customCount, setCustomCount] = useState("25");
  const [minutes, setMinutes] = useState<number | null | "custom">(20);
  const [customMin, setCustomMin] = useState("15");
  const [difficulty, setDifficulty] = useState<Difficulty>("Mixed");
  const [order, setOrder] = useState<Config["order"]>("Random");

  const finalCount = count === "custom" ? Math.max(1, Math.min(200, Number(customCount) || 0)) : count;
  const finalMin = minutes === "custom" ? Math.max(1, Math.min(300, Number(customMin) || 0)) : minutes;
  const input = "tap h-10 w-24 rounded-lg border border-border bg-surface px-3 text-[14px] tabular-nums focus:border-primary focus:outline-none";

  return (
    <div className="max-w-2xl">
      <StepHeader trail={[...trail, "Konfigurasi"]} title="Atur drill kamu" caption={trail.slice(1).join(" · ")} onBack={onBack} />
      <div className="space-y-5 rounded-lg border border-border bg-surface p-4 shadow-soft sm:p-5">
        <Field label="Jumlah soal">
          {[10, 20, 30, 40, 50].map((n) => <Chip key={n} active={count === n} onClick={() => setCount(n)}>{n}</Chip>)}
          <Chip active={count === "custom"} onClick={() => setCount("custom")}>Custom</Chip>
          {count === "custom" && <input aria-label="Jumlah soal custom" inputMode="numeric" value={customCount} onChange={(e) => setCustomCount(e.target.value.replace(/\D/g, ""))} className={input} />}
        </Field>
        <Field label="Timer">
          <Chip active={minutes === null} onClick={() => setMinutes(null)}>No Limit</Chip>
          {[10, 20, 30, 45, 60].map((n) => <Chip key={n} active={minutes === n} onClick={() => setMinutes(n)}>{n} min</Chip>)}
          <Chip active={minutes === "custom"} onClick={() => setMinutes("custom")}>Custom</Chip>
          {minutes === "custom" && <input aria-label="Menit custom" inputMode="numeric" value={customMin} onChange={(e) => setCustomMin(e.target.value.replace(/\D/g, ""))} className={input} />}
        </Field>
        <Field label="Tingkat kesulitan">
          {(["Easy", "Medium", "Hard", "Mixed"] as const).map((d) => <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>{d}</Chip>)}
        </Field>
        <Field label="Urutan soal">
          {(["Random", "Sequential"] as const).map((o) => <Chip key={o} active={order === o} onClick={() => setOrder(o)}>{o}</Chip>)}
        </Field>
      </div>
      <div className="sticky bottom-16 -mx-5 mt-4 bg-background px-5 pb-2 pt-3 md:static md:mx-0 md:px-0">
        <button type="button" onClick={() => onStart({ count: finalCount, minutes: finalMin, difficulty, order })} className="tap w-full rounded-lg bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground shadow-soft">
          Start Drill
        </button>
        <p className="mt-2 text-center text-[12.5px] text-muted-foreground">
          {finalCount} soal · {finalMin ? `${finalMin} menit` : "tanpa batas waktu"} · {difficulty} · {order}
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="label-xs mb-2">{label}</legend>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </fieldset>
  );
}

function buildSet(config: Config): Question[] {
  const base = getQuestions(99);
  const list = Array.from({ length: config.count }, (_, i) => ({ ...base[i % base.length]!, id: `d${i}` }));
  if (config.order === "Random") {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j]!, list[i]!];
    }
  }
  return list;
}

function DrillRunner({ config, trail, onExit, onDone }: { config: Config; trail: string[]; onExit: () => void; onDone: (r: { correct: number; total: number; answered: number; seconds: number }) => void }) {
  const questions = useMemo(() => buildSet(config), [config]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const limit = config.minutes ? config.minutes * 60 : null;
  const state = useRef({ correct: 0, answered: 0, elapsed: 0, done: false });
  state.current.correct = correct;
  state.current.elapsed = elapsed;

  const finish = (answered: number) => {
    if (state.current.done) return;
    state.current.done = true;
    onDone({ correct: state.current.correct, total: questions.length, answered, seconds: state.current.elapsed });
  };

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (limit && elapsed >= limit) finish(state.current.answered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  const q = questions[i]!;
  const answered = picked !== null;
  const remaining = questions.length - i - (answered ? 1 : 0);

  const pick = (k: string) => {
    if (answered) return;
    setPicked(k);
    state.current.answered = i + 1;
    if (k === q.answer) setCorrect((c) => c + 1);
  };
  const next = () => {
    if (i === questions.length - 1) return finish(i + 1);
    setI(i + 1);
    setPicked(null);
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center gap-3">
        <button type="button" onClick={onExit} aria-label="Keluar dari drill" className="tap grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted">
          <X size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] text-muted-foreground">{trail.slice(1).join(" · ")}</p>
          <p className="text-[13px] font-semibold tabular-nums">Soal {i + 1}/{questions.length} · {remaining} tersisa</p>
        </div>
        {limit && (
          <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-semibold tabular-nums", limit - elapsed <= 60 ? "border-destructive text-destructive" : "border-border")}>
            <Clock size={14} aria-hidden="true" /> {fmtTime(Math.max(0, limit - elapsed))}
          </span>
        )}
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((i + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>
      <p className="text-[17px] font-medium leading-7">{q.prompt}</p>
      <div className="mt-5 space-y-2">
        {q.choices.map((c) => {
          const tone = !answered ? "border-border hover:border-border-strong" : c.key === q.answer ? "border-success bg-success/10" : c.key === picked ? "border-destructive bg-destructive/10" : "border-border opacity-50";
          return (
            <button key={c.key} type="button" disabled={answered} onClick={() => pick(c.key)} className={cn("tap flex min-h-12 w-full items-center gap-3 rounded-lg border-2 bg-surface px-4 py-3 text-left text-[15px]", tone)}>
              <span className="w-5 shrink-0 font-semibold text-muted-foreground">{c.key}</span>
              <span className="flex-1">{c.text}</span>
              {answered && c.key === q.answer && <Check size={17} className="text-success" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4" role="status">
          <p className={cn("flex items-center gap-2 text-[14px] font-semibold", picked === q.answer ? "text-success" : "text-destructive")}>
            {picked === q.answer ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
            {picked === q.answer ? "Benar" : "Belum tepat"}
          </p>
          {picked !== q.answer && <p className="mt-2 text-[13.5px] font-medium">Jawaban benar: {q.answer}. {q.choices.find((choice) => choice.key === q.answer)?.text}</p>}
          <p className="text-[13.5px] leading-6 text-muted-foreground">{q.explanation.why}</p>
          <Button size="block" onClick={next} className="mt-3">{i === questions.length - 1 ? "Selesai" : "Continue"}</Button>
        </div>
      )}
    </div>
  );
}

function DrillResult({ correct, total, answered, seconds, config, trail, onAgain, onConfigure }: { correct: number; total: number; answered: number; seconds: number; config: Config; trail: string[]; onAgain: () => void; onConfigure: () => void }) {
  const acc = answered ? Math.round((correct / answered) * 100) : 0;
  const summary = acc >= 80 ? "Sangat baik — naikkan tingkat kesulitan berikutnya." : acc >= 60 ? "Cukup baik — ulangi untuk menguatkan pola." : "Perlu latihan lagi — coba jumlah soal lebih sedikit dan fokus.";
  return (
    <div className="mx-auto max-w-md py-4">
      <p className="label-xs">{trail.slice(1).join(" · ")}</p>
      <h2 className="mt-1 text-[24px] font-semibold tracking-tight">{answered < total ? "Waktu habis" : "Drill selesai"}</h2>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {[
          ["Benar", `${correct}/${total}`],
          ["Akurasi", `${acc}%`],
          ["Dijawab", `${answered}/${total}`],
          ["Waktu", fmtTime(seconds)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-border bg-surface p-4 shadow-soft">
            <p className="label-xs">{k}</p>
            <p className="mt-1 text-[22px] font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-[14px]">{summary}</p>
      <p className="mt-2 text-[12.5px] text-muted-foreground">{config.difficulty} · {config.order} · {config.minutes ? `${config.minutes} menit` : "tanpa batas"}</p>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <button type="button" onClick={onConfigure} className="tap rounded-lg border border-border bg-surface py-3 text-[14px] font-semibold">Ubah konfigurasi</button>
        <button type="button" onClick={onAgain} className="tap rounded-lg bg-primary py-3 text-[14px] font-semibold text-primary-foreground">Ulangi drill</button>
      </div>
    </div>
  );
}
