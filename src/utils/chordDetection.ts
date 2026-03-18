import { Chord } from 'tonal'
import { DiagramState, ChordDetectionResult } from '../types/chord'
import { getSoundingNotes } from './noteUtils'

/**
 * Formats a chord name: strips slash bass note, strips trailing M for plain major,
 * lowercases root for minor chords.
 * e.g. "GM" → "G", "Gmaj7" → "Gmaj7", "Am" → "am", "Bm7" → "bm7"
 */
function formatChordName(name: string): string {
  const baseName = name.split('/')[0]
  const chord = Chord.get(baseName)
  if (!chord.tonic) return baseName

  if (chord.quality === 'Major' && chord.type === 'major') {
    return chord.tonic
  }
  if (chord.quality === 'Minor') {
    return baseName.replace(chord.tonic, chord.tonic.toLowerCase())
  }
  return baseName
}

/**
 * Detects chord name(s) from the current diagram state.
 * Returns a ranked, deduplicated list of formatted chord names.
 */
export function detectChord(state: DiagramState): ChordDetectionResult {
  const notes = getSoundingNotes(state)

  if (notes.length < 2) {
    return { chords: [] }
  }

  const seen = new Set<string>()
  const chords: string[] = []
  for (const name of Chord.detect(notes)) {
    const formatted = formatChordName(name)
    if (!seen.has(formatted)) {
      seen.add(formatted)
      chords.push(formatted)
    }
  }

  return { chords }
}
