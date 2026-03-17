import { Note } from 'tonal'
import { StringState, DiagramState } from '../types/chord'

// Standard guitar tuning, index 0 = low E (string 6), index 5 = high E (string 1)
export const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] as const

/**
 * Returns the note name for a given string and fret.
 * fret 0 = open string
 */
export function getNote(stringIndex: number, fret: number): string {
  const openNote = STANDARD_TUNING[stringIndex]
  if (fret === 0) return openNote
  const transposed = Note.transpose(openNote, `${fret}s`) // s = semitones
  return transposed
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
