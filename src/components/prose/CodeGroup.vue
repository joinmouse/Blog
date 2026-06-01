<script setup lang="ts">
import { ref, useSlots } from 'vue';

const slots = useSlots();
const tabs = ref<string[]>([]);
const activeTab = ref('');

// Extract tab names from named slots
const slotNames = Object.keys(slots).filter((k) => k !== 'default');
tabs.value = slotNames;
if (slotNames.length > 0) activeTab.value = slotNames[0];
</script>

<template>
  <div class="code-group">
    <div class="code-group-tabs" v-if="tabs.length > 1">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div class="code-group-panels">
      <div
        v-for="tab in tabs"
        :key="tab"
        v-show="activeTab === tab"
        class="code-group-panel"
      >
        <slot :name="tab" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-group {
  margin: 1.4em 0;
  border-radius: 8px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.code-group-tabs {
  display: flex;
  background: var(--bg-soft);
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--text-soft);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tab-btn:hover {
  color: var(--text);
}
.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  background: var(--bg);
}

.code-group-panel :deep(pre) {
  margin: 0;
  border: none;
  border-radius: 0;
}
</style>
