type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
      {subtitle ? <p className="mt-5 text-base text-slate-400 sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}
