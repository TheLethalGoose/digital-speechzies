<template>
  <div class="bubble-row" :class="props.from">
    <div class="bubble text" :class="props.from">
      <p :class="{ bold: bold }">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
  from?: 'me' | 'other',
  bold?: boolean
}
const props = withDefaults(defineProps<Props>(), { from: 'me' })
</script>

<style src="@/styles/bubbles.css"/>

<style scoped>

.bold {
  font-weight: bold;
}

.bubble.text p {
  display: block;                  
  word-wrap: break-word; 
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
  white-space: pre-wrap;
  text-align: justify;
  text-justify: inter-word;
}
</style>