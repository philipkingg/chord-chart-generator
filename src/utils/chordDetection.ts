import { Chord } from 'tonal'
import { DiagramState, ChordDetectionResult } from '../types/chord'
import { getSoundingPitchClasses } from './noteUtils'

/**
 * Detects chord name(s) from the current diagram state.
 * Returns a ranked list of chord name matches (best first).
 */
export function detectChord(state: DiagramState): ChordDetectionResult {
  const pitchClasses = getSoundingPitchClasses(state)

  if (pitchClasses.length < 2) {
    return { chords: [] }
  }

  const detected = Chord.detect(pitchClasses)
  return { chords: detected }
}
