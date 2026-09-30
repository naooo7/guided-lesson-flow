import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, summarize, useActivity } from "@/lib/activity";

export const Route = createFileRoute("/result")({
  validateSearch: (search: Record<string, unknown>) => ({
    correct: Number(search["correct"] ?? 0),
    total: Number(search["total"] ?? 0),
    material: (search["material"] as string) ?? "Practice",
    examId: (search["examId"] as string) ?? "skd",
    subtestId: (search["subtestId"] as string) ?? "tiu",
    sessionId: (search["sessionId"] as string) ?? "",
  }),
  head: () => ({
    meta: [
      { title: "Session result — Fundamental." },
      { name: "description", content: "Your score, accuracy and the questions worth revisiting." },
      { property: "og:title", content: "Session result — Fundamental." },
      { property: "og:description", content: "Your score and the questions worth revisiting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultScreen,
});

function performanceSummary(pct: number, total: number) {
  if (!total) return { title: "Session complete", body: "Your results are ready for review." };
  if (pct >= 90) return { title: "Excellent command", body: "You were precise throughout this set. Keep the momentum going." };
  if (pct >= 75) return { title: "Strong progress", body: "Your foundation is solid. A quick review will close the remaining gaps." };
  if (pct >= 50) return { title: "Building steadily", body: "You have the core ideas. Review the misses before your next round." };
  return { title: "Good first pass", body: "Use the review to understand each miss, then try another focused set." };
}

function ResultScreen() {
  const search = Route.useSearch();
  const data = useActivity();
  const session = data?.sessions.find((s) => s.id === search.sessionId);
  const attempts = data?.attempts.filter((a) => a.sessionId === search.sessionId) ?? [];
  const stats = attempts.length ? summarize(attempts) : null;

  const correct = stats ? stats.correct : search.correct;
  const total = stats ? stats.total : search.total;
  const incorrect = Math.max(total - correct, 0);
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const time = session?.endedAt
    ? new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()
    : (stats?.timeMs ?? 0);
  const summary = performanceSummary(pct, total);

  return (
    <div className="min-h-screen bg-background">
      <main className="screen-in mx-auto w-full max-w-[760px] px-5 pb-10 pt-8 sm:px-8 sm:pt-12">
        <header className="text-center">
          <p className="label-xs">Session complete</p>
          <p className="mt-2 text-[15px] text-muted-foreground">{session?.materialName ?? search.material}</p>
        </header>

        <section className="relative mx-auto mt-6 max-w-[520px] overflow-hidden rounded-2xl border border-border bg-surface px-5 py-6 text-center shadow-raised sm:px-8 sm:py-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary/80" aria-hidden="true" />
          <p className="text-[13px] font-medium text-muted-foreground">Your score</p>
          <div className="mt-2 flex items-end justify-center gap-2">
            <span className="tabular text-[58px] font-semibold leading-none tracking-[-0.04em]">{correct}</span>
            <span className="tabular mb-1 text-[22px] text-muted-foreground">/ {total}</span>
          </div>
          <div className="mx-auto mt-5 max-w-[340px]">
            <div className="mb-2 flex items-center justify-between text-[12px]">
              <span className="font-medium text-foreground">Accuracy</span>
              <span className="tabular font-semibold text-primary">{pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Accuracy" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </section>

        <section aria-label="Session statistics" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultStat icon={Check} label="Correct" value={String(correct)} tone="success" />
          <ResultStat icon={X} label="Incorrect" value={String(incorrect)} tone="destructive" />
          <ResultStat icon={Clock3} label="Time" value={data ? formatDuration(time) : "—"} />
          <ResultStat icon={RotateCcw} label="Review" value={`${incorrect} ${incorrect === 1 ? "question" : "questions"}`} />
        </section>

        <section className="mt-4 border-y border-border py-5 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="text-[16px] font-semibold">{summary.title}</p>
            <p className="mt-1 max-w-[480px] text-[14px] leading-relaxed text-muted-foreground">{summary.body}</p>
          </div>
          <span className="tabular mt-3 inline-flex shrink-0 items-center rounded-full bg-primary-soft px-3 py-1.5 text-[12px] font-semibold text-primary sm:mt-0">
            {correct} of {total} correct
          </span>
        </section>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          <Button asChild size="block">
            <Link to="/review">Review answers <ArrowRight className="size-4" /></Link>
          </Button>
          <Button asChild size="block" variant="outline">
            <Link to="/practice">Continue practice <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

type ResultStatProps = {
  icon: typeof Check;
  label: string;
  value: string;
  tone?: "success" | "destructive";
};

function ResultStat({ icon: Icon, label, value, tone }: ResultStatProps) {
  const toneClass = tone === "success" ? "bg-success/[0.1] text-success" : tone === "destructive" ? "bg-destructive/[0.09] text-destructive" : "bg-primary-soft text-primary";
  return (
    <div className="rounded-xl border border-border bg-surface p-3.5 shadow-soft">
      <span className={`flex size-8 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <p className="tabular mt-3 truncate text-[17px] font-semibold">{value}</p>
      <p className="mt-0.5 text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}
