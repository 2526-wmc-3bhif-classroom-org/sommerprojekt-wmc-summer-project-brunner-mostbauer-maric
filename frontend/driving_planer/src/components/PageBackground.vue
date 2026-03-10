<template>
  <div class="relative min-h-screen">
    <canvas
      ref="canvas"
      class="fixed inset-0 pointer-events-none"
      style="z-index: -1; width: 100vw; height: 100vh;"
    />
    <div class="relative" style="z-index: 1;">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
let animationId: number

onMounted(() => {
  if (!canvas.value) return
  const c: HTMLCanvasElement = canvas.value
  const ctx: CanvasRenderingContext2D | null = c.getContext('2d')
  if (!ctx) return

  const resize = (): void => {
    c.width = window.innerWidth
    c.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const MAX_DISTANCE: number = 120
  const MAX_PARTICLES: number = 120
  const particles: Particle[] = []

  const spawnParticle = (): Particle => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
    opacity: 0,
    fade: 0,
  })

  for (let i = 0; i < 80; i++) particles.push(spawnParticle())

  const draw = (): void => {
    ctx.clearRect(0, 0, c.width, c.height)

    if (particles.length < MAX_PARTICLES && Math.random() < 0.05) {
      particles.push(spawnParticle())
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p: Particle | undefined = particles[i]
      if (!p) continue

      if (p.fade === 0) {
        p.opacity += 0.005
        if (p.opacity >= 0.6) p.fade = 1
      } else {
        p.opacity -= 0.003
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
      ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`
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
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>
