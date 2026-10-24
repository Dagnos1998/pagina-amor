import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Un único elemento <audio> para toda la experiencia: nunca se recrea,
 * así la canción no se reinicia al cambiar de sección.
 *
 * estado:
 *  'inactivo'      → aún no llega al carrusel
 *  'sonando'       → reproduciéndose (con o sin silencio elegido por ella)
 *  'silenciada'    → el navegador solo permitió reproducir en silencio
 *  'bloqueado'     → el navegador no permitió reproducir nada todavía
 *  'error'         → el archivo no existe o no se pudo cargar
 */
export default function useMusica(ruta, volumen = 0.8) {
  const audioRef = useRef(null)
  const [estado, setEstado] = useState('inactivo')
  const [sonidoActivado, setSonidoActivado] = useState(true)
  const iniciadaRef = useRef(false)
  const prefRef = useRef(true)

  useEffect(() => {
    if (!ruta) { setEstado('error'); return }
    const a = new Audio()
    a.src = ruta
    a.loop = true            // vuelve a empezar al terminar
    a.preload = 'auto'
    a.volume = volumen
    a.setAttribute('playsinline', '')
    const alError = () => setEstado('error')
    // Si el navegador pausa la canción por su cuenta (política de autoplay), lo reflejamos.
    const alPausar = () => {
      if (!iniciadaRef.current || a.ended) return
      if (a.error) return
      a.muted = true
      a.play().then(() => setEstado('silenciada')).catch(() => setEstado('bloqueado'))
    }
    a.addEventListener('error', alError)
    a.addEventListener('pause', alPausar)
    audioRef.current = a
    return () => {
      a.removeEventListener('error', alError)
      a.removeEventListener('pause', alPausar)
      a.pause()
      a.src = ''
    }
  }, [ruta, volumen])

  /** Llamar DENTRO de un toque de la usuaria (último toque del corazón):
      "desbloquea" el audio en iOS/Android sin que todavía se escuche. */
  const desbloquear = useCallback(() => {
    const a = audioRef.current
    if (!a || a.error || iniciadaRef.current) return
    a.muted = true
    a.play().catch(() => {})
  }, [])

  /** Al llegar al carrusel: intenta con sonido → si no, en silencio → si no, bloqueado. */
  const iniciar = useCallback(async () => {
    const a = audioRef.current
    if (!a || iniciadaRef.current) return
    if (a.error) { setEstado('error'); return }
    iniciadaRef.current = true
    try { a.currentTime = 0 } catch { /* aún sin datos */ }
    a.muted = !prefRef.current
    try {
      await a.play()
      setEstado('sonando')
    } catch (e) {
      if (a.error) { setEstado('error'); return }
      a.muted = true
      try {
        await a.play()
        setEstado('silenciada')
      } catch {
        setEstado(a.error ? 'error' : 'bloqueado')
      }
    }
  }, [])

  /** Único control: activar / desactivar el sonido (nunca pausa ni reinicia). */
  const alternarSonido = useCallback(async () => {
    const a = audioRef.current
    if (!a || estado === 'error') return
    const escuchandose = estado === 'sonando' && !a.muted && !a.paused

    if (!iniciadaRef.current) {           // aún no empieza: solo guarda la preferencia
      prefRef.current = !prefRef.current
      setSonidoActivado(prefRef.current)
      return
    }
    if (escuchandose) {
      a.muted = true
      prefRef.current = false
      setSonidoActivado(false)
      return
    }
    prefRef.current = true
    setSonidoActivado(true)
    a.muted = false
    try {
      if (a.paused) await a.play()
      setEstado('sonando')
    } catch {
      a.muted = true
      a.play().then(() => setEstado('silenciada')).catch(() => setEstado('bloqueado'))
    }
  }, [estado])

  const audible = estado === 'sonando' && sonidoActivado
  return { estado, sonidoActivado, audible, desbloquear, iniciar, alternarSonido }
}
