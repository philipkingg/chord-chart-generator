// Per-string state: 'muted' = X, 'open' = open string, number = fret (1-based)
export type StringState = 'muted' | 'open' | number

// The full diagram state: 6 strings (index 0 = low E, index 5 = high E)
export type DiagramState = StringState[]

export interface ChordDetectionResult {
  chords: string[]  // ranked best to worst, empty if unknown
}
