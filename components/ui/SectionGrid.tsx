import React from 'react'

const SectionGrid = () => (
    <>
        {/* Grid lines */}
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 section-grid"
        />
        {/* Top fade — blends into section above */}
        <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 fade-top"
        />
        {/* Bottom fade — blends into section below */}
        <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 fade-bottom"
        />
    </>
)

export default SectionGrid