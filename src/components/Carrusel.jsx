import { useCallback, useRef, useState } from 'react'
import { recurso } from '../utils.js'

/** Carrusel de fotografías (las que pongas en la configuración), con gestos táctiles, flechas e indicadores. */
export default function Carrusel({ fotos, ajuste = 'completa', destellos = true }) {
  const lista = fotos || []
  const total = lista.length
  const [actual, setActual] = useState(0)
  const [direccion, setDireccion] = useState(1)
  const [arrastre, setArrastre] = useState(0)
  const inicio = useRef(null)
  const bloqueo = useRef(false)

  const ir = useCallback((indice, dir) => {
    if (bloqueo.current || total === 0) return
    bloqueo.current = true
    setTimeout(() => { bloqueo.current = false }, 450)
    setDireccion(dir)
    setActual(((indice % total) + total) % total)
  }, [total])

  const siguiente = () => ir(actual + 1, 1)
  const anterior = () => ir(actual - 1, -1)

  // ---- Gestos táctiles / arrastre con ratón ----
  const alBajar = (e) => { inicio.current = { x: e.clientX, y: e.clientY }; }
  const alMover = (e) => {
    if (!inicio.current) return
    const dx = e.clientX - inicio.current.x
    const dy = e.clientY - inicio.current.y
    if (Math.abs(dx) > Math.abs(dy)) setArrastre(Math.max(-80, Math.min(80, dx)))
  }
  const alSoltar = (e) => {
    if (!inicio.current) return
    const dx = e.clientX - inicio.current.x
    inicio.current = null
    setArrastre(0)
    if (dx < -45) siguiente()
    else if (dx > 45) anterior()
  }

  const alTeclado = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); siguiente() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); anterior() }
  }

  if (total === 0) return null
  const foto = lista[actual]

  return (
    <div className="carrusel" role="region" aria-roledescription="carrusel" aria-label="Nuestras fotos" tabIndex={0} onKeyDown={alTeclado}>
      <div className="polaroid">
        {destellos && <Destellos />}
        <div
          className="polaroid__visor"
          onPointerDown={alBajar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={() => { inicio.current = null; setArrastre(0) }}
          onPointerLeave={(e) => inicio.current && alSoltar(e)}
        >
          {lista.map((f, i) => (
            <figure
              key={i}
              className={`diapositiva ${i === actual ? 'diapositiva--activa' : ''}`}
              style={{
                '--dir': direccion,
                transform: i === actual && arrastre ? `translateX(${arrastre}px) rotate(${arrastre / 40}deg)` : undefined,
              }}
              aria-hidden={i !== actual}
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
            >
              {ajuste === 'completa' && (
                <img className="diapositiva__fondo" src={recurso(f.ruta)} alt="" aria-hidden="true" draggable="false" />
              )}
              <img
                className={`diapositiva__img diapositiva__img--${ajuste}`}
                src={recurso(f.ruta)}
                alt={f.alt || `Foto ${i + 1}`}
                style={{ objectPosition: f.posicion || 'center' }}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
                onError={(e) => { e.currentTarget.closest('figure')?.classList.add('diapositiva--sin-foto') }}
              />
              <span className="diapositiva__aviso">Foto {i + 1} no encontrada<br /><small>{f.ruta}</small></span>
            </figure>
          ))}

          <button type="button" className="carrusel__flecha carrusel__flecha--izq" onClick={anterior} aria-label="Foto anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="carrusel__flecha carrusel__flecha--der" onClick={siguiente} aria-label="Foto siguiente">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="indicadores" role="tablist" aria-label="Elegir foto">
          {lista.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === actual}
              aria-label={`Ver foto ${i + 1}`}
              className={`indicador ${i === actual ? 'indicador--activo' : ''}`}
              onClick={() => i !== actual && ir(i, i > actual ? 1 : -1)}
            />
          ))}
        </div>

        <p key={actual} className={`polaroid__frase ${foto.frase ? '' : 'polaroid__frase--vacia'}`} aria-live="polite">
          {foto.frase}
        </p>
      </div>
    </div>
  )
}

function Destellos() {
  const puntos = [
    { t: '-14px', l: '-12px', d: '0s', s: 22 },
    { t: '18%', r: '-16px', d: '1.2s', s: 16 },
    { b: '30%', l: '-18px', d: '2.1s', s: 14 },
    { b: '-10px', r: '12%', d: '0.6s', s: 20 },
  ]
  return (
    <div className="destellos" aria-hidden="true">
      {puntos.map((p, i) => (
        <svg key={i} viewBox="0 0 24 24" style={{ top: p.t, left: p.l, right: p.r, bottom: p.b, width: p.s, height: p.s, animationDelay: p.d }}>
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      ))}
    </div>
  )
}
