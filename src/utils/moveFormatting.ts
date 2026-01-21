import type { BoardState, Move, MoveHistory } from '@/types/chess'

function getPieceAbbreviation(pieceType: string): string {
  const abbreviations: Record<string, string> = {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: '',
  }
  return abbreviations[pieceType] || ''
}

export function formatMoveToAlgebraic(
  move: Move,
  boardState: BoardState,
  _moveHistory?: MoveHistory
): string {
  const { piece, from, to } = move
  const targetPiece = boardState.get(to)
  const isCapture = targetPiece != null && targetPiece.color !== piece.color
  const pieceAbbr = getPieceAbbreviation(piece.type)

  if (piece.type === 'pawn') {
    if (isCapture) {
      const fromFile = from.charAt(0)
      return `${fromFile}x${to}`
    }
    return to
  }

  if (isCapture) {
    return `${pieceAbbr}x${to}`
  } else {
    return `${pieceAbbr}${to}`
  }
}

export function formatMoveWithCheck(
  move: Move,
  boardState: BoardState,
  _moveHistory?: MoveHistory
): string {
  const notation = formatMoveToAlgebraic(move, boardState, _moveHistory)
  // TODO: Add check (+) and checkmate (#) detection
  return notation
}
