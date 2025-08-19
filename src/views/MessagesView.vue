<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import rawMessages from '@/data/messages.json'
import type { MessagesByPage, Message } from '@/types/messages'
import Messages from '@/components/Messages.vue'

const route = useRoute()
const allMessages = rawMessages as MessagesByPage

const messages = computed<Message[]>(() => {
  const page = route.params.page as keyof MessagesByPage
  return allMessages[page] ?? []
})
</script>

<template>
  <Messages :messages="messages" />
</template>
