<template>
  <div ref="container" class="relative">
    <canvas
      ref="canvas"
      class="absolute top-0 left-0 pointer-events-none w-full"
      style="z-index: -1; background: #f8fafc;"
    />
    <div class="relative" style="z-index: 1;">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  fade: 0 | 1
}

const canvas = ref<HTMLCanvasElement | null>(null)
const container = ref<HTMLElement | null>(null)
let animationId: number
let resizeObserver: ResizeObserver
let spawnInterval: ReturnType<typeof setInterval>
const MAX_DISTANCE: number = 120
const particles: Particle[] = []

const spawnParticle = (width: number, height: number): Particle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  radius: Math.random() * 2 + 1,
  opacity: 0,
  fade: 0,
})

const spawnParticleInView = (): Particle => ({
  x: Math.random() * window.innerWidth,
  y: window.scrollY + Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  radius: Math.random() * 2 + 1,
  opacity: 0,
  fade: 0,
})

onMounted(async () => {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!canvas.value || !container.value) return
  const c: HTMLCanvasElement = canvas.value
  const ctx: CanvasRenderingContext2D | null = c.getContext('2d')
  if (!ctx) return

  const setSize = (): void => {
    c.width = window.innerWidth
    c.height = container.value?.scrollHeight ?? document.documentElement.scrollHeight
  }

  setSize()
  setTimeout(() => setSize(), 1000)
  setTimeout(() => setSize(), 2000)

  resizeObserver = new ResizeObserver(() => setSize())
  resizeObserver.observe(container.value)

  spawnInterval = setInterval(() => {
    for (let i = 0; i < 5; i++) {
      particles.push(spawnParticle(c.width, c.height))
    }
  }, 800)

  const onScroll = (): void => {
    for (let i = 0; i < 8; i++) {
      particles.push(spawnParticleInView())
    }
  }

  window.addEventListener('resize', setSize)
  window.addEventListener('scroll', onScroll)

  for (let i = 0; i < 150; i++) {
    particles.push(spawnParticle(c.width, c.height))
  }

  const draw = (): void => {
    ctx.clearRect(0, 0, c.width, c.height)

    if (Math.random() < 0.3) particles.push(spawnParticle(c.width, c.height))

    for (let i = particles.length - 1; i >= 0; i--) {
      const p: Particle | undefined = particles[i]
      if (!p) continue

      if (p.fade === 0) {
        p.opacity += 0.005
        if (p.opacity >= 0.5) p.fade = 1
      } else {
        p.opacity -= 0.001
        if (p.opacity <= 0) {
          particles.splice(i, 1)
          continue
        }
      }

      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > c.width) p.vx *= -1
      if (p.y < 0 || p.y > c.height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`
      ctx.fill()
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a: Particle | undefined = particles[i]
        const b: Particle | undefined = particles[j]
        if (!a || !b) continue

        const dx: number = a.x - b.x
        const dy: number = a.y - b.y
        const dist: number = Math.sqrt(dx * dx + dy * dy)

        if (dist < MAX_DISTANCE) {
          const opacity: number = (1 - dist / MAX_DISTANCE) * Math.min(a.opacity, b.opacity)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(15, 23, 42, ${opacity})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    clearInterval(spawnInterval)
    window.removeEventListener('resize', setSize)
    window.removeEventListener('scroll', onScroll)
    resizeObserver.disconnect()
  })
})
</script>
