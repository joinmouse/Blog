<template>
  <div class="steps">
    <slot />
  </div>
</template>

<style scoped>
.steps {
  margin: 1.4em 0;
  padding-left: 28px;
  position: relative;
  counter-reset: step;
}

.steps::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.steps :deep(> *) {
  position: relative;
  padding-left: 16px;
  margin-bottom: 1.2em;
}

.steps :deep(> *::before) {
  counter-increment: step;
  content: counter(step);
  position: absolute;
  left: -28px;
  top: 1px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
</style>
