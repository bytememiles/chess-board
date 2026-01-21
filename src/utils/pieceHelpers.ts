import type { BoardState, Piece, SquareNotation } from '@/types/chess'

/**
 * Get the standard chess starting position
 * @returns BoardState with all pieces in their initial positions
 */
export function getInitialBoardState(): BoardState {
  const board = new Map<SquareNotation, Piece | null>()

  // Initialize all squares as empty
  for (let rank = 1; rank <= 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const fileChar = String.fromCharCode(97 + file) // 'a' to 'h'
      const square = `${fileChar}${rank}` as SquareNotation
      board.set(square, null)
    }
  }

  // White pieces (rank 1-2)
  // Rank 1: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
  board.set('a1', { type: 'rook', color: 'white' })
  board.set('b1', { type: 'knight', color: 'white' })
  board.set('c1', { type: 'bishop', color: 'white' })
  board.set('d1', { type: 'queen', color: 'white' })
  board.set('e1', { type: 'king', color: 'white' })
  board.set('f1', { type: 'bishop', color: 'white' })
  board.set('g1', { type: 'knight', color: 'white' })
  board.set('h1', { type: 'rook', color: 'white' })

  // Rank 2: Pawns
  for (let file = 0; file < 8; file++) {
    const fileChar = String.fromCharCode(97 + file)
    const square = `${fileChar}2` as SquareNotation
    board.set(square, { type: 'pawn', color: 'white' })
  }

  // Black pieces (rank 7-8)
  // Rank 8: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
  board.set('a8', { type: 'rook', color: 'black' })
  board.set('b8', { type: 'knight', color: 'black' })
  board.set('c8', { type: 'bishop', color: 'black' })
  board.set('d8', { type: 'queen', color: 'black' })
  board.set('e8', { type: 'king', color: 'black' })
  board.set('f8', { type: 'bishop', color: 'black' })
  board.set('g8', { type: 'knight', color: 'black' })
  board.set('h8', { type: 'rook', color: 'black' })

  // Rank 7: Pawns
  for (let file = 0; file < 8; file++) {
    const fileChar = String.fromCharCode(97 + file)
    const square = `${fileChar}7` as SquareNotation
    board.set(square, { type: 'pawn', color: 'black' })
  }

  return board
}

/**
 * Get Unicode symbol for a chess piece (fallback)
 * @param piece The chess piece
 * @returns Unicode character representing the piece
 */
export function getPieceSymbol(piece: Piece): string {
  const symbols: Record<Piece['type'], { white: string; black: string }> = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' },
  }
  return symbols[piece.type][piece.color]
}

/**
 * Get display name for a chess piece
 * @param piece The chess piece
 * @returns Human-readable name (e.g., "White King")
 */
export function getPieceName(piece: Piece): string {
  const typeNames: Record<Piece['type'], string> = {
    king: 'King',
    queen: 'Queen',
    rook: 'Rook',
    bishop: 'Bishop',
    knight: 'Knight',
    pawn: 'Pawn',
  }
  return `${piece.color.charAt(0).toUpperCase() + piece.color.slice(1)} ${typeNames[piece.type]}`
}
