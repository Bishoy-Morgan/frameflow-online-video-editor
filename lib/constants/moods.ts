export const MOOD_NAMES = [
  'Cinematic',
  'Dramatic',
  'Uplifting',
  'Calm',
  'Energetic',
  'Melancholic',
  'Mysterious',
  'Playful',
] as const

export type MoodName = typeof MOOD_NAMES[number]

type MoodColor = {
  bg: string
  text: string
  border: string
}

export const MOOD_COLORS: Record<MoodName, MoodColor> = {
  Cinematic: { bg: 'var(--accent-8)', text: 'var(--accent)', border: 'var(--accent-22)' },
  Dramatic: { bg: 'var(--mood-dramatic-8)', text: 'var(--mood-dramatic)', border: 'var(--mood-dramatic-22)' },
  Uplifting: { bg: 'var(--mood-uplifting-8)', text: 'var(--mood-uplifting)', border: 'var(--mood-uplifting-22)' },
  Calm: { bg: 'var(--mood-calm-8)', text: 'var(--mood-calm)', border: 'var(--mood-calm-22)' },
  Energetic: { bg: 'var(--mood-energetic-8)', text: 'var(--mood-energetic)', border: 'var(--mood-energetic-22)' },
  Melancholic: { bg: 'var(--mood-melancholic-8)', text: 'var(--mood-melancholic)', border: 'var(--mood-melancholic-22)' },
  Mysterious: { bg: 'var(--mood-mysterious-8)', text: 'var(--mood-mysterious)', border: 'var(--mood-mysterious-22)' },
  Playful: { bg: 'var(--mood-playful-8)', text: 'var(--mood-playful)', border: 'var(--mood-playful-22)' },
}

const DEFAULT_MOOD_COLOR: MoodColor = {
  bg: 'var(--surface-raised)',
  text: 'var(--text-tertiary)',
  border: 'var(--border-subtle)',
}

export function getMoodColor(mood: string | null | undefined): MoodColor {
  if (!mood) return DEFAULT_MOOD_COLOR
  return MOOD_COLORS[mood as MoodName] ?? DEFAULT_MOOD_COLOR
}