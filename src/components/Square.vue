<template>
  <div
    :class="[
      'square',
      isLight ? 'square-light' : 'square-dark',
      {
        'square-highlighted': isHighlighted,
        'square-drag-over': isDragOver,
      },
    ]"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @dragend="handleDragEnd"
  >
    <ChessPiece
      v-if="piece"
      :piece="piece"
      :is-dragging="isDraggingFromHere"
      @dragstart="handlePieceDragStart"
      @dragend="handlePieceDragEnd"
    />
    <span v-if="showCoordinates" class="square-coordinate">{{ notation }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useChessStore } from '@/stores/chessStore'
import type { Piece, SquarePosition } from '@/types/chess'
import { isLightSquare } from '@/utils/boardHelpers'
import { positionToNotation } from '@/utils/chessNotation'

import ChessPiece from './ChessPiece.vue'

const props = defineProps<{
  position: SquarePosition
  isHighlighted: boolean
  piece: Piece | null
  showCoordinates?: boolean
}>()

const emit = defineEmits<{
  click: [position: SquarePosition]
  mouseenter: [position: SquarePosition]
  mouseleave: [position: SquarePosition]
  drop: [position: SquarePosition]
  dragstart: [position: SquarePosition]
}>()

const isDragging = ref(false)
const isDraggingFromHere = ref(false)
let dragLeaveTimeout: ReturnType<typeof setTimeout> | null = null

// Get store to check current drag over square
const store = useChessStore()

const notation = computed(() => positionToNotation(props.position.row, props.position.col))
const isLight = computed(() => isLightSquare(props.position.row, props.position.col))

// Computed to check if this square is the current drag over target
const isDragOver = computed(() => {
  return store.currentDragOverSquare === notation.value
})

function handleClick() {
  emit('click', props.position)
}

function handleMouseEnter() {
  emit('mouseenter', props.position)
}

function handleMouseLeave() {
  emit('mouseleave', props.position)
}

function handleDragOver(event: DragEvent) {
  // Only show overlay if there's actually a piece being dragged
  if (event.dataTransfer && event.dataTransfer.effectAllowed === 'move') {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'move'

    // Clear any pending drag leave timeout
    if (dragLeaveTimeout) {
      clearTimeout(dragLeaveTimeout)
      dragLeaveTimeout = null
    }

    // Set this square as the current drag over target
    store.currentDragOverSquare = notation.value
  }
}

function handleDragEnter(event: DragEvent) {
  // Only show overlay if there's actually a piece being dragged
  if (event.dataTransfer && event.dataTransfer.effectAllowed === 'move') {
    event.preventDefault()
    event.stopPropagation()

    // Clear any pending drag leave timeout
    if (dragLeaveTimeout) {
      clearTimeout(dragLeaveTimeout)
      dragLeaveTimeout = null
    }

    // Set this square as the current drag over target
    store.currentDragOverSquare = notation.value
  }
}

function handleDragLeave(event: DragEvent) {
  // Clear any pending timeout first
  if (dragLeaveTimeout) {
    clearTimeout(dragLeaveTimeout)
    dragLeaveTimeout = null
  }

  // Use a very short timeout to debounce - this prevents clearing when
  // dragleave fires due to moving between child elements
  dragLeaveTimeout = setTimeout(() => {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY

    // Only clear if we're actually outside the square bounds
    // Add a small margin to account for edge cases
    const margin = 2
    if (
      x < rect.left - margin ||
      x > rect.right + margin ||
      y < rect.top - margin ||
      y > rect.bottom + margin
    ) {
      // Only clear if this square is currently the drag over target
      if (store.currentDragOverSquare === notation.value) {
        store.currentDragOverSquare = null
      }
    }
    dragLeaveTimeout = null
  }, 0) // Use requestAnimationFrame timing (0ms) for immediate next frame
}

// Global dragend listener to clear drag-over state when drag ends anywhere
function handleGlobalDragEnd() {
  // Clear any pending timeout
  if (dragLeaveTimeout) {
    clearTimeout(dragLeaveTimeout)
    dragLeaveTimeout = null
  }

  store.currentDragOverSquare = null
  isDragging.value = false
  isDraggingFromHere.value = false
}

onMounted(() => {
  document.addEventListener('dragend', handleGlobalDragEnd)
})

onUnmounted(() => {
  document.removeEventListener('dragend', handleGlobalDragEnd)
  if (dragLeaveTimeout) {
    clearTimeout(dragLeaveTimeout)
  }
})

function handleDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()

  // Clear any pending timeout
  if (dragLeaveTimeout) {
    clearTimeout(dragLeaveTimeout)
    dragLeaveTimeout = null
  }

  store.currentDragOverSquare = null
  isDraggingFromHere.value = false
  emit('drop', props.position)
}

function handleDragEnd() {
  // Clear drag-over state when drag ends (whether successful or canceled)
  store.currentDragOverSquare = null
  isDragging.value = false
}

function handlePieceDragStart() {
  isDragging.value = true
  isDraggingFromHere.value = true
  emit('dragstart', props.position)
}

function handlePieceDragEnd() {
  // Don't clear isDraggingFromHere here - let it be cleared by drop or global dragend
  // This ensures the piece stays visible if drop was successful
  isDragging.value = false
  // Also clear drag-over when piece drag ends
  store.currentDragOverSquare = null
}
</script>

<style scoped>
.square {
  aspect-ratio: 1 / 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    box-shadow 150ms ease;
  user-select: none;
}

.square-light {
  background-color: #f0d9b5;
}

.square-dark {
  background-color: #b58863;
}

.square:hover {
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.4);
}

.square-highlighted {
  background-color: rgba(59, 130, 246, 0.3) !important;
  box-shadow: inset 0 0 0 3px #3b82f6;
}

.square-highlighted:hover {
  box-shadow: inset 0 0 0 3px #2563eb;
  background-color: rgba(59, 130, 246, 0.4) !important;
}

.square-drag-over {
  background-color: rgba(34, 197, 94, 0.3) !important;
  box-shadow: inset 0 0 0 2px #22c55e;
}

.square-coordinate {
  position: absolute;
  font-size: 0.65em;
  font-weight: 600;
  padding: 2px 4px;
  color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.square-dark .square-coordinate {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 767px) {
  .square-coordinate {
    font-size: 0.55em;
    padding: 1px 2px;
  }
}
</style>
