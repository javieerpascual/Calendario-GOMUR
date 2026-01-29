# 🚴 Calendario GOMUR 2026 - Equipo Ciclista Sub-23

Calendario interactivo y moderno para el equipo ciclista GOMUR, diseñado para visualizar y filtrar las carreras de la temporada 2026.

## 📋 Características

- **Visualización de tarjetas**: Diseño limpio y atractivo para cada carrera.
- **Filtros dinámicos**: Filtra por torneo (Euskaldun, Lehendakari, etc.) usando chips interactivos.
- **Buscador**: Encuentra torneos rápidamente.
- **Diseño Responsive**: Adaptado a móviles y escritorio.
- **Datos JSON**: Fácil de actualizar mediante el archivo `data/races.json`.

## 🛠️ Tecnologías

- HTML5
- CSS3 (Variables, Grid, Flexbox, Animaciones)
- JavaScript (Vanilla, ES6+)
- Google Fonts (Inter)

## 🚀 Cómo ejecutar en local

Debido a que el proyecto utiliza `fetch` para cargar los datos del archivo JSON, es necesario ejecutarlo a través de un servidor web local para evitar restricciones de seguridad del navegador (CORS).

### Opción 1: Python (Recomendado)

Si tienes Python instalado:

1.  Abre una terminal en la carpeta del proyecto.
2.  Ejecuta:
    ```bash
    python -m http.server 8000
    ```
3.  Abre tu navegador en: `http://localhost:8000`

### Opción 2: VS Code Live Server

1.  Instala la extensión "Live Server" en VS Code.
2.  Haz clic derecho en `index.html`.
3.  Selecciona "Open with Live Server".

## 📝 Gestión de Datos

Para añadir o modificar carreras, edita el archivo `data/races.json`.
Formato:

```json
{
    "id": "unique-id",
    "tournament": "category-id",
    "tournamentLabel": "Nombre del Torneo",
    "title": "Nombre de la Carrera",
    "date": "YYYY-MM-DD",
    "location": "Lugar",
    "organizer": "Organizador",
    "color": "#hexcode"
}
```
