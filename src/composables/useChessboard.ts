import { computed } from 'vue'

import { useChessStore } from '@/stores/chessStore'
import type { Piece, SquareNotation, SquarePosition } from '@/types/chess'
import { notationToPosition, positionToNotation } from '@/utils/chessNotation'
import { getValidMoves, isValidMove } from '@/utils/moveValidation'

/**
 * Composable for chessboard interaction logic
 */
export function useChessboard() {
  const store = useChessStore()

  /**
   * Handle square click
   * - Records the click event
   * - Toggles highlight state
   */
  function handleSquareClick(position: SquarePosition) {
    const square = positionToNotation(position.row, position.col)

    // Record the click
    store.recordClick(position)

    // Toggle highlight
    store.toggleHighlight(square)
  }

  /**
   * Check if a square is currently highlighted
   */
  function isSquareHighlighted(square: SquareNotation): boolean {
    return store.isHighlighted(square)
  }

  /**
   * Get click statistics
   */
  const stats = computed(() => ({
    total: store.totalClicks,
    unique: store.uniqueSquares,
  }))

  /**
   * Handle drag start - store the piece being dragged and calculate valid moves
   */
  function handleDragStart(position: SquarePosition) {
    const square = positionToNotation(position.row, position.col)
    const piece = store.getPiece(square)
    if (piece) {
      store.draggingPiece = { piece, from: square }
      // Calculate and store all valid moves for this piece
      const validMoves = getValidMoves(piece, square, store.boardState, store.moveHistory)
      store.setValidMoves(validMoves)
    }
  }

  /**
   * Handle drag over - allow drop on any square
   */
  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  /**
   * Handle drop - validate and move piece from source to target square
   */
  function handleDrop(position: SquarePosition) {
    const to = positionToNotation(position.row, position.col)
    const dragging = store.draggingPiece

    if (dragging) {
      const { piece, from } = dragging

      // Validate the move
      const isValid = isValidMove(piece, from, to, store.boardState, store.moveHistory)

      if (isValid && from !== to) {
        // Execute the move
        store.movePiece(from, to)

        // Handle castling: if king moves 2 squares horizontally, move the rook
        if (piece.type === 'king') {
          const fromPos = notationToPosition(from)
          const toPos = notationToPosition(to)
          const rowDiff = Math.abs(toPos.row - fromPos.row)
          const colDiff = Math.abs(toPos.col - fromPos.col)

          // Castling: king moves 2 squares horizontally
          if (rowDiff === 0 && colDiff === 2) {
            const isKingside = toPos.col > fromPos.col
            const rookCol = isKingside ? 7 : 0
            const rookFrom = positionToNotation(fromPos.row, rookCol)
            const rookTo = positionToNotation(
              fromPos.row,
              isKingside ? 5 : 3 // Rook moves to f1/f8 (kingside) or d1/d8 (queenside)
            )

            // Move the rook
            store.movePiece(rookFrom, rookTo)

            // Record rook move in history
            const rook = store.getPiece(rookTo)
            if (rook) {
              store.addMove({
                piece: rook,
                from: rookFrom,
                to: rookTo,
                timestamp: Date.now(),
              })
            }
          }
        }

        // Record move in history
        store.addMove({
          piece,
          from,
          to,
          timestamp: Date.now(),
        })
      }

      // Clear dragging state and valid moves
      store.draggingPiece = null
      store.clearValidMoves()
    }
  }

  /**
   * Handle drag end - cleanup dragging state
   */
  function handleDragEnd() {
    store.draggingPiece = null
    store.clearValidMoves()
  }

  /**
   * Get piece at a specific position (reactive)
   */
  function getPieceAt(position: SquarePosition): Piece | null {
    // Access boardState to create reactive dependency
    // In Pinia, refs are auto-unwrapped, so we access it directly
    void store.boardState // Access to create reactive dependency
    const square = positionToNotation(position.row, position.col)
    return store.getPiece(square)
  }

  return {
    handleSquareClick,
    isSquareHighlighted,
    stats,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    getPieceAt,
  }
}
