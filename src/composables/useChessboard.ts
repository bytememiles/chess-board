import { computed } from 'vue'

import { useChessStore } from '@/stores/chessStore'
import type { Piece, SquarePosition } from '@/types/chess'
import { notationToPosition, positionToNotation } from '@/utils/chessNotation'
import { getValidMoves, isValidMove } from '@/utils/moveValidation'

export function useChessboard() {
  const store = useChessStore()

  function handleSquareClick(position: SquarePosition) {
    store.recordClick(position)
  }
  const stats = computed(() => ({
    total: store.totalClicks,
    unique: store.uniqueSquares,
  }))

  function handleDragStart(position: SquarePosition) {
    const square = positionToNotation(position.row, position.col)
    const piece = store.getPiece(square)
    if (piece) {
      if (piece.color !== store.currentTurn) {
        return
      }
      store.draggingPiece = { piece, from: square }
      const validMoves = getValidMoves(piece, square, store.boardState, store.moveHistory)
      store.setValidMoves(validMoves)
    }
  }
  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  function handleDrop(position: SquarePosition) {
    const to = positionToNotation(position.row, position.col)
    const dragging = store.draggingPiece

    if (dragging) {
      const { piece, from } = dragging

      if (piece.color !== store.currentTurn) {
        store.draggingPiece = null
        store.clearValidMoves()
        return
      }

      const isValid = isValidMove(piece, from, to, store.boardState, store.moveHistory)

      if (isValid && from !== to) {
        store.movePiece(from, to)

        if (piece.type === 'king') {
          const fromPos = notationToPosition(from)
          const toPos = notationToPosition(to)
          const rowDiff = Math.abs(toPos.row - fromPos.row)
          const colDiff = Math.abs(toPos.col - fromPos.col)

          if (rowDiff === 0 && colDiff === 2) {
            const isKingside = toPos.col > fromPos.col
            const rookCol = isKingside ? 7 : 0
            const rookFrom = positionToNotation(fromPos.row, rookCol)
            const rookTo = positionToNotation(fromPos.row, isKingside ? 5 : 3)

            store.movePiece(rookFrom, rookTo)

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

        store.addMove({
          piece,
          from,
          to,
          timestamp: Date.now(),
        })
      }

      store.draggingPiece = null
      store.clearValidMoves()
    }
  }

  function handleDragEnd() {
    store.draggingPiece = null
    store.clearValidMoves()
  }

  function getPieceAt(position: SquarePosition): Piece | null {
    void store.boardState
    const square = positionToNotation(position.row, position.col)
    return store.getPiece(square)
  }

  return {
    handleSquareClick,
    stats,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    getPieceAt,
  }
}
