import config from './config/personalizacion.js'

/** Convierte una ruta de /public en una ruta válida también tras publicar (subcarpetas incluidas). */
export const recurso = (ruta) => {
  if (!ruta) return ''
  if (/^(https?:|data:|blob:)/.test(ruta)) return ruta
  return import.meta.env.BASE_URL + ruta.replace(/^\/+/, '')
}

export const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Aplica los colores del archivo de configuración como variables CSS. */
export const aplicarColores = () => {
  const c = config.colores || {}
  const raiz = document.documentElement.style
  const mapa = {
    '--rosa': c.primario, '--rosa-oscuro': c.primarioOscuro, '--acento': c.acento,
    '--fondo': c.fondo, '--papel': c.papel, '--texto': c.texto,
  }
  Object.entries(mapa).forEach(([k, v]) => v && raiz.setProperty(k, v))
  if (c.fondo) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', c.fondo)
}
