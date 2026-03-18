import { Chord } from 'tonal'
import { DiagramState, ChordDetectionResult } from '../types/chord'
import { getSoundingPitchClasses } from './noteUtils'

/**
 * Simplifies a tonal chord name:
 * - Strips slash chord bass (e.g. "GM/D" → treated as "GM")
 * - Major chords → just the root capital letter (e.g. "G")
 * - Minor chords → lowercase root (e.g. "a")
 * - Other qualities → root + type, no slash (e.g. "Cmaj7", "G7")
 */
function simplifyChordName(name: string): string {
  const chord = Chord.get(name)
  if (!chord.tonic) return name.split('/')[0]

  if (chord.quality === 'Major') return chord.tonic
  if (chord.quality === 'Minor') return chord.tonic.toLowerCase()

  // For Dominant, Augmented, Diminished, etc. — strip slash, keep as-is
  return name.split('/')[0]
}

/**
 * Detects chord name(s) from the current diagram state.
 * Returns a ranked, deduplicated list of simplified chord names.
 */
export function detectChord(state: DiagramState): ChordDetectionResult {
  const pitchClasses = getSoundingPitchClasses(state)

  if (pitchClasses.length < 2) {
    return { chords: [] }
  }

  const detected = Chord.detect(pitchClasses)
  const seen = new Set<string>()
  const chords: string[] = []

  for (const name of detected) {
    const simplified = simplifyChordName(name)
    if (!seen.has(simplified)) {
      seen.add(simplified)
      chords.push(simplified)
    }
  }

  return { chords }
}
