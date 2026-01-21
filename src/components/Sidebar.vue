<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Click History</h2>
      <div class="sidebar-stats">
        <span class="stat-item">Clicks: {{ stats.total }}</span>
        <span class="stat-item">Unique: {{ stats.unique }}</span>
      </div>
      <button class="clear-button" :disabled="stats.total === 0" @click="handleClear">Clear</button>
    </div>

    <div class="sidebar-content">
      <div v-if="clickHistory.length === 0" class="empty-state">No squares clicked yet</div>

      <ul v-else class="click-list">
        <li v-for="click in clickHistory" :key="click.id" class="click-item">
          <span class="click-sequence">#{{ click.sequence }}</span>
          <span class="click-square">{{ click.square }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useChessboard } from '@/composables/useChessboard'
import { useChessStore } from '@/stores/chessStore'

const store = useChessStore()
const { stats } = useChessboard()

const clickHistory = computed(() => store.clickHistoryList)

function handleClear() {
  store.clearAll()
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #111827;
}

.sidebar-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #6b7280;
}

.stat-item {
  font-weight: 500;
}

.clear-button {
  width: 100%;
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.clear-button:hover:not(:disabled) {
  background-color: #dc2626;
}

.clear-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

.click-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.click-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 4px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  transition: background-color 150ms ease;
}

.click-item:hover {
  background-color: #f3f4f6;
}

.click-sequence {
  font-weight: 600;
  color: #6b7280;
  min-width: 36px;
}

.click-square {
  font-weight: 500;
  color: #111827;
  font-family: 'Courier New', monospace;
}
</style>
