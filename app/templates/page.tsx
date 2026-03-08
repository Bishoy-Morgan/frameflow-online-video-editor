import React from 'react'
import TemplatesGalleryPage from './components/TemplatesGalleryPage'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
    title:       'Frameflow | Templates',
    description: 'Start faster with ready-to-use video templates for Reels, YouTube, ads, and more.',
}

export default function page() {
    return (
        <>
            <main>
                <Navbar />
                <TemplatesGalleryPage />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}
