import { useCallback, useEffect, useRef, useState } from 'react'
import IconoCorazon from './IconoCorazon.jsx'
import BarraProgreso from './BarraProgreso.jsx'
import { prefiereMenosMovimiento } from '../utils.js'

const ESPERA_ENTRE_TOQUES = 140 // ms — evita que toques ultrarrápidos se acumulen

/**
 * Pantalla de bienvenida: nombre + corazón que se llena con cada toque.
 * onUltimoToque → se llama dentro del toque que llega al 100 % (sirve para desbloquear el audio).
 * onCompletado  → se llama cuando termina la pausa del mensaje final.
 */
export default function CorazonInteractivo({
  nombre, mensajeBienvenida, mensajes, mensajeFinal, tituloFinal = '',
  incremento = 10, espera = 2.2, corazonesAlTocar = true,
  onUltimoToque, onCompletado,
}) {
  const [progreso, setProgreso] = useState(0)
  const [latido, setLatido] = useState(0)          // clave que reinicia la animación
  const [miniCorazones, setMiniCorazones] = useState([])
  const ultimoToque = useRef(0)
  const completadoRef = useRef(false)
  const idRef = useRef(0)

  const completo = progreso >= 100
  const actualMsg = completo
    ? { titulo: tituloFinal, texto: mensajeFinal }
    : [...mensajes].sort((a, b) => a.desde - b.desde).filter((m) => progreso >= m.desde).pop() ?? {}
  const mensaje = actualMsg.texto ?? ''

  const tocar = useCallback(() => {
    if (completadoRef.current) return
    const ahora = performance.now()
    if (ahora - ultimoToque.current < ESPERA_ENTRE_TOQUES) return
    ultimoToque.current = ahora

    setLatido((n) => n + 1)
    if (corazonesAlTocar && !prefiereMenosMovimiento()) {
      const nuevos = Array.from({ length: 3 }, () => ({
        id: idRef.current++,
        x: (Math.random() - 0.5) * 140,
        r: (Math.random() - 0.5) * 50,
        s: 0.6 + Math.random() * 0.6,
      }))
      setMiniCorazones((prev) => [...prev.slice(-12), ...nuevos])
    }

    setProgreso((p) => {
      const siguiente = Math.min(100, p + incremento)
      return siguiente
    })
  }, [incremento, corazonesAlTocar])

  // Detecta la llegada al 100 % una única vez
  useEffect(() => {
    if (progreso >= 100 && !completadoRef.current) {
      completadoRef.current = true
      const t = setTimeout(() => onCompletado?.(), (prefiereMenosMovimiento() ? 0.8 : espera) * 1000)
      return () => clearTimeout(t)
    }
  }, [progreso, espera, onCompletado])

  // El desbloqueo del audio necesita ocurrir sincrónicamente dentro del toque
  const alPulsar = (e) => {
    if (!completadoRef.current && progreso + incremento >= 100) onUltimoToque?.()
    tocar(e)
  }

  const limpiarMini = (id) => setMiniCorazones((prev) => prev.filter((m) => m.id !== id))

  return (
    <section className={`bienvenida ${completo ? 'bienvenida--completa' : ''}`} aria-labelledby="nombre-amor">
      <div className="bienvenida__contenido">
        <p className="bienvenida__antetitulo">{mensajeBienvenida}</p>
        <h1 id="nombre-amor" className="bienvenida__nombre">{nombre}</h1>
        <div key={mensaje} className="bienvenida__mensaje-caja" aria-live="polite">
          {actualMsg.titulo && <p className="bienvenida__etapa">{actualMsg.titulo}</p>}
          <p className="bienvenida__mensaje">{mensaje}</p>
        </div>

        <div className="corazon-zona">
          <span className={`corazon-halo ${completo ? 'corazon-halo--completo' : ''}`} aria-hidden="true" />
          <button
            type="button"
            className="corazon-boton"
            onClick={alPulsar}
            disabled={completo}
            aria-label={completo ? 'Corazón completo' : `Toca el corazón. Progreso ${progreso} por ciento`}
          >
            <span key={latido} className={`corazon-latido ${latido ? 'corazon-latido--activo' : ''}`}>
              <IconoCorazon className="corazon-svg" />
              <span className="corazon-relleno" style={{ clipPath: `inset(${100 - progreso}% 0 0 0)` }} aria-hidden="true">
                <IconoCorazon className="corazon-svg corazon-svg--lleno" />
              </span>
            </span>
          </button>
          {miniCorazones.map((m) => (
            <span
              key={m.id}
              className="mini-corazon"
              style={{ '--x': `${m.x}px`, '--r': `${m.r}deg`, '--s': m.s }}
              onAnimationEnd={() => limpiarMini(m.id)}
              aria-hidden="true"
            >
              <IconoCorazon />
            </span>
          ))}
          {completo && <Estallido />}
        </div>

        <BarraProgreso valor={progreso} />
      </div>
    </section>
  )
}

function Estallido() {
  if (prefiereMenosMovimiento()) return null
  return (
    <div className="estallido" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} style={{ '--a': `${(360 / 14) * i}deg`, '--d': `${90 + (i % 3) * 30}px` }}>
          <IconoCorazon />
        </span>
      ))}
    </div>
  )
}
