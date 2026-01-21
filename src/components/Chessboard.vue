<template>
  <div class="chessboard-wrapper">
    <div class="chessboard-container">
      <!-- Rank labels (1-8) on the left -->
      <div class="rank-labels">
        <div v-for="rank in ranks" :key="`rank-${rank}`" class="rank-label">
          {{ rank }}
        </div>
      </div>

      <!-- Main board with squares -->
      <div class="chessboard" :style="boardStyle">
        <Square
          v-for="square in squares"
          :key="`${square.row}-${square.col}`"
          :position="square"
          :is-highlighted="isSquareHighlighted(square.row, square.col)"
          :piece="getPieceForSquare(square)"
          :show-coordinates="false"
          @click="handleClick"
          @drop="handleDrop"
          @dragstart="handleDragStart"
        />
      </div>

      <!-- File labels (A-H) on the bottom -->
      <div class="file-labels">
        <div v-for="file in files" :key="`file-${file}`" class="file-label">
          {{ file.toUpperCase() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useChessboard } from '@/composables/useChessboard'
import { useChessStore } from '@/stores/chessStore'
import type { Piece, SquarePosition } from '@/types/chess'
import { getAllSquares } from '@/utils/boardHelpers'
import { positionToNotation } from '@/utils/chessNotation'

import Square from './Square.vue'

const props = defineProps<{
  size?: number // Optional explicit size (for responsive calculations)
}>()

const store = useChessStore()
const {
  handleSquareClick,
  isSquareHighlighted: checkHighlighted,
  handleDragStart: handleDragStartLogic,
  handleDrop: handleDropLogic,
  getPieceAt,
} = useChessboard()

// Initialize board on mount
onMounted(() => {
  store.initializeBoard()
})

const squares = getAllSquares()

// Reactive function to get piece for a square
// Accessing store.boardState creates a reactive dependency
function getPieceForSquare(square: SquarePosition): Piece | null {
  // Access boardState to create reactive dependency
  store.boardState.value
  return getPieceAt(square)
}

// Rank labels (8 to 1, top to bottom)
const ranks = computed(() => [8, 7, 6, 5, 4, 3, 2, 1])

// File labels (a to h, left to right)
const files = computed(() => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])

const boardStyle = computed(() => {
  if (props.size) {
    return {
      width: `${props.size}px`,
      height: `${props.size}px`,
    }
  }
  return {}
})

function isSquareHighlighted(row: number, col: number): boolean {
  const notation = positionToNotation(row, col)
  return checkHighlighted(notation)
}

function handleClick(square: SquarePosition) {
  handleSquareClick(square)
}

function handleDragStart(square: SquarePosition) {
  handleDragStartLogic(square)
}

function handleDrop(square: SquarePosition) {
  handleDropLogic(square)
}
</script>

<style scoped>
.chessboard-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.chessboard-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto;
  gap: 0;
  position: relative;
}

.rank-labels {
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  align-items: center;
  padding-right: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  user-select: none;
}

.rank-label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 0;
}

.file-labels {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-column: 2;
  align-items: center;
  padding-top: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  user-select: none;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.chessboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 720px;
  min-width: 280px;
  border: 2px solid #1f2937;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  background-color: #1f2937;
  position: relative;
}

@media (max-width: 767px) {
  .chessboard {
    max-width: 520px;
  }

  .rank-labels,
  .file-labels {
    font-size: 0.75rem;
  }

  .rank-labels {
    padding-right: 6px;
  }

  .file-labels {
    padding-top: 6px;
  }
}

@media (max-width: 480px) {
  .rank-labels,
  .file-labels {
    font-size: 0.65rem;
  }

  .rank-labels {
    padding-right: 4px;
  }

  .file-labels {
    padding-top: 4px;
  }
}
</style>
