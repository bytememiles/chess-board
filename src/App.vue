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
  height: 100vh;
  padding: 16px 0 16px 16px;
  background-color: #f3f4f6;
  overflow: hidden;
}

.app-container {
  max-width: 100%;
  margin: 0;
  display: flex;
  gap: 24px;
  align-items: center;
  height: calc(100vh - 32px);
  padding-right: 0;
  overflow: hidden;
}

.board-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

.sidebar-section {
  flex: 0 0 320px;
  min-width: 280px;
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 767px) {
  .app {
    padding: 16px;
  }

  .app-container {
    flex-direction: column;
    gap: 16px;
    height: auto;
    min-height: calc(100vh - 32px);
  }

  .board-section {
    flex: 1;
    width: 100%;
  }

  .sidebar-section {
    flex: 1;
    width: calc(100vw - 32px);
    min-height: 300px;
    max-width: none;
  }
}

@media (min-width: 768px) {
  .app {
    padding: 24px 0 24px 24px;
    height: 100vh;
  }

  .app-container {
    height: calc(100vh - 48px);
  }

  .sidebar-section {
    height: calc(100vh - 48px);
  }
}
</style>
