/**
 * Chess square coordinates (0-7 for row/col, or algebraic notation like 'a1')
 */
export type SquarePosition = {
  row: number // 0-7 (0 = rank 8, 7 = rank 1)
  col: number // 0-7 (0 = file a, 7 = file h)
}

/**
 * Algebraic notation for a square (e.g., 'a1', 'e4', 'h8')
 */
export type SquareNotation = string

/**
 * Click event data
 */
export type ClickEvent = {
  id: number // Unique identifier for this click
  square: SquareNotation // Algebraic notation (e.g., 'a1')
  position: SquarePosition // Row/col coordinates
  timestamp: number // Unix timestamp in milliseconds
  sequence: number // Order in which it was clicked (1, 2, 3...)
}

/**
 * Highlight state for a square
 */
export type SquareHighlight = {
  square: SquareNotation
  isHighlighted: boolean
}

/**
 * Chess piece types
 */
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

/**
 * Chess piece colors
 */
export type PieceColor = 'white' | 'black'

/**
 * Chess piece representation
 */
export type Piece = {
  type: PieceType
  color: PieceColor
}

/**
 * Board state: maps square notation to piece (or null if empty)
 */
export type BoardState = Map<SquareNotation, Piece | null>
