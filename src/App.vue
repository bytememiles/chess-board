<template>
  <div class="app">
    <div class="app-container">
      <div class="board-section">
        <Chessboard />
      </div>
      <div class="sidebar-section">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chessboard from '@/components/Chessboard.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 16px;
  background-color: #f3f4f6;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.board-section {
  flex: 0 0 65%;
  display: flex;
  justify-content: center;
}

.sidebar-section {
  flex: 0 0 35%;
  min-width: 0;
}

@media (max-width: 767px) {
  .app {
    padding: 16px;
  }

  .app-container {
    flex-direction: column;
    gap: 16px;
  }

  .board-section {
    flex: 1;
    width: 100%;
  }

  .sidebar-section {
    flex: 1;
    width: 100%;
    min-height: 300px;
  }
}

@media (min-width: 768px) {
  .app {
    padding: 24px;
  }

  .sidebar-section {
    max-height: calc(100vh - 48px);
  }
}
</style>
