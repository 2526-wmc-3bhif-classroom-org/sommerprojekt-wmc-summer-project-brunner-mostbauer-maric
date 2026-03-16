<template>
  <!-- Main container for the particle background and page content -->
  <div ref="container" class="relative">

    <!-- Canvas used to render the particle animation -->
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

/* Particle interface describing a single particle object */
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  fade: 0 | 1
}

/* References to DOM elements */
const canvas = ref<HTMLCanvasElement | null>(null)
const container = ref<HTMLElement | null>(null)

/* Animation and observer variables */
let animationId: number
let resizeObserver: ResizeObserver
let spawnInterval: ReturnType<typeof setInterval>

/* Cleanup handlers for event listeners */
let cleanupScroll: (() => void) | null = null
let cleanupResize: (() => void) | null = null

/* Maximum distance between particles to draw connecting lines */
const MAX_DISTANCE: number = 120

/* Array storing all active particles */
const particles: Particle[] = []


/* Creates a new particle within the canvas area */
const spawnParticle = (width: number, height: number): Particle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  radius: Math.random() * 2 + 1,
  opacity: 0,
  fade: 0,
})


/* Creates a particle within the currently visible viewport */
const spawnParticleInView = (): Particle => ({
  x: Math.random() * window.innerWidth,
  y: window.scrollY + Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  radius: Math.random() * 2 + 1,
  opacity: 0,
  fade: 0,
})


/* Lifecycle hook executed when the component is mounted */
onMounted(async () => {

  /* Wait until DOM is fully rendered */
  await nextTick()

  /* Small delay to ensure layout height is correct */
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!canvas.value || !container.value) return

  const c: HTMLCanvasElement = canvas.value
  const ctx: CanvasRenderingContext2D | null = c.getContext('2d')

  if (!ctx) return


  /* Adjust canvas size to match window width and page height */
  const setSize = (): void => {
    c.width = window.innerWidth
    c.height = container.value?.scrollHeight ?? document.documentElement.scrollHeight
  }


  /* Spawn additional particles when the user scrolls */
  const onScroll = (): void => {
    for (let i = 0; i < 8; i++) {
      particles.push(spawnParticleInView())
    }
  }


  /* Functions used later to remove event listeners */
  cleanupResize = () => window.removeEventListener('resize', setSize)
  cleanupScroll = () => window.removeEventListener('scroll', onScroll)


  /* Initial canvas sizing */
  setSize()

  /* Extra resizing attempts in case layout height changes after render */
  setTimeout(() => setSize(), 1000)
  setTimeout(() => setSize(), 2000)


  /* Observe container size changes */
  resizeObserver = new ResizeObserver(() => setSize())
  resizeObserver.observe(container.value)


  /* Periodically spawn new particles */
  spawnInterval = setInterval(() => {
    for (let i = 0; i < 5; i++) {
      particles.push(spawnParticle(c.width, c.height))
    }
  }, 800)


  /* Add event listeners */
  window.addEventListener('resize', setSize)
  window.addEventListener('scroll', onScroll)


  /* Initial particle population */
  for (let i = 0; i < 150; i++) {
    particles.push(spawnParticle(c.width, c.height))
  }


  /* Main animation loop */
  const draw = (): void => {

    /* Clear the canvas */
    ctx.clearRect(0, 0, c.width, c.height)

    /* Occasionally spawn a random particle */
    if (Math.random() < 0.3) particles.push(spawnParticle(c.width, c.height))


    /* Update and draw each particle */
    for (let i = particles.length - 1; i >= 0; i--) {

      const p: Particle | undefined = particles[i]
      if (!p) continue

      /* Fade in and fade out effect */
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

      /* Move particle */
      p.x += p.vx
      p.y += p.vy

      /* Bounce from canvas edges */
      if (p.x < 0 || p.x > c.width) p.vx *= -1
      if (p.y < 0 || p.y > c.height) p.vy *= -1


      /* Draw particle */
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`
      ctx.fill()
    }


    /* Draw connecting lines between nearby particles */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {

        const a: Particle | undefined = particles[i]
        const b: Particle | undefined = particles[j]
        if (!a || !b) continue

        const dx: number = a.x - b.x
        const dy: number = a.y - b.y
        const dist: number = Math.sqrt(dx * dx + dy * dy)

        /* Draw line if particles are close enough */
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

    /* Request next animation frame */
    animationId = requestAnimationFrame(draw)
  }

  /* Start animation */
  draw()
})


/* Lifecycle hook executed when the component is destroyed */
onUnmounted(() => {

  /* Stop animation loop */
  cancelAnimationFrame(animationId)

  /* Stop particle spawning */
  clearInterval(spawnInterval)

  /* Remove event listeners */
  cleanupResize?.()
  cleanupScroll?.()

  /* Disconnect resize observer */
  resizeObserver?.disconnect()
})

</script>