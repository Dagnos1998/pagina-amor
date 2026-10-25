/* ============================================================
   💗  PERSONALIZACIÓN — edita SOLO este archivo
   Todo el texto, los colores, las fotos y la música salen de aquí.
   No necesitas tocar los componentes.
   ============================================================ */

const personalizacion = {
  /* ---------- 1. Pantalla de bienvenida ---------- */
  nombre: 'Mi amorcito',                       // ← su nombre
  mensajeBienvenida: 'Preparé algo solo para ti…',

  // Cuánto sube el progreso en cada toque (20 → 5 toques para llegar al 100 %)
  incrementoPorToque: 20,

  // Mensajes según el porcentaje alcanzado. Se muestra el último cuyo "desde" ya se superó.
  // "titulo" es la etiqueta pequeña sobre la frase (opcional: deja '' para ocultarla).
  mensajesProgreso: [
    { desde: 0,  titulo: 'El comienzo',
      texto: 'Toca el corazón 💗' },
    { desde: 20, titulo: 'Una bonita coincidencia',
      texto: 'Quién diría que aquel sábado 17 comenzaría algo tan bonito. ❤️' },
    { desde: 40, titulo: 'Lo que provocas en mí',
      texto: 'En tan poquito tiempo, has llenado mis días de colores y mi corazón de felicidad. 🥹💕' },
    { desde: 60, titulo: 'A pesar de los kilómetros',
      texto: 'Aunque tú estés en Camaná y yo en Lima, me ilusiona saber que podemos encontrar la manera de estar cerquita. ✈️❤️' },
    { desde: 80, titulo: 'Lo que quiero contigo',
      texto: 'Porque cuando alguien te hace tan feliz, la distancia no tiene por qué ser el final de la historia.' },
  ],
  tituloFinal: 'La sorpresa final',
  mensajeFinal: 'No sé cuántos kilómetros nos tocará recorrer, pero sí sé que quiero seguir descubriendo esta historia contigo. ¿Lista para tu sorpresa, mi amorcito? 💗',

  // Segundos que se queda el mensaje final antes de pasar a las fotos
  // (es largo, así que le damos tiempo para leerlo)
   esperaAntesDeFotos: 10,
   textoContinuar: 'Toca el corazón para ver tu sorpresa 💗',

  /* ---------- 2. Carrusel de fotos ---------- */
  tituloFotos: 'Tú y yo,\nuna historia muy bonita',
  subtituloFotos: 'nuestros momentos',         // texto pequeño bajo el título (o '' para ocultarlo)

  // Tus fotos (ahora son dos). Pon tus archivos en public/images/ con estos nombres
  // (o cambia la ruta). "frase" es opcional: deja '' si no quieres texto.
  // "posicion" decide qué parte de la foto se prioriza si se recorta (ej. 'center top').
  fotos: [
    { ruta: 'images/foto-1.jpg', frase: 'Aquí empezó todo', alt: 'Nuestra primera foto juntos', posicion: 'center' },
    { ruta: 'images/foto-2.jpg', frase: 'Y lo mejor aún está por venir', alt: 'Nosotros sonriendo', posicion: 'center' },
  ],
  // 'completa'  → la foto se ve entera, sin recortes (relleno difuminado alrededor)
  // 'rellenar'  → la foto llena el marco (puede recortar bordes)
  ajusteFotos: 'completa',

  /* ---------- 3. Música ---------- */
  rutaCancion: 'audio/cancion.mp3',            // pon tu MP3 en public/audio/
  volumen: 0.8,                                // 0 a 1

  /* ---------- 4. Carta ---------- */
  textoSello: 'Descúbrelo',
  invitacionSobre: 'Tengo algo más para ti…',
  encabezadoCarta: '💐 💗 💐',                 // línea decorativa arriba de la carta ('' para quitarla)
  saludoCarta: 'Mi amorcito ❤️',

  // ✍️  TU CARTA.  Respeta las comillas invertidas ` al inicio y al final.
  // Los saltos de línea y los emojis se respetan tal cual.
  textoCarta: `A veces pienso en lo curiosa que es la vida. Aquella noche del viernes 16 te vi en la moto con tu prima, sin imaginar que al día siguiente haría todo lo posible por encontrar la manera de hablarte. No sabía cómo acercarme a ti, pero sentía que no podía dejar pasar la oportunidad de conocerte. Hasta me puse una foto de perfil para escribirte por Facebook. 😂❤️

Y llegó aquel domingo en la playa, donde sentí una química contigo que me hizo pensar que eras esa personita con la que quería estar. Tanto me costaba despedirme que decidí quedarme un día más, solo para verte unos minutos más y tener un ratito extra contigo. Ahora recuerdo todo eso con una sonrisa, porque sin saberlo, estaba comenzando una historia muy bonita.

Desde entonces, me has hecho sentir algo que valoro muchísimo: sentirme querido. Cuando me dices «te quiero», es como si mi batería estuviera al 10 % y de pronto se cargara al 100 %. 🥹💕 Quizás no imaginas cuánto significan para mí esas palabras, pero desde que llegaste, has llenado mis días de colores y mi corazón de felicidad.

Sé que tú estás en Camaná y yo en Lima, y que a veces nos tocará extrañarnos. Pero quiero que encontremos la manera de acercarnos, visitarnos y seguir creando recuerdos juntos. Me ilusiona pensar en todo lo que podemos vivir, en las risas, los abrazos y los sueños que podríamos compartir.

Sé que todavía nos queda mucho por conocernos, y quiero que lo hagamos paso a paso, cuidando esto tan bonito que está naciendo entre nosotros. No sé qué nos tenga preparado la vida, pero sí sé que quiero seguir descubriéndote, hacerte feliz y demostrarte con mis acciones lo mucho que me importas.

Si pudiera volver a aquel sábado 17, volvería a vencer mis nervios y buscaría la manera de hablarte una y mil veces, porque qué bonito fue encontrar a alguien que, con un simple «te quiero», puede hacer que mi corazón vuelva a estar al 100 %.

Te quiero muchísimo, mi amorcito. No sé hasta dónde nos llevará esta historia, pero me hace feliz poder escribirla contigo. Y ojalá esta sea apenas la primera de muchísimas páginas bonitas juntos. ❤️`,

  despedidaCarta: '',                          // frase destacada al final ('' para ocultarla)
  firmaCarta: 'Con todo mi amor, para ti. 💗',
  textoCerrarCarta: 'Cerrar carta',            // botón para guardar la carta y volver a las fotos

  /* ---------- 5. Colores ---------- */
  // Cambia "primario" y toda la página se adapta.
  colores: {
    primario: '#FFC5D3',        // rosa pastel principal
    primarioOscuro: '#B85C78',  // títulos, botones y texto destacado (más oscuro para que se lea bien)
    acento: '#C2506E',          // sello de la carta
    fondo: '#FFF7F8',           // fondo general
    papel: '#FFFDFB',           // papel de la carta y marco de fotos
    texto: '#4A3438',           // texto principal
  },

  /* ---------- 6. Decoración y animaciones ---------- */
  decoracion: {
    particulas: true,           // corazoncitos flotando al fondo
    cantidadParticulas: 14,
    corazonesAlTocar: true,     // mini corazones que salen al tocar el corazón
    destellosEnFotos: true,     // destellos alrededor del carrusel
  },
}

export default personalizacion
