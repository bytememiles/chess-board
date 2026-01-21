import { computed } from 'vue'

import { useChessStore } from '@/stores/chessStore'
import type { Piece, SquareNotation, SquarePosition } from '@/types/chess'
import { positionToNotation } from '@/utils/chessNotation'

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
   * Handle drag start - store the piece being dragged
   */
  function handleDragStart(position: SquarePosition) {
    const square = positionToNotation(position.row, position.col)
    const piece = store.getPiece(square)
    if (piece) {
      store.draggingPiece = { piece, from: square }
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
   * Handle drop - move piece from source to target square
   */
  function handleDrop(position: SquarePosition) {
    const to = positionToNotation(position.row, position.col)
    const dragging = store.draggingPiece

    if (dragging) {
      const { from } = dragging

      // Don't move if dropping on the same square
      if (from !== to) {
        // Check if target square is occupied
        const targetPiece = store.getPiece(to)
        if (targetPiece !== null) {
          // Invalid drop - target square is occupied
          // Don't move the piece, just clear dragging state
          store.draggingPiece = null
          return
        }

        // Move the piece immediately (target is empty)
        store.movePiece(from, to)
      }

      // Clear dragging state
      store.draggingPiece = null
    }
  }

  /**
   * Handle drag end - cleanup dragging state
   */
  function handleDragEnd() {
    store.draggingPiece = null
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
