import type { SquareNotation, SquarePosition } from '@/types/chess'

/**
 * Convert row/col coordinates to algebraic notation (e.g., 0,0 -> 'a8', 7,7 -> 'h1')
 * @param row 0-7 (0 = rank 8, 7 = rank 1)
 * @param col 0-7 (0 = file a, 7 = file h)
 * @returns Algebraic notation string (e.g., 'a1', 'e4')
 */
export function positionToNotation(row: number, col: number): SquareNotation {
  const file = String.fromCharCode(97 + col) // 'a' to 'h'
  const rank = 8 - row // Convert 0-7 to 8-1
  return `${file}${rank}` as SquareNotation
}

/**
 * Convert algebraic notation to row/col coordinates
 * @param notation Algebraic notation (e.g., 'a1', 'e4')
 * @returns SquarePosition with row and col
 */
export function notationToPosition(notation: SquareNotation): SquarePosition {
  const file = notation.charCodeAt(0) - 97 // 'a' = 0, 'h' = 7
  const rank = parseInt(notation.charAt(1), 10)
  return {
    col: file,
    row: 8 - rank, // Convert rank 1-8 to row 0-7
  }
}

/**
 * Check if a square notation is valid
 * @param notation String to validate
 * @returns true if valid chess square notation
 */
export function isValidNotation(notation: string): boolean {
  return /^[a-h][1-8]$/.test(notation)
}
