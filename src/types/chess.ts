export type SquarePosition = {
  row: number // 0-7 (0 = rank 8, 7 = rank 1)
  col: number // 0-7 (0 = file a, 7 = file h)
}

export type SquareNotation = string

export type ClickEvent = {
  id: number // Unique identifier for this click
  square: SquareNotation // Algebraic notation (e.g., 'a1')
  position: SquarePosition // Row/col coordinates
  timestamp: number // Unix timestamp in milliseconds
  sequence: number // Order in which it was clicked (1, 2, 3...)
}

export type SquareHighlight = {
  square: SquareNotation
  isHighlighted: boolean
}

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

export type PieceColor = 'white' | 'black'

export type Piece = {
  type: PieceType
  color: PieceColor
}

export type BoardState = Map<SquareNotation, Piece | null>

export type Move = {
  piece: Piece
  from: SquareNotation
  to: SquareNotation
  timestamp: number
}

export type MoveHistory = Move[]
