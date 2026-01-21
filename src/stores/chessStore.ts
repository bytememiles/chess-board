import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { ClickEvent, SquareNotation, SquarePosition } from '@/types/chess'
import { positionToNotation } from '@/utils/chessNotation'

export const useChessStore = defineStore('chess', () => {
  // State
  const clickHistory = ref<ClickEvent[]>([])
  const highlightedSquares = ref<Set<SquareNotation>>(new Set())
  let clickSequenceCounter = 0

  // Getters
  const totalClicks = computed(() => clickHistory.value.length)

  const uniqueSquares = computed(() => {
    const unique = new Set(clickHistory.value.map(click => click.square))
    return unique.size
  })

  const clickHistoryList = computed(() => [...clickHistory.value])

  // Actions
  function recordClick(position: SquarePosition) {
    const square = positionToNotation(position.row, position.col)
    const timestamp = Date.now()
    clickSequenceCounter++

    const clickEvent: ClickEvent = {
      id: timestamp + clickSequenceCounter, // Unique ID
      square,
      position,
      timestamp,
      sequence: clickSequenceCounter,
    }

    clickHistory.value.push(clickEvent)
  }

  function toggleHighlight(square: SquareNotation) {
    if (highlightedSquares.value.has(square)) {
      highlightedSquares.value.delete(square)
    } else {
      highlightedSquares.value.add(square)
    }
  }

  function isHighlighted(square: SquareNotation): boolean {
    return highlightedSquares.value.has(square)
  }

  function clearAll() {
    clickHistory.value = []
    highlightedSquares.value.clear()
    clickSequenceCounter = 0
  }

  return {
    // State
    clickHistory,
    highlightedSquares,

    // Getters
    totalClicks,
    uniqueSquares,
    clickHistoryList,

    // Actions
    recordClick,
    toggleHighlight,
    isHighlighted,
    clearAll,
  }
})
