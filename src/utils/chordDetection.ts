import { Chord } from 'tonal'
import { DiagramState, ChordDetectionResult } from '../types/chord'
import { getSoundingPitchClasses } from './noteUtils'

/**
 * Formats a chord name: strips slash bass note, lowercases root for minor chords.
 * Major stays capital (e.g. "G", "Cmaj7"), minor becomes lowercase root (e.g. "am", "bm7").
 */
function formatChordName(name: string): string {
  const baseName = name.split('/')[0]
  const chord = Chord.get(baseName)
  if (!chord.tonic) return baseName
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
  const pitchClasses = getSoundingPitchClasses(state)

  if (pitchClasses.length < 2) {
    return { chords: [] }
  }

  const seen = new Set<string>()
  const chords: string[] = []
  for (const name of Chord.detect(pitchClasses)) {
    const formatted = formatChordName(name)
    if (!seen.has(formatted)) {
      seen.add(formatted)
      chords.push(formatted)
    }
  }

  return { chords }
}
