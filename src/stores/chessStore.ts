import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useLocalStorage } from '@/composables/useLocalStorage'
import type {
  BoardState,
  ClickEvent,
  Move,
  MoveHistory,
  Piece,
  PieceColor,
  SquareNotation,
  SquarePosition,
} from '@/types/chess'
import { positionToNotation } from '@/utils/chessNotation'
import { getInitialBoardState } from '@/utils/pieceHelpers'

export const useChessStore = defineStore('chess', () => {
  const clickHistory = ref<ClickEvent[]>([])
  const highlightedSquares = ref<Set<SquareNotation>>(new Set())
  const boardState = ref<BoardState>(new Map())
  const draggingPiece = ref<{ piece: Piece; from: SquareNotation } | null>(null)
  const currentDragOverSquare = ref<SquareNotation | null>(null)
  const moveHistory = useLocalStorage<MoveHistory>('chess-move-history', [])
  const validMoves = ref<Set<SquareNotation>>(new Set())
  const lastMove = ref<Move | null>(null)
  const lastMoveSquares = ref<{ from: SquareNotation; to: SquareNotation } | null>(null)
  const currentMoveIndex = ref<number>(-1)
  const currentTurn = ref<PieceColor>('white')
  let clickSequenceCounter = 0

  boardState.value = getInitialBoardState()

  const totalClicks = computed(() => clickHistory.value.length)

  const uniqueSquares = computed(() => {
    const unique = new Set(clickHistory.value.map(click => click.square))
    return unique.size
  })

  const clickHistoryList = computed(() => [...clickHistory.value])

  function recordClick(position: SquarePosition) {
    const square = positionToNotation(position.row, position.col)
    const timestamp = Date.now()
    clickSequenceCounter++

    const clickEvent: ClickEvent = {
      id: timestamp + clickSequenceCounter,
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
    moveHistory.value = []
    validMoves.value.clear()
    lastMove.value = null
    lastMoveSquares.value = null
    currentMoveIndex.value = -1
    currentTurn.value = 'white'
  }

  function getPiece(square: SquareNotation): Piece | null {
    return boardState.value.get(square) ?? null
  }

  function setPiece(square: SquareNotation, piece: Piece | null): void {
    boardState.value.set(square, piece)
    boardState.value = new Map(boardState.value)
  }

  function movePiece(from: SquareNotation, to: SquareNotation): void {
    const piece = boardState.value.get(from)
    if (piece) {
      const newBoardState = new Map(boardState.value)
      newBoardState.set(to, piece)
      newBoardState.set(from, null)
      boardState.value = newBoardState
    }
  }

  function initializeBoard(): void {
    boardState.value = getInitialBoardState()
    validMoves.value.clear()
    lastMove.value = null
    lastMoveSquares.value = null
    currentMoveIndex.value = -1
    currentTurn.value = 'white'

    if (moveHistory.value.length > 0) {
      restoreBoardToMove(-1)
    } else {
      moveHistory.value = []
    }
  }

  function addMove(move: Move): void {
    if (currentMoveIndex.value >= 0 && currentMoveIndex.value < moveHistory.value.length - 1) {
      moveHistory.value = moveHistory.value.slice(0, currentMoveIndex.value + 1)
    }

    moveHistory.value.push(move)
    lastMove.value = move
    lastMoveSquares.value = { from: move.from, to: move.to }
    currentMoveIndex.value = moveHistory.value.length - 1
    currentTurn.value = move.piece.color === 'white' ? 'black' : 'white'
  }

  function restoreBoardToMove(moveIndex: number): void {
    draggingPiece.value = null
    currentDragOverSquare.value = null
    validMoves.value.clear()
    boardState.value = getInitialBoardState()

    if (moveIndex < -1 || moveIndex >= moveHistory.value.length) {
      currentMoveIndex.value = -1
      if (moveHistory.value.length > 0) {
        const lastMoveInHistory = moveHistory.value[moveHistory.value.length - 1]
        lastMove.value = lastMoveInHistory
        lastMoveSquares.value = { from: lastMoveInHistory.from, to: lastMoveInHistory.to }
      } else {
        lastMove.value = null
        lastMoveSquares.value = null
      }
      return
    }

    if (moveIndex === -1) {
      moveIndex = moveHistory.value.length - 1
    }

    for (let i = 0; i <= moveIndex; i++) {
      const move = moveHistory.value[i]
      if (move) {
        const piece = boardState.value.get(move.from)
        if (piece) {
          const newBoardState = new Map(boardState.value)
          newBoardState.set(move.to, piece)
          newBoardState.set(move.from, null)
          boardState.value = newBoardState
        }
      }
    }

    currentMoveIndex.value = moveIndex
    if (moveIndex >= 0 && moveIndex < moveHistory.value.length) {
      const targetMove = moveHistory.value[moveIndex]
      lastMove.value = targetMove
      lastMoveSquares.value = { from: targetMove.from, to: targetMove.to }
      currentTurn.value = targetMove.piece.color === 'white' ? 'black' : 'white'
    } else {
      lastMove.value = null
      lastMoveSquares.value = null
      currentTurn.value = 'white'
    }
  }

  function hasPieceMoved(square: SquareNotation): boolean {
    return moveHistory.value.some(move => move.from === square)
  }

  function setValidMoves(squares: SquareNotation[]): void {
    validMoves.value = new Set(squares)
  }

  function clearValidMoves(): void {
    validMoves.value.clear()
  }

  return {
    clickHistory,
    highlightedSquares,
    boardState,
    draggingPiece,
    currentDragOverSquare,
    moveHistory,
    validMoves,
    lastMove,
    lastMoveSquares,
    currentMoveIndex,
    currentTurn,

    totalClicks,
    uniqueSquares,
    clickHistoryList,

    recordClick,
    toggleHighlight,
    isHighlighted,
    clearAll,

    getPiece,
    setPiece,
    movePiece,
    initializeBoard,

    addMove,
    hasPieceMoved,
    setValidMoves,
    clearValidMoves,
    restoreBoardToMove,
  }
})
