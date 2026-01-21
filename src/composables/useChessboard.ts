import { computed } from 'vue'

import { useChessStore } from '@/stores/chessStore'
import type { SquareNotation, SquarePosition } from '@/types/chess'
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

  return {
    handleSquareClick,
    isSquareHighlighted,
    stats,
  }
}
