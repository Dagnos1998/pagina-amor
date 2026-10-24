/** Barra de progreso elegante con porcentaje. */
export default function BarraProgreso({ valor }) {
  const v = Math.max(0, Math.min(100, Math.round(valor)))
  return (
    <div className="progreso">
      <div className="progreso__pista" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} aria-label="Progreso del corazón">
        <div className="progreso__relleno" style={{ width: `${v}%` }} />
      </div>
      <span className="progreso__texto">{v}%</span>
    </div>
  )
}
