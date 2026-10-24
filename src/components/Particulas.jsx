import { useMemo } from 'react'
import IconoCorazon from './IconoCorazon.jsx'

/** Corazoncitos y destellos que flotan suavemente al fondo. */
export default function Particulas({ cantidad = 14 }) {
  const items = useMemo(() => Array.from({ length: cantidad }, (_, i) => ({
    id: i,
    izquierda: Math.random() * 100,
    tam: 8 + Math.random() * 14,
    duracion: 14 + Math.random() * 14,
    retraso: -Math.random() * 28,
    tipo: i % 3 === 0 ? 'destello' : 'corazon',
    opacidad: 0.25 + Math.random() * 0.35,
  })), [cantidad])

  return (
    <div className="particulas" aria-hidden="true">
      {items.map((p) => (
        <span
          key={p.id}
          className={`particula particula--${p.tipo}`}
          style={{
            left: `${p.izquierda}%`, width: p.tam, height: p.tam,
            animationDuration: `${p.duracion}s`, animationDelay: `${p.retraso}s`,
            '--op': p.opacidad,
          }}
        >
          {p.tipo === 'corazon' ? <IconoCorazon /> : <svg viewBox="0 0 24 24"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>}
        </span>
      ))}
    </div>
  )
}
