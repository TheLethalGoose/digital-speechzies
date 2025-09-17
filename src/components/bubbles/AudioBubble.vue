<template>
  <div>
    <div class="bubble-row" :class="props.from">
      <div class="bubble audio" :class="props.from">
        <div class="audio-controls">
          <button class="play-btn" @click="togglePlay">
            <span v-if="!isPlaying">⏵︎</span>
            <span v-else>⏸︎</span>
          </button>

          <div class="track" ref="trackRef">
            <div class="track-bg"></div>
            <div class="track-fill" :style="{ width: progressPct + '%' }"></div>
            <div
              class="thumb"
              ref="thumbRef"
              :style="{ left: thumbLeft + '%' }"
            ></div>
          </div>
        </div>

        <div class="time">
          <span class="current">{{ formattedCurrent }}</span>
          <span class="total">{{ formattedDuration }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useDraggable } from '@vueuse/core'
import { Howl } from 'howler'

interface Props {
  src: string
  from?: 'me' | 'other'
}
const props = withDefaults(defineProps<Props>(), { from: 'me' })

const isPlaying = ref(false)
const duration = ref(0)
const current = ref(0)

const trackRef = ref<HTMLDivElement | null>(null)
const thumbRef = ref<HTMLDivElement | null>(null)
let howl: Howl | null = null
let rafId: number | null = null

const progressPct = computed(() =>
  duration.value ? (current.value / duration.value) * 100 : 0
)

const { x, isDragging } = useDraggable(thumbRef, {
  containerElement: trackRef,
  axis: 'x',
  pointerTypes: ['mouse', 'touch']
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
  if (!dragging && trackRef.value && duration.value && howl) {
    const rect = trackRef.value.getBoundingClientRect()
    const frac = x.value / rect.width
    seekToFraction(Math.min(1, Math.max(0, frac)))
  }
})

function togglePlay() {
  if (!howl) return
  if (howl.playing()) {
    howl.pause()
  } else {
    howl.play()
  }
}

function seekToFraction(frac: number) {
  if (!howl || !duration.value) return
  const t = duration.value * frac
  howl.seek(t)
  current.value = t
}

function formatTime(sec: number) {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
const formattedCurrent = computed(() => formatTime(current.value))
const formattedDuration = computed(() => formatTime(duration.value))

function step() {
  if (howl && howl.playing() && !isDragging.value) {
    current.value = howl.seek() as number
  }
  rafId = requestAnimationFrame(step)
}

onMounted(() => {
  howl = new Howl({
    src: [import.meta.env.BASE_URL + 'audio/' + props.src],
    html5: true,
    preload: true,
    onload: () => {
      duration.value = howl?.duration() ?? 0
    },
    onplay: () => {
      isPlaying.value = true
      step()
    },
    onpause: () => {
      isPlaying.value = false
    },
    onstop: () => {
      isPlaying.value = false
      current.value = 0
    },
    onend: () => {
      isPlaying.value = false
      current.value = duration.value
    }
  })
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  howl?.unload()
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
  font-size: 22px;
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
  touch-action: none;
}

.thumb::after {
  content: "";
  position: absolute;
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  border-radius: 50%;
  /* background: rgba(255, 0, 0, 0.2); */
  pointer-events: auto;
}

.track,
.thumb {
  touch-action: pan-y;
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