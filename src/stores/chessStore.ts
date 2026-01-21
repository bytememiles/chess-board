import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { BoardState, ClickEvent, Piece, SquareNotation, SquarePosition } from '@/types/chess'
import { positionToNotation } from '@/utils/chessNotation'
import { getInitialBoardState } from '@/utils/pieceHelpers'

export const useChessStore = defineStore('chess', () => {
  // State
  const clickHistory = ref<ClickEvent[]>([])
  const highlightedSquares = ref<Set<SquareNotation>>(new Set())
  const boardState = ref<BoardState>(new Map())
  const draggingPiece = ref<{ piece: Piece; from: SquareNotation } | null>(null)
  const currentDragOverSquare = ref<SquareNotation | null>(null)
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
    boardState.value = getInitialBoardState()
    draggingPiece.value = null
  }

  // Board state management
  function getPiece(square: SquareNotation): Piece | null {
    return boardState.value.get(square) ?? null
  }

  function setPiece(square: SquareNotation, piece: Piece | null): void {
    boardState.value.set(square, piece)
    // Reassign to trigger reactivity
    boardState.value = new Map(boardState.value)
  }

  function movePiece(from: SquareNotation, to: SquareNotation): void {
    const piece = boardState.value.get(from)
    if (piece) {
      // Create a new Map with the updated state to ensure reactivity
      const newBoardState = new Map(boardState.value)
      newBoardState.set(to, piece)
      newBoardState.set(from, null)
      boardState.value = newBoardState
    }
  }

  function initializeBoard(): void {
    boardState.value = getInitialBoardState()
  }

  return {
    // State
    clickHistory,
    highlightedSquares,
    boardState,
    draggingPiece,
    currentDragOverSquare,

    // Getters
    totalClicks,
    uniqueSquares,
    clickHistoryList,

    // Actions
    recordClick,
    toggleHighlight,
    isHighlighted,
    clearAll,

    // Board state actions
    getPiece,
    setPiece,
    movePiece,
    initializeBoard,
  }
})
