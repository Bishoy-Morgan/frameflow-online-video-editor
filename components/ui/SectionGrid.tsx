const SectionGrid = () => (
    <>
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 section-grid opacity-70"
        />

        <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 fade-top"
        />

        <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 fade-bottom"
        />

        <div
            aria-hidden
            className="pointer-events-none absolute top-[12%] -right-[8%] h-130 w-130 rounded-full bg-(--accent-16) blur-[100px]"
        />

        <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[8%] -left-[10%] h-120 w-120 rounded-full bg-(--accent-10) blur-[90px]"
        />

        <div
            aria-hidden
            className="pointer-events-none absolute top-[25%] right-[18%] h-64 w-64 rounded-full bg-(--accent-16) blur-[70px]"
        />
    </>
)

export default SectionGrid