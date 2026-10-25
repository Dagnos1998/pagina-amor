import { useCallback, useEffect, useState } from 'react'
import config from './config/personalizacion.js'
import { aplicarColores, recurso, prefiereMenosMovimiento } from './utils.js'
import useMusica from './hooks/useMusica.js'
import CorazonInteractivo from './components/CorazonInteractivo.jsx'
import Carrusel from './components/Carrusel.jsx'
import Carta from './components/Carta.jsx'
import ControlSonido from './components/ControlSonido.jsx'
import Particulas from './components/Particulas.jsx'

aplicarColores()

export default function App() {
  // 'corazon' → 'saliendo' (desvanecido) → 'historia'
  const [etapa, setEtapa] = useState('corazon')
  const musica = useMusica(recurso(config.rutaCancion), config.volumen)
  const deco = config.decoracion || {}

  const alCompletar = useCallback(() => {
    setEtapa('saliendo')
    setTimeout(() => setEtapa('historia'), prefiereMenosMovimiento() ? 150 : 900)
  }, [])

  // Al cerrar la carta: vuelve suavemente a las fotos (la música sigue sonando)
  const volverAFotos = useCallback(() => {
    document.getElementById('titulo-fotos')?.scrollIntoView({
      behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start',
    })
  }, [])

  // La música empieza justo al llegar al carrusel
  useEffect(() => {
    if (etapa === 'historia') {
      window.scrollTo({ top: 0 })
      musica.iniciar()
    }
  }, [etapa]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      {deco.particulas && <Particulas cantidad={deco.cantidadParticulas} />}

      {etapa !== 'historia' && (
        <div className={`etapa ${etapa === 'saliendo' ? 'etapa--saliendo' : ''}`}>
          <CorazonInteractivo
            nombre={config.nombre}
            mensajeBienvenida={config.mensajeBienvenida}
            mensajes={config.mensajesProgreso}
            mensajeFinal={config.mensajeFinal}
            tituloFinal={config.tituloFinal}
            incremento={config.incrementoPorToque}
            espera={config.esperaAntesDeFotos}
            textoContinuar={config.textoContinuar}
            corazonesAlTocar={deco.corazonesAlTocar}
            onUltimoToque={musica.desbloquear}
            onCompletado={alCompletar}
          />
        </div>
      )}

      {etapa === 'historia' && (
        <main className="historia">
          <section className="seccion seccion--fotos" aria-labelledby="titulo-fotos">
            <h2 id="titulo-fotos" className="titulo-seccion">{config.tituloFotos}</h2>
            {config.subtituloFotos && <p className="subtitulo-seccion">{config.subtituloFotos}</p>}
            <Carrusel fotos={config.fotos} ajuste={config.ajusteFotos} destellos={deco.destellosEnFotos} />
            <div className="separador" aria-hidden="true">
              <svg viewBox="0 0 80 16"><path d="M2 10c10-9 18-9 26 0s16 9 24 0 16-9 26 0" /></svg>
            </div>
            <p className="pista-scroll" aria-hidden="true">desliza hacia abajo</p>
          </section>

          <section className="seccion seccion--carta" aria-label="Tu carta">
            <Carta
              textoSello={config.textoSello}
              invitacion={config.invitacionSobre}
              encabezado={config.encabezadoCarta}
              saludo={config.saludoCarta}
              texto={config.textoCarta}
              despedida={config.despedidaCarta}
              firma={config.firmaCarta}
              textoCerrar={config.textoCerrarCarta}
              onCerrar={volverAFotos}
            />
          </section>
        </main>
      )}

      <ControlSonido estado={musica.estado} sonidoActivado={musica.sonidoActivado} onAlternar={musica.alternarSonido} />
    </div>
  )
}
