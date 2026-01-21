import type { BoardState, MoveHistory, Piece, SquareNotation, SquarePosition } from '@/types/chess'
import { notationToPosition, positionToNotation } from '@/utils/chessNotation'

/**
 * Get all squares between two positions (exclusive of from and to)
 * @param from Starting position
 * @param to Ending position
 * @returns Array of positions between from and to
 */
export function getSquaresBetween(from: SquarePosition, to: SquarePosition): SquarePosition[] {
  const squares: SquarePosition[] = []
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  // Must be horizontal, vertical, or diagonal
  if (rowDiff === 0 && colDiff === 0) {
    return squares // Same square
  }

  // Check if it's a straight line
  const isHorizontal = rowDiff === 0 && colDiff !== 0
  const isVertical = colDiff === 0 && rowDiff !== 0
  const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return squares // Not a straight line (e.g., knight move)
  }

  // Calculate step direction
  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1
  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1

  // Calculate number of steps
  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))

  // Get all intermediate squares
  for (let i = 1; i < steps; i++) {
    squares.push({
      row: from.row + rowStep * i,
      col: from.col + colStep * i,
    })
  }

  return squares
}

/**
 * Check if the path between two squares is clear (no pieces blocking)
 * @param from Starting position
 * @param to Ending position
 * @param boardState Current board state
 * @returns true if path is clear
 */
export function isPathClear(
  from: SquarePosition,
  to: SquarePosition,
  boardState: BoardState
): boolean {
  const squaresBetween = getSquaresBetween(from, to)

  for (const square of squaresBetween) {
    const notation = positionToNotation(square.row, square.col)
    if (boardState.get(notation) !== null) {
      return false // Path is blocked
    }
  }

  return true
}

/**
 * Check if a piece can capture a target piece
 * @param piece The moving piece
 * @param targetPiece The piece on the target square (or null if empty)
 * @returns true if piece can capture target
 */
export function canCapture(piece: Piece, targetPiece: Piece | null): boolean {
  if (targetPiece === null) {
    return true // Can move to empty square
  }
  return piece.color !== targetPiece.color // Can capture opponent pieces
}

/**
 * Validate a knight move
 * @param from Starting position
 * @param to Ending position
 * @returns true if valid knight move
 */
export function isValidKnightMove(from: SquarePosition, to: SquarePosition): boolean {
  const rowDiff = Math.abs(to.row - from.row)
  const colDiff = Math.abs(to.col - from.col)

  // Knight moves in L-shape: 2+1 or 1+2
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
}

/**
 * Validate a rook move
 * @param from Starting position
 * @param to Ending position
 * @param boardState Current board state
 * @returns true if valid rook move
 */
export function isValidRookMove(
  from: SquarePosition,
  to: SquarePosition,
  boardState: BoardState
): boolean {
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  // Rook moves horizontally or vertically
  const isHorizontal = rowDiff === 0 && colDiff !== 0
  const isVertical = colDiff === 0 && rowDiff !== 0

  if (!isHorizontal && !isVertical) {
    return false
  }

  // Check path is clear
  return isPathClear(from, to, boardState)
}

/**
 * Validate a bishop move
 * @param from Starting position
 * @param to Ending position
 * @param boardState Current board state
 * @returns true if valid bishop move
 */
export function isValidBishopMove(
  from: SquarePosition,
  to: SquarePosition,
  boardState: BoardState
): boolean {
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  // Bishop moves diagonally
  const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0

  if (!isDiagonal) {
    return false
  }

  // Check path is clear
  return isPathClear(from, to, boardState)
}

/**
 * Validate a queen move
 * @param from Starting position
 * @param to Ending position
 * @param boardState Current board state
 * @returns true if valid queen move
 */
export function isValidQueenMove(
  from: SquarePosition,
  to: SquarePosition,
  boardState: BoardState
): boolean {
  // Queen can move like rook or bishop
  return isValidRookMove(from, to, boardState) || isValidBishopMove(from, to, boardState)
}

/**
 * Validate a pawn move
 * @param piece The pawn piece
 * @param from Starting position
 * @param to Ending position
 * @param boardState Current board state
 * @param moveHistory Move history for first move detection
 * @returns true if valid pawn move
 */
export function isValidPawnMove(
  piece: Piece,
  from: SquarePosition,
  to: SquarePosition,
  boardState: BoardState,
  moveHistory?: MoveHistory
): boolean {
  const colDiff = Math.abs(to.col - from.col)
  const targetNotation = positionToNotation(to.row, to.col)
  const targetPiece = boardState.get(targetNotation) ?? null

  // White pawns move "up" (decreasing row), black pawns move "down" (increasing row)
  const direction = piece.color === 'white' ? -1 : 1
  const expectedRowDiff = direction * (to.row - from.row)

  // Check if moving forward
  if (expectedRowDiff <= 0) {
    return false // Can't move backward or sideways without capturing
  }

  // Check starting rank for first move
  const startingRank = piece.color === 'white' ? 6 : 1 // Row 6 = rank 2, Row 1 = rank 7
  const isOnStartingRank = from.row === startingRank
  const hasMoved =
    moveHistory && moveHistory.some(move => move.from === positionToNotation(from.row, from.col))

  // Forward movement (no capture)
  if (colDiff === 0) {
    // Can move 1 square forward
    if (expectedRowDiff === 1) {
      return targetPiece === null // Must be empty
    }

    // Can move 2 squares forward on first move
    if (expectedRowDiff === 2 && isOnStartingRank && !hasMoved) {
      return targetPiece === null && isPathClear(from, to, boardState)
    }

    return false
  }

  // Diagonal capture (must capture opponent piece)
  if (colDiff === 1 && expectedRowDiff === 1) {
    return (
      targetPiece !== null && targetPiece !== undefined && targetPiece.color !== piece.color // Must capture opponent
    )
  }

  return false
}

/**
 * Validate a king move
 * @param piece The king piece
 * @param from Starting position
 * @param to Ending position
 * @param boardState Current board state
 * @param moveHistory Move history for castling
 * @returns true if valid king move
 */
export function isValidKingMove(
  piece: Piece,
  from: SquarePosition,
  to: SquarePosition,
  boardState: BoardState,
  moveHistory?: MoveHistory
): boolean {
  const rowDiff = Math.abs(to.row - from.row)
  const colDiff = Math.abs(to.col - from.col)

  // Normal king move: one square in any direction
  if (rowDiff <= 1 && colDiff <= 1 && (rowDiff > 0 || colDiff > 0)) {
    return true
  }

  // Castling: king moves 2 squares horizontally toward rook
  if (
    rowDiff === 0 &&
    colDiff === 2 &&
    moveHistory &&
    !moveHistory.some(move => move.from === positionToNotation(from.row, from.col))
  ) {
    // Determine which side (kingside or queenside)
    const isKingside = to.col > from.col
    const rookCol = isKingside ? 7 : 0
    const rookSquare = positionToNotation(from.row, rookCol)
    const rook = boardState.get(rookSquare)

    // Check if rook exists and hasn't moved
    if (
      rook &&
      rook.type === 'rook' &&
      rook.color === piece.color &&
      !moveHistory.some(move => move.from === rookSquare)
    ) {
      // Check if path is clear
      const squaresBetween = getSquaresBetween(from, to)
      for (const square of squaresBetween) {
        const notation = positionToNotation(square.row, square.col)
        if (boardState.get(notation) !== null) {
          return false
        }
      }
      return true
    }
  }

  return false
}

/**
 * Main validation function that routes to piece-specific validators
 * @param piece The piece to move
 * @param from Starting square notation
 * @param to Ending square notation
 * @param boardState Current board state
 * @param moveHistory Optional move history for special moves
 * @returns true if the move is valid
 */
export function isValidMove(
  piece: Piece,
  from: SquareNotation,
  to: SquareNotation,
  boardState: BoardState,
  moveHistory?: MoveHistory
): boolean {
  // Same square is valid (no-op)
  if (from === to) {
    return true
  }

  const fromPos = notationToPosition(from)
  const toPos = notationToPosition(to)
  const targetPiece = boardState.get(to)

  // Can't capture own pieces
  if (targetPiece && targetPiece.color === piece.color) {
    return false
  }

  // Route to piece-specific validator
  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(piece, fromPos, toPos, boardState, moveHistory)
    case 'rook':
      return isValidRookMove(fromPos, toPos, boardState)
    case 'bishop':
      return isValidBishopMove(fromPos, toPos, boardState)
    case 'knight':
      return isValidKnightMove(fromPos, toPos)
    case 'queen':
      return isValidQueenMove(fromPos, toPos, boardState)
    case 'king':
      return isValidKingMove(piece, fromPos, toPos, boardState, moveHistory)
    default:
      return false
  }
}

/**
 * Get all valid squares for a piece from its current position
 * @param piece The piece to get moves for
 * @param from Starting square notation
 * @param boardState Current board state
 * @param moveHistory Optional move history for special moves
 * @returns Array of square notations that are valid moves
 */
export function getValidMoves(
  piece: Piece,
  from: SquareNotation,
  boardState: BoardState,
  moveHistory?: MoveHistory
): SquareNotation[] {
  const validSquares: SquareNotation[] = []

  // Check all 64 squares
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const to = positionToNotation(row, col)
      if (isValidMove(piece, from, to, boardState, moveHistory)) {
        validSquares.push(to)
      }
    }
  }

  return validSquares
}
