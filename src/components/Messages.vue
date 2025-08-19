<script setup lang="ts">
import TextBubble from './bubbles/TextBubble.vue'
import AudioBubble from './bubbles/AudioBubble.vue'
import type { Message } from '@/types/messages'

const props = defineProps<{
  messages: Message[]
}>()
</script>

<template>
  <div>
    <div v-for="(msg, idx) in props.messages" :key="idx">
      <TextBubble
        v-if="msg.type === 'text'"
        :text="msg.text"
        :from="msg.from"
      />
      <AudioBubble
        v-else-if="msg.type === 'audio'"
        :src="msg.src"
        :from="msg.from"
      />
    </div>
  </div>
</template>
