# 💗 Página para mi amorcito

Experiencia romántica en una sola página: **corazón interactivo → carrusel de fotos con música → sobre con sello y carta**.
Hecha con React + Vite + CSS puro (sin servicios de pago ni claves API).

## 1. Instalar y ejecutar

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install        # instala dependencias (solo la primera vez)
npm run dev        # abre http://localhost:5173
```

Para probarla en tu celular dentro de la misma red Wi-Fi: `npm run dev -- --host` y abre la IP que aparece.

## 2. Personalizar (todo en un solo archivo)

Abre **`src/config/personalizacion.js`**. Ahí cambias:

| Qué | Clave |
|---|---|
| Su nombre | `nombre` |
| Frase de bienvenida | `mensajeBienvenida` |
| Cuántos toques hacen falta | `incrementoPorToque` (20 → 5 toques) |
| Mensajes por porcentaje | `mensajesProgreso` (`desde` = porcentaje, `titulo` = etiqueta pequeña) |
| Frase del 100 % | `tituloFinal`, `mensajeFinal`, `esperaAntesDeFotos` |
| Título del carrusel | `tituloFotos`, `subtituloFotos` |
| Fotos y sus frases | `fotos` (ruta, frase, texto alternativo, posición) — puedes poner 2, 3 o las que quieras |
| Recorte de fotos | `ajusteFotos`: `'completa'` (sin recortes) o `'rellenar'` |
| Canción | `rutaCancion`, `volumen` |
| Sello y sobre | `textoSello`, `invitacionSobre` |
| **Tu carta** | `textoCarta` (+ `saludoCarta`, `despedidaCarta`, `firmaCarta`) |
| Colores | `colores` |
| Decoración | `decoracion` (partículas, mini corazones, destellos) |

### Fotos
Reemplaza los archivos de ejemplo por los tuyos **con el mismo nombre**:

```
public/images/foto-1.jpg
public/images/foto-2.jpg
```

Si usas otro nombre o formato (`.png`, `.webp`), actualiza `ruta` en `fotos`.
Consejo: fotos de ~1200 px de ancho y menos de 500 KB cargan rápido en el celular.

### Canción
Reemplaza `public/audio/cancion.mp3` por tu MP3 (mismo nombre) o cambia `rutaCancion`.
El MP3 incluido es solo una melodía de prueba.

### Carta
Escribe tu mensaje dentro de `textoCarta`, entre las comillas invertidas `` ` ``.
Los saltos de línea, las líneas en blanco y los emojis se respetan tal cual. Puede ser tan larga como quieras.
La carta tiene un botón ✕ (siempre visible arriba) y otro «Cerrar carta» al final: la guardan en el sobre y regresan a las fotos; se puede volver a abrir. El texto del botón está en `textoCerrarCarta`.

### Colores
Cambia `colores.primario` y toda la paleta (fondos suaves, barra, corazón) se recalcula sola.
`primarioOscuro` se usa para títulos y textos destacados; `acento` es el color del sello.

## 3. Publicar

```bash
npm run build      # genera la carpeta dist/
npm run preview    # (opcional) prueba la versión final en http://localhost:4173
```

El proyecto usa rutas relativas (`base: './'` en `vite.config.js`), así que fotos y audio funcionan igual en la raíz de un dominio o en una subcarpeta.

**Netlify (lo más fácil):** entra a <https://app.netlify.com/drop> y arrastra la carpeta `dist`. Te da un enlace al instante.

**Vercel:** sube el proyecto a GitHub → en <https://vercel.com/new> importa el repositorio. Vercel detecta Vite solo (build: `npm run build`, carpeta: `dist`).

**GitHub Pages:** ejecuta `npm run build`, sube el contenido de `dist/` a una rama `gh-pages` (por ejemplo con `npx gh-pages -d dist`) y activa Pages en *Settings → Pages* apuntando a esa rama.

## 4. Sobre la música y los navegadores

- La canción empieza al llegar al carrusel y suena en bucle durante toda la experiencia; nunca se reinicia al cambiar de foto ni al abrir la carta.
- Para que el navegador lo permita, el **último toque del corazón** "desbloquea" el audio (en silencio) y al aparecer el carrusel se activa el sonido.
- Si aun así el navegador lo bloquea (p. ej. modo de ahorro de batería o el interruptor de silencio del iPhone), la canción se reproduce silenciada si se puede y el botón de sonido late con el aviso «Toca para escuchar 🎶». Nunca se muestra como si sonara cuando no lo hace.
- El **interruptor físico de silencio del iPhone** silencia la web; eso no se puede evitar desde una página.
- Si el MP3 no existe o falla, el botón de sonido se oculta y el resto de la página funciona igual.
- El único control es activar/desactivar el sonido (no hay pausa, play ni reinicio).

## 5. Estructura

```
src/
  config/personalizacion.js   ← todo lo editable
  App.jsx                     ← flujo de la experiencia
  hooks/useMusica.js          ← un único <audio> para toda la página
  components/
    CorazonInteractivo.jsx    ← corazón + mensajes + barra
    BarraProgreso.jsx
    Carrusel.jsx              ← fotos, gestos, flechas, indicadores, teclado
    Carta.jsx                 ← sobre, sello y carta
    ControlSonido.jsx
    Particulas.jsx, IconoCorazon.jsx
  styles/global.css           ← variables CSS y animaciones
public/images, public/audio   ← tus fotos y tu canción
```

## 6. Accesibilidad

Botones reales con etiquetas, navegación por teclado (flechas ← → en el carrusel, Tab/Enter en corazón, sello y sonido), áreas táctiles de 44 px o más, y si el dispositivo pide *reducir movimiento*, las animaciones se acortan y las partículas se ocultan.
