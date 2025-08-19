<template>
  <div>
    <div class="bubble-row" :class="props.from">
      <div class="bubble audio" :class="props.from">
        <div class="audio-controls">
          <button class="play-btn" @click="togglePlay">
            <span v-if="!isPlaying">▶</span>
            <span v-else>❚❚</span>
          </button>

          <div class="track" ref="trackRef">
            <div class="track-bg"></div>
            <div class="track-fill" :style="{ width: progressPct + '%' }"></div>
            <div class="thumb" ref="thumbRef" :style="{ left: thumbLeft + '%' }"></div>
          </div>
        </div>

        <div class="time">
          <span class="current">{{ formattedCurrent }}</span>
          <span class="total">{{ formattedDuration }}</span>
        </div>
        <audio ref="audioRef" :src="srcUrl" preload="metadata"></audio>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDraggable } from '@vueuse/core'

interface Props {
  src: string
  from?: 'me' | 'other'
}
const props = withDefaults(defineProps<Props>(), { from: 'me' })
const basePath = import.meta.env.BASE_URL
const srcUrl = computed(() => `${basePath}audio/${props.src}`)

const audioRef = ref<HTMLAudioElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const thumbRef = ref<HTMLDivElement | null>(null)

const isPlaying = ref(false)
const duration = ref(0)
const current = ref(0)

const progressPct = computed(() =>
  duration.value ? (current.value / duration.value) * 100 : 0
)

const { x, isDragging } = useDraggable(thumbRef, {
  containerElement: trackRef,
  axis: 'x'
})

const thumbLeft = computed(() => {
  if (!trackRef.value) return 0
  const rect = trackRef.value.getBoundingClientRect()
  if (isDragging.value) {
    return Math.min(100, Math.max(0, (x.value / rect.width) * 100))
  }
  return progressPct.value
})

watch(isDragging, dragging => {
  if (!dragging && trackRef.value && duration.value) {
    const rect = trackRef.value.getBoundingClientRect()
    const frac = x.value / rect.width
    seekToFraction(Math.min(1, Math.max(0, frac)))
  }
})

function togglePlay() {
  const a = audioRef.value
  if (!a) return
  a.paused ? a.play() : a.pause()
}
function seekToFraction(frac: number) {
  const a = audioRef.value
  if (!a || !duration.value) return
  a.currentTime = frac * duration.value
}

function formatTime(sec: number) {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
const formattedCurrent = computed(() => formatTime(current.value))
const formattedDuration = computed(() => formatTime(duration.value))

onMounted(() => {
  const a = audioRef.value
  if (!a) return
  a.addEventListener('loadedmetadata', () => (duration.value = a.duration || 0))
  a.addEventListener('timeupdate', () => {
    if (!isDragging.value) current.value = a.currentTime || 0
  })
  a.addEventListener('play', () => (isPlaying.value = true))
  a.addEventListener('pause', () => (isPlaying.value = false))
  a.addEventListener('ended', () => {
    isPlaying.value = false
    current.value = duration.value
  })
})
</script>

<style src="@/styles/bubbles.css" />
<style scoped>
.audio-controls {
  display: flex;
  align-items: center;
}

.play-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 0;
  background: #383838;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.track {
  margin-left: 15px;
  position: relative;
  width: 30vw;
  max-width: 200px;
  height: 24px;
  display: flex;
  align-items: center;
}

.track-bg {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 2px;
  background: #7f7f7f;
}

.track-fill {
  position: absolute;
  left: 0;
  height: 3px;
  border-radius: 2px;
  background: #373737;
}

.thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #383838;
  cursor: grab;
}

.time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 56px;
  font-variant-numeric: tabular-nums;
  color: #000000;
}

.time .current {
  font-weight: 600;
}

.time .total {
  opacity: 0.8;
  font-size: 12px;
}
</style>