import { Note, Interval } from 'tonal'
import { StringState, DiagramState } from '../types/chord'

// Standard guitar tuning, index 0 = low E (string 6), index 5 = high E (string 1)
export const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] as const

// Pitch classes for each string (no octave): ['E', 'A', 'D', 'G', 'B', 'E']
export const TUNING_PITCH_CLASSES = STANDARD_TUNING.map(n => Note.pitchClass(n))

/**
 * Returns the note name for a given string and fret.
 * fret 0 = open string
 */
export function getNote(stringIndex: number, fret: number): string {
  const openNote = STANDARD_TUNING[stringIndex]
  if (fret === 0) return openNote
  return Note.transpose(openNote, Interval.fromSemitones(fret))
}

/**
 * Returns the pitch class (e.g. "G", "B", "D") for a string/fret, stripping octave.
 */
export function getPitchClass(stringIndex: number, fret: number): string {
  const note = getNote(stringIndex, fret)
  return Note.pitchClass(note)
}

/**
 * Given the full diagram state, returns all sounding pitch classes (deduped, ordered).
 */
export function getSoundingPitchClasses(state: DiagramState): string[] {
  const pitchClasses: string[] = []
  state.forEach((s: StringState, i: number) => {
    if (s === 'muted') return
    const fret = s === 'open' ? 0 : (s as number)
    const pc = getPitchClass(i, fret)
    if (!pitchClasses.includes(pc)) {
      pitchClasses.push(pc)
    }
  })
  return pitchClasses
}

/**
 * Given the full diagram state, returns all sounding notes with octaves (e.g. "G2", "B3").
 * Includes duplicates across octaves so tonal can use voicing information.
 */
export function getSoundingNotes(state: DiagramState): string[] {
  const notes: string[] = []
  state.forEach((s: StringState, i: number) => {
    if (s === 'muted') return
    const fret = s === 'open' ? 0 : (s as number)
    notes.push(getNote(i, fret))
  })
  return notes
}

/**
 * Returns the number of frets the diagram should show (always 5).
 */
export const FRET_COUNT = 5

/**
 * Returns the lowest fret position used (for determining capo/window position).
 * Returns 0 if only open strings are fretted.
 */
export function getMinFret(state: DiagramState): number {
  const frets = state
    .filter((s): s is number => typeof s === 'number')
  return frets.length > 0 ? Math.min(...frets) : 0
}
