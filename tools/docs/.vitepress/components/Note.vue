<template>
  <div class="note-container">
    <div :class="['note', `type-${type}`]">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ type: 'info' | 'tip' | 'warning' | 'danger' }>()
</script>

<style>
.note-container {
  margin: 16px 0;
  display: flex;
}
.note {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 16px;
  line-height: 24px;
  font-size: var(--vp-custom-block-font-size);
}
.note.type-info {
  border-color: var(--vp-custom-block-info-border);
  color: var(--vp-custom-block-info-text);
  background-color: var(--vp-custom-block-info-bg);
}
.note.type-tip {
  border-color: var(--vp-custom-block-tip-border);
  color: var(--vp-custom-block-tip-text);
  background-color: var(--vp-custom-block-tip-bg);
}
.note.type-warning {
  border-color: var(--vp-custom-block-warning-border);
  color: var(--vp-custom-block-warning-text);
  background-color: var(--vp-custom-block-warning-bg);
}
.note.type-danger {
  border-color: var(--vp-custom-block-danger-border);
  color: var(--vp-custom-block-danger-text);
  background-color: var(--vp-custom-block-danger-bg);
}
</style>
