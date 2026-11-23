import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/**
 * Scroll-triggered reveals, driven by data attributes inside `scopeRef`:
 *
 *   data-reveal="up"       fade + rise
 *   data-reveal="stagger"  fade + rise each direct child in turn
 *   data-reveal="lines"    split text into lines that slide up from a mask
 *   data-reveal="image"    wipe a container open and settle its <img>
 *
 * `setup(q)` runs extra, section-specific animations in the same scope.
 * Everything is skipped when the user prefers reduced motion, and cleaned
 * up automatically on unmount.
 */
export function useReveal(scopeRef, setup) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return
    const mm = gsap.matchMedia(scope)

    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(scope)
      const onEnter = (trigger, start = 'top 86%') => ({ trigger, start, once: true })

      q('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: onEnter(el) })
      })

      q('[data-reveal="stagger"]').forEach((el) => {
        gsap.from(el.children, {
          y: 36, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, scrollTrigger: onEnter(el),
        })
      })

      q('[data-reveal="lines"]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true, // re-split when fonts load or the viewport resizes
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110, duration: 1.3, ease: 'power4.out', stagger: 0.1, scrollTrigger: onEnter(el, 'top 88%'),
            }),
        })
      })

      q('[data-reveal="image"]').forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: onEnter(el, 'top 90%') })
        tl.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' })
        const inner = el.querySelector('img')
        // clearProps hands `transform` back to CSS so the hover zoom keeps working.
        if (inner) tl.from(inner, { scale: 1.3, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 0.2)
      })

      setup?.(q)
    })

    // Recalculate positions once late assets (fonts/images) have settled.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
