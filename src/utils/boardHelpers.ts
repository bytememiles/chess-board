import type { SquarePosition } from '@/types/chess'

/**
 * Check if a square is light or dark colored
 * @param row 0-7
 * @param col 0-7
 * @returns true if light square, false if dark
 */
export function isLightSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 0
}

/**
 * Get all 64 square positions on a chessboard
 * @returns Array of all SquarePosition objects
 */
export function getAllSquares(): SquarePosition[] {
  const squares: SquarePosition[] = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      squares.push({ row, col })
    }
  }
  return squares
}
