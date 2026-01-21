<template>
  <div
    :class="[
      'chess-piece',
      `piece-${piece.color}`,
      { 'piece-dragging': isDragging, 'piece-not-turn': !isMyTurn },
    ]"
    :draggable="canDrag"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <img :src="pieceImageSrc" :alt="pieceName" :draggable="false" class="piece-image" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Import all piece images for Vite to bundle them
import blackBishop from '@/assets/pieces/blackBishop.svg?url'
import blackKing from '@/assets/pieces/blackKing.svg?url'
import blackKnight from '@/assets/pieces/blackKnight.svg?url'
import blackPawn from '@/assets/pieces/blackPawn.svg?url'
import blackQueen from '@/assets/pieces/blackQueen.svg?url'
import blackRook from '@/assets/pieces/blackRook.svg?url'
import whiteBishop from '@/assets/pieces/whiteBishop.svg?url'
import whiteKing from '@/assets/pieces/whiteKing.svg?url'
import whiteKnight from '@/assets/pieces/whiteKnight.svg?url'
import whitePawn from '@/assets/pieces/whitePawn.svg?url'
import whiteQueen from '@/assets/pieces/whiteQueen.svg?url'
import whiteRook from '@/assets/pieces/whiteRook.svg?url'
import { useChessStore } from '@/stores/chessStore'
import type { Piece } from '@/types/chess'
import { getPieceName } from '@/utils/pieceHelpers'

const store = useChessStore()

const props = defineProps<{
  piece: Piece
  isDragging?: boolean
}>()

const emit = defineEmits<{
  dragstart: [event: DragEvent]
  dragend: [event: DragEvent]
}>()

// Piece image map
const pieceImages: Record<string, string> = {
  whiteKing,
  whiteQueen,
  whiteRook,
  whiteBishop,
  whiteKnight,
  whitePawn,
  blackKing,
  blackQueen,
  blackRook,
  blackBishop,
  blackKnight,
  blackPawn,
}

const pieceName = computed(() => getPieceName(props.piece))

const pieceImageSrc = computed(() => {
  const key = `${props.piece.color}${props.piece.type.charAt(0).toUpperCase() + props.piece.type.slice(1)}`
  return pieceImages[key] || ''
})

const isMyTurn = computed(() => {
  return props.piece.color === store.currentTurn
})

const canDrag = computed(() => {
  return isMyTurn.value
})

function handleDragStart(event: DragEvent) {
  if (!isMyTurn.value) {
    event.preventDefault()
    return
  }

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', '')
  }
  emit('dragstart', event)
}

function handleDragEnd(event: DragEvent) {
  emit('dragend', event)
}
</script>

<style scoped>
.chess-piece {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  pointer-events: all;
}

.chess-piece:active {
  cursor: grabbing;
}

.piece-not-turn {
  cursor: not-allowed;
}

.piece-not-turn:active {
  cursor: not-allowed;
}

.piece-dragging {
  opacity: 0.6;
  z-index: 1000;
}

.piece-image {
  width: 80%;
  height: 80%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.piece-white .piece-image {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.piece-black .piece-image {
  filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.2));
}
</style>
