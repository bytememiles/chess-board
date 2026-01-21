<template>
  <div class="chessboard-container">
    <div class="chessboard" :style="boardStyle">
      <div
        v-for="square in squares"
        :key="`${square.row}-${square.col}`"
        :class="[
          'square',
          isLightSquare(square.row, square.col) ? 'square-light' : 'square-dark',
          {
            'square-highlighted': isSquareHighlighted(square.row, square.col),
            'square-hover': true,
          },
        ]"
        @click="handleClick(square)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useChessboard } from '@/composables/useChessboard'
import type { SquarePosition } from '@/types/chess'
import { getAllSquares, isLightSquare } from '@/utils/boardHelpers'
import { positionToNotation } from '@/utils/chessNotation'

const props = defineProps<{
  size?: number // Optional explicit size (for responsive calculations)
}>()

const { handleSquareClick, isSquareHighlighted: checkHighlighted } = useChessboard()

const squares = getAllSquares()

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
</script>

<style scoped>
.chessboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chessboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 720px;
  min-width: 280px;
  border: 2px solid #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.square {
  aspect-ratio: 1 / 1;
  transition:
    background-color 160ms ease,
    outline 160ms ease;
  cursor: pointer;
  position: relative;
}

.square-light {
  background-color: #f0d9b5;
}

.square-dark {
  background-color: #b58863;
}

.square-hover:hover {
  opacity: 0.8;
}

.square-highlighted {
  outline: 3px solid #3b82f6;
  outline-offset: -3px;
  background-color: rgba(59, 130, 246, 0.2) !important;
}

@media (max-width: 767px) {
  .chessboard {
    max-width: 520px;
  }
}
</style>
