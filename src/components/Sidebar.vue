<template>
  <div class="sidebar">
    <!-- Move History Table Section -->
    <div class="moves-list-container">
      <div class="moves-list">
        <div v-for="(movePair, index) in formattedMoves" :key="index" class="ml-row">
          <div class="num">{{ movePair.moveNumber }}.</div>
          <div class="ml-moves-cnt">
            <!-- White move -->
            <div
              :class="['move', 'pgnmove', { active: isMoveActive(index, 'white') }]"
              @click="handleMoveClick(index, 'white')"
            >
              <div v-if="movePair.white">
                <span v-if="movePair.white.pieceSymbol" class="fig">{{
                  movePair.white.pieceSymbol
                }}</span>
                {{ movePair.white.notation }}
              </div>
            </div>
            <!-- Black move -->
            <div
              :class="['move', 'pgnmove', { active: isMoveActive(index, 'black') }]"
              @click="handleMoveClick(index, 'black')"
            >
              <div v-if="movePair.black">
                <span v-if="movePair.black.pieceSymbol" class="fig">{{
                  movePair.black.pieceSymbol
                }}</span>
                {{ movePair.black.notation }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="formattedMoves.length === 0" class="empty-state">No moves yet</div>
      </div>
    </div>

    <!-- Control Panel Section -->
    <div class="game-controller">
      <div class="control-row">
        <!-- Group 1: Navigation buttons -->
        <div class="control-group">
          <!-- Go to beginning -->
          <button class="btn-control" @click="goToBeginning">
            <svg
              class="svg-inline--fa fa-backward-fast"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="backward-fast"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7 288 416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7 64 416c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 96C0 78.3 14.3 64 32 64s32 14.3 32 32l0 118.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96l0 118.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96l0 320c0 12.4-7.2 23.7-18.4 29z"
              ></path>
            </svg>
          </button>
          <!-- Step backward -->
          <button class="btn-control" @click="stepBackward">
            <svg
              class="svg-inline--fa fa-backward-step"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="backward-step"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241 64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-145 11.5 9.6 192 160z"
              ></path>
            </svg>
          </button>
          <!-- Step forward -->
          <button class="btn-control" @click="stepForward">
            <svg
              class="svg-inline--fa fa-forward-step"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="forward-step"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241l0-145c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-145-11.5 9.6-192 160z"
              ></path>
            </svg>
          </button>
          <!-- Go to end -->
          <button class="btn-control" @click="goToEnd">
            <svg
              class="svg-inline--fa fa-forward-fast"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="forward-fast"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7 224 416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7 448 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 118.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96l0 118.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96L0 416c0 12.4 7.2 23.7 18.4 29z"
              ></path>
            </svg>
          </button>
        </div>
        <!-- Group 2: Play again -->
        <div class="control-group">
          <button class="btn-control" @click="playAgain">
            <svg
              class="svg-inline--fa fa-rotate-right"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="rotate-right"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"
              ></path>
            </svg>
          </button>
        </div>
        <!-- Group 3: Download -->
        <div class="control-group">
          <button class="btn-control" @click="downloadPGN">
            <svg
              class="svg-inline--fa fa-download"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="download"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useChessStore } from '@/stores/chessStore'
import { getInitialBoardState, getPieceSymbol } from '@/utils/pieceHelpers'

const store = useChessStore()

// Format moves into pairs (white/black) for display
const formattedMoves = computed(() => {
  const pairs: Array<{
    moveNumber: number
    white: { notation: string; pieceSymbol: string; moveIndex: number } | null
    black: { notation: string; pieceSymbol: string; moveIndex: number } | null
  }> = []

  let tempBoardState = getInitialBoardState()

  for (let i = 0; i < store.moveHistory.length; i += 2) {
    const whiteMove = store.moveHistory[i]
    const blackMove = store.moveHistory[i + 1] || null
    const moveNumber = Math.floor(i / 2) + 1

    let whiteFormatted = null
    if (whiteMove) {
      const pieceSymbol = getPieceSymbol(whiteMove.piece)
      const targetPiece = tempBoardState.get(whiteMove.to) ?? null
      const isCapture = targetPiece !== null && targetPiece.color !== whiteMove.piece.color

      let notation: string
      if (whiteMove.piece.type === 'pawn') {
        notation = isCapture ? `${whiteMove.from.charAt(0)}x${whiteMove.to}` : whiteMove.to
      } else {
        notation = isCapture ? `x${whiteMove.to}` : whiteMove.to
      }

      const piece = tempBoardState.get(whiteMove.from)
      if (piece) {
        const newBoardState = new Map(tempBoardState)
        newBoardState.set(whiteMove.to, piece)
        newBoardState.set(whiteMove.from, null)
        tempBoardState = newBoardState
      }

      whiteFormatted = {
        notation,
        pieceSymbol: whiteMove.piece.type === 'pawn' ? '' : pieceSymbol,
        moveIndex: i,
      }
    }

    let blackFormatted = null
    if (blackMove) {
      const pieceSymbol = getPieceSymbol(blackMove.piece)
      const targetPiece = tempBoardState.get(blackMove.to)
      const isCapture =
        targetPiece !== null &&
        targetPiece !== undefined &&
        targetPiece.color !== blackMove.piece.color

      let notation: string
      if (blackMove.piece.type === 'pawn') {
        notation = isCapture ? `${blackMove.from.charAt(0)}x${blackMove.to}` : blackMove.to
      } else {
        notation = isCapture ? `x${blackMove.to}` : blackMove.to
      }

      const piece = tempBoardState.get(blackMove.from)
      if (piece) {
        const newBoardState = new Map(tempBoardState)
        newBoardState.set(blackMove.to, piece)
        newBoardState.set(blackMove.from, null)
        tempBoardState = newBoardState
      }

      blackFormatted = {
        notation,
        pieceSymbol: blackMove.piece.type === 'pawn' ? '' : pieceSymbol,
        moveIndex: i + 1,
      }
    }

    pairs.push({
      moveNumber,
      white: whiteFormatted,
      black: blackFormatted,
    })
  }

  return pairs
})

function isMoveActive(movePairIndex: number, color: 'white' | 'black'): boolean {
  const moveIndex = color === 'white' ? movePairIndex * 2 : movePairIndex * 2 + 1
  return store.currentMoveIndex === moveIndex
}

function handleMoveClick(movePairIndex: number, color: 'white' | 'black'): void {
  const moveIndex = color === 'white' ? movePairIndex * 2 : movePairIndex * 2 + 1

  // Check if the move exists
  if (moveIndex >= 0 && moveIndex < store.moveHistory.length) {
    store.restoreBoardToMove(moveIndex)
  }
}

function goToBeginning(): void {
  if (store.moveHistory.length > 0) {
    store.restoreBoardToMove(0)
  } else {
    store.restoreBoardToMove(-1)
  }
}

function goToEnd(): void {
  store.restoreBoardToMove(-1)
}

function stepBackward(): void {
  if (store.currentMoveIndex > 0) {
    store.restoreBoardToMove(store.currentMoveIndex - 1)
  } else if (store.currentMoveIndex === -1 && store.moveHistory.length > 0) {
    store.restoreBoardToMove(store.moveHistory.length - 1)
  }
}

function stepForward(): void {
  if (store.currentMoveIndex < store.moveHistory.length - 1) {
    store.restoreBoardToMove(store.currentMoveIndex + 1)
  } else if (store.currentMoveIndex === store.moveHistory.length - 1) {
    store.restoreBoardToMove(-1)
  }
}

function downloadPGN(): void {
  let pgn = ''
  for (let i = 0; i < formattedMoves.value.length; i++) {
    const pair = formattedMoves.value[i]
    pgn += `${pair.moveNumber}. `
    if (pair.white) {
      pgn += `${pair.white.pieceSymbol}${pair.white.notation} `
    }
    if (pair.black) {
      pgn += `${pair.black.pieceSymbol}${pair.black.notation} `
    }
  }
  const blob = new Blob([pgn], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'game.pgn'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function playAgain(): void {
  store.clearAll()
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

/* Move History Table */
.moves-list-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  max-height: 100%;
  padding-top: 12px;
}

.moves-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

.ml-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 16px;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: hidden;
  background-color: #ffffff;
}

.ml-row:nth-child(even) {
  background-color: #f9fafb;
}

.ml-row:last-child {
  border-bottom: none;
}

.num {
  width: 25%;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0;
}

.ml-moves-cnt {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.move {
  width: 50%;
  padding: 4px 8px;
  font-size: 16px;
  color: #111827;
  cursor: pointer;
  user-select: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  background-color: transparent;
  border: none;
  text-align: left;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.2s;
}

.move:hover {
  color: #111827;
}

.move.active {
  background-color: transparent;
  color: #d97706;
  font-weight: 600;
}

.move.active .fig {
  color: #d97706;
}

.move.active:hover {
  color: #b45309;
}

.fig {
  font-weight: 600;
  margin-right: 2px;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

/* Control Panel */
.game-controller {
  padding: 8px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.control-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.control-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.btn-control {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;
}

.btn-control:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.btn-control svg {
  width: 16px;
  height: 16px;
}

/* Scrollbar styling - inside table only */
.moves-list-container::-webkit-scrollbar {
  width: 8px;
}

.moves-list-container::-webkit-scrollbar-track {
  background: #f9fafb;
}

.moves-list-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.moves-list-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
