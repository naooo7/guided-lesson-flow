import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Screen, PageHeader, ListRow } from "@/components/app-shell";
import { exams } from "@/data/prototype";
import { FundamentalPath } from "@/components/fundamental-path";

const modes = {
  drill: { title: "Drill Soal", description: "Latihan bebas sesuai kebutuhanmu." },
  latihan: { title: "Latihan Soal", description: "Bangun kemampuanmu secara bertahap." },
  "try-out": { title: "Try Out", description: "Uji kemampuanmu dalam simulasi ujian." },
  read: { title: "Read", description: "Belajar lewat bacaan dan pemahaman." },
  fundamental: { title: "Fundamental.", description: "Perkuat kemampuan dasar yang menjadi fondasi belajar." },
} as const;

type Mode = keyof typeof modes;

function isMode(value: string): value is Mode {
  return value in modes;
}

export const Route = createFileRoute("/practice/mode/$mode")({
  head: ({ params }) => {
    const mode = isMode(params.mode) ? modes[params.mode] : undefined;
    const title = `${mode?.title ?? "Practice"} — Fundamental.`;
    const description = mode?.description ?? "Explore ways to practice with Fundamental.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ModeScreen,
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="label-xs mb-2">{children}</h2>;
}

function PreviewRow({ title, detail, last = false }: { title: string; detail: string; last?: boolean }) {
  return (
    <div className={`flex min-w-0 items-center justify-between gap-4 py-3.5 ${last ? "" : "border-b border-border"}`}>
      <span className="min-w-0 text-[15px] font-medium">{title}</span>
      <span className="shrink-0 text-[13px] text-muted-foreground">{detail}</span>
    </div>
  );
}

function ModeScreen() {
  const { mode } = Route.useParams();
  if (!isMode(mode)) throw notFound();
  const current = modes[mode];

  return (
    <Screen className="md:max-w-[800px] md:px-8 md:pt-10 lg:px-12">
      <PageHeader title={current.title} caption={current.description} back={{ to: "/practice" }} />
      {mode === "drill" && (
        <section>
          <p className="mb-6 max-w-xl text-[14px] leading-6 text-muted-foreground">
            Pilih materi yang ingin kamu latih. Atur latihan sesuai kebutuhanmu, tanpa urutan yang harus diikuti.
          </p>
          <SectionTitle>Pilih kategori</SectionTitle>
          <div className="divide-y divide-border border-y border-border sm:grid sm:grid-cols-2 sm:divide-y-0 sm:gap-x-8">
            {exams.map((exam) => (
              <Link key={exam.id} to="/practice/$examId" params={{ examId: exam.id }} className="tap block border-b border-border last:border-b-0 sm:last:border-b">
                <ListRow title={exam.name} caption={exam.caption} />
              </Link>
            ))}
          </div>
        </section>
      )}
      {mode === "latihan" && (
        <section className="max-w-2xl">
          <SectionTitle>Contoh jalur belajar</SectionTitle>
          <div className="border-y border-border">
            <div className="py-4">
              <p className="text-[16px] font-semibold">Matematika</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">Level 1</p>
            </div>
            <PreviewRow title="A · Operasi Dasar" detail="Langkah 1" />
            <PreviewRow title="B · Pecahan" detail="Langkah 2" />
            <PreviewRow title="C · Persentase" detail="Langkah 3" />
            <PreviewRow title="D · Perbandingan" detail="Langkah 4" />
            <PreviewRow title="Final Boss" detail="Tantangan akhir" last />
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">Pratinjau jalur belajar · belum tersedia untuk dimainkan.</p>
        </section>
      )}
      {mode === "try-out" && (
        <section className="max-w-2xl">
          <SectionTitle>Contoh simulasi</SectionTitle>
          <div className="flex items-center justify-between gap-4 border-y border-border py-5">
            <div className="min-w-0">
              <p className="text-[16px] font-semibold">SKD Try Out #01</p>
              <p className="mt-1 text-[13px] text-muted-foreground">110 soal · 100 menit</p>
            </div>
            <span className="shrink-0 text-[13px] text-muted-foreground">Segera hadir</span>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">Simulasi ujian ini adalah pratinjau dan belum dapat dimulai.</p>
        </section>
      )}
      {mode === "read" && (
        <section className="max-w-2xl">
          <SectionTitle>Contoh bacaan</SectionTitle>
          <div className="border-y border-border">
            <PreviewRow title="Understanding Context" detail="English · 7 min" />
            <PreviewRow title="Kalimat Efektif" detail="Indonesia · 5 min" last />
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">Bacaan ini adalah pratinjau dan belum dapat dibuka.</p>
        </section>
      )}
      {mode === "fundamental" && <FundamentalPath />}
      <Link to="/practice" className="tap mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-primary hover:underline">
        Lihat semua mode <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </Screen>
  );
}