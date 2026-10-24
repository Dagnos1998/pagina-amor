import { useEffect, useRef, useState } from 'react'
import IconoCorazon from './IconoCorazon.jsx'
import { prefiereMenosMovimiento } from '../utils.js'

/**
 * Sobre cerrado con sello de cera → el sello se levanta y se desvanece → se abre la solapa →
 * sale la carta → se muestra completa.
 * fases: 'cerrado' | 'sello' | 'solapa' | 'saliendo' | 'abierta' | 'cerrando'
 * Al cerrar, la carta se guarda y el sobre vuelve a quedar sellado (se puede abrir otra vez).
 */
const DURACIONES = { sello: 650, solapa: 750, saliendo: 1000 }

export default function Carta({ textoSello, invitacion, encabezado, saludo, texto, despedida, firma, textoCerrar = 'Cerrar carta', onCerrar }) {
  const [fase, setFase] = useState('cerrado')
  const cartaRef = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const abrir = () => {
    if (fase !== 'cerrado') return
    const f = prefiereMenosMovimiento() ? 0.25 : 1
    setFase('sello')
    const t1 = DURACIONES.sello * f
    const t2 = t1 + DURACIONES.solapa * f
    const t3 = t2 + DURACIONES.saliendo * f
    timers.current.push(
      setTimeout(() => setFase('solapa'), t1),
      setTimeout(() => setFase('saliendo'), t2),
      setTimeout(() => {
        setFase('abierta')
        requestAnimationFrame(() => cartaRef.current?.focus({ preventScroll: true }))
        setTimeout(() => cartaRef.current?.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' }), 80)
      }, t3),
    )
  }

  const cerrar = () => {
    if (fase !== 'abierta') return
    setFase('cerrando')
    timers.current.push(setTimeout(() => {
      setFase('cerrado')
      onCerrar?.()
    }, prefiereMenosMovimiento() ? 100 : 450))
  }

  const abierta = fase === 'abierta' || fase === 'cerrando'

  return (
    <div className={`sobre-zona sobre-zona--${fase}`}>
      {!abierta && (
        <>
          <p className="sobre-invitacion">{invitacion}</p>
          <div className="sobre">
            <div className="sobre__fondo" aria-hidden="true" />
            <div className="sobre__carta-asomada" aria-hidden="true">
              <span /><span /><span /><span />
            </div>
            <div className="sobre__bolsillo" aria-hidden="true" />
            <div className="sobre__solapa" aria-hidden="true" />
            <button
              type="button"
              className="sello"
              onClick={abrir}
              disabled={fase !== 'cerrado'}
              aria-label="Abrir la carta"
            >
              <SelloCera />
              <span className="sello__texto">{textoSello}</span>
            </button>
          </div>
        </>
      )}

      {abierta && (
        <article ref={cartaRef} className={`carta ${fase === 'cerrando' ? 'carta--cerrando' : ''}`} tabIndex={-1} aria-label="Carta">
          <div className="carta__barra">
            <button type="button" className="carta__cerrar-x" onClick={cerrar} aria-label={textoCerrar} title={textoCerrar}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          {encabezado && <p className="carta__encabezado" aria-hidden="true">{encabezado}</p>}
          {saludo && <p className="carta__saludo">{saludo}</p>}
          <div className="carta__texto">{texto}</div>
          {despedida && <p className="carta__despedida">{despedida}</p>}
          {firma && <p className="carta__firma">{firma}</p>}
          <IconoCorazon className="carta__corazon" />
          <div className="carta__acciones">
            <button type="button" className="carta__cerrar" onClick={cerrar}>{textoCerrar}</button>
          </div>
        </article>
      )}
    </div>
  )
}

/* Borde ondulado de la cera (forma fija, calculada una vez) */
const BORDE_CERA = (() => {
  const pts = []
  const n = 28
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = 55 + (i % 2 ? 2.6 : -1.4) + Math.sin(i * 1.7) * 1.6
    pts.push([60 + r * Math.cos(a), 60 + r * Math.sin(a)])
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p1 = pts[(i + 1) % n]
    const m = [(pts[i][0] + p1[0]) / 2, (pts[i][1] + p1[1]) / 2]
    d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`
  }
  return d + 'Z'
})()

function SelloCera() {
  return (
    <svg className="sello__cera" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="cera-brillo" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="var(--cera-luz)" />
          <stop offset="55%" stopColor="var(--acento)" />
          <stop offset="100%" stopColor="var(--cera-sombra)" />
        </radialGradient>
      </defs>
      <path d={BORDE_CERA} fill="url(#cera-brillo)" />
      <circle cx="60" cy="60" r="41" fill="none" stroke="var(--cera-sombra)" strokeOpacity=".55" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="38.5" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="1" strokeDasharray="1.5 3.5" />
      <path transform="translate(51 31) scale(.75)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#fff" fillOpacity=".85" />
      <ellipse cx="44" cy="40" rx="12" ry="6" transform="rotate(-35 44 40)" fill="#fff" fillOpacity=".14" />
    </svg>
  )
}
