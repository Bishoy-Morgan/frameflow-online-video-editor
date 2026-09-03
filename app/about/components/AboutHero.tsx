'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'
import Button from '@/components/ui/Button'

const AboutHero = () => {
  return (
    <section className="relative w-full min-h-svh max-h-400 overflow-hidden ">

      <SectionGrid />

      <div className="container flex justify-center relative z-10 pt-40 pb-28">
        <div className="w-full flex flex-col justify-center items-center ">
          <motion.h1
            className="text-main font-normal mb-7 text-center max-w-200"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0 }}
          >
            Editing video should feel{' '}
            <span className="relative inline-block italic text-(--accent-fg)">
              effortless
              <svg
                aria-hidden
                viewBox="0 0 220 12"
                fill="none"
                className="absolute left-0 w-full"
                style={{ bottom: '-6px', height: '10px' }}
              >
                <path
                  d="M2 8 C40 3, 80 10, 120 5 C160 1, 200 9, 218 6"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </span><br/>
            not technical.
          </motion.h1>

          <motion.p
            className="text-body 3xl:text-hero max-w-150 mb-11 text-(--text) text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.12 }}
          >
            Frameflow was built to rethink video editing on the web — removing
            unnecessary complexity and delivering a fast, real-time workflow
            directly in the browser.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.25 }}
          >

            <Button 
              variant="primary"
              size='lg'
            >
              Try Frameflow
            </Button>

            <Button
              variant="secondary"
              size='lg'
              icon={<ArrowRight size={14} strokeWidth={2} />}
              iconPosition="right"
            >
              Why we built it
            </Button> 

          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-x-20 gap-y-4 mt-16 pt-8 "
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.38 }}
          >
            <div className="flex items-center gap-3 my-3 md:my-0">
              <span className="text-4xl font-normal text-(--accent)">60</span>
              <span className="text-body leading-5 text-(--text)">
                frames
                <br />
                per second
              </span>
            </div>

            <span className="w-px h-8 bg-(--accent-fg) hidden md:block" />

            <div className="flex items-center gap-3 my-3 md:my-0">
              <span className="text-4xl font-normal text-(--accent)">4K</span>
              <span className="text-body leading-5 text-(--text)">
                export
                <br />
                quality
              </span>
            </div>

            <span className="w-px h-8 bg-(--accent-fg) hidden md:block" />

            <div className="flex items-center gap-3 my-3 md:my-0">
              <span className="text-4xl font-normal text-(--accent)">0</span>
              <span className="text-body leading-5 text-(--text)">
                installs
                <br />
                required
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default AboutHero