# 🗑️ Santander Limpio

Dashboard en tiempo real del estado de los contenedores de basura de la ciudad de Santander.

**🌐 [santander.007090.xyz](https://santander.007090.xyz)**

![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white)

## Qué es

Una aplicación web que muestra en un mapa interactivo los **3.051 contenedores de residuos** de Santander, con datos en tiempo real proporcionados por el portal de datos abiertos del Ayuntamiento.

Los contenedores equipados con sensores muestran:
- **Nivel de llenado** (0-100%)
- **Temperatura** interna
- **Estado de conservación**
- **Última actualización** del sensor

## Funcionalidades

- **Mapa interactivo** con clustering de marcadores (Leaflet + MarkerCluster)
- **Filtros por tipo de residuo**: Orgánico, Envases, Papel/Cartón, Vidrio, Resto
- **Filtros por estado**: Todos, Con sensor, Llenos (>80%)
- **Código de colores** por nivel de llenado:
  - 🟢 Bajo (<40%)
  - 🟡 Medio (40-70%)
  - 🟠 Alto (70-90%)
  - 🔴 Lleno (>90%)
  - ⚫ Sin sensor
- **Auto-refresco** cada 2 minutos
- **Diseño responsive** (móvil y escritorio)
- **Tema oscuro** con estilo glassmorphism

## API de datos

Los datos provienen del portal **[datos.santander.es](http://datos.santander.es)** (Datos Abiertos del Ayuntamiento de Santander).

| Endpoint | Descripción | Elementos |
|----------|-------------|-----------|
| `residuos_contenedores` | Contenedores de basura con sensores | 3.051 |
| `residuos_papeleras` | Papeleras urbanas | 3.774 |
| `residuos_vehiculos` | Vehículos de recogida | 119 |

**Ejemplo de petición:**
```
GET http://datos.santander.es/api/rest/datasets/residuos_contenedores.json?items=50&page=1
```

La API es pública, sin autenticación, con licencia CC BY 4.0.

## Arquitectura

```
Usuario → Cloudflare (HTTPS) → Cloudflare Tunnel → Docker (Node.js :3000)
                                                          │
                                                          ├── GET / → index.html (frontend)
                                                          └── GET /api/contenedores → proxy → datos.santander.es
```

El backend en Express actúa como proxy hacia la API de Santander para evitar problemas de CORS en el navegador.

## Estructura del proyecto

```
santander-basuras/
├── server.js            # Servidor Express + proxy API
├── public/
│   └── index.html       # Frontend (mapa Leaflet + filtros)
├── Dockerfile           # Imagen Node.js Alpine
├── docker-compose.yml   # Configuración del contenedor
├── package.json
└── README.md
```

## Despliegue

### Requisitos

- Docker + Docker Compose
- Cloudflare Tunnel configurado

### Levantar el servicio

```bash
cd santander-basuras
docker compose up -d --build
```

### Conectar al tunnel de Cloudflare

1. Conectar la red Docker al contenedor del tunnel:
```bash
docker network connect santander-net <tunnel-container>
```

2. Añadir la regla de ingress en la configuración del tunnel:
```json
{
  "hostname": "santander.007090.xyz",
  "service": "http://santander-basuras:3000"
}
```

3. Crear registro CNAME en Cloudflare:
   - **Name:** `santander`
   - **Target:** `<tunnel-id>.cfargotunnel.com`
   - **Proxy:** Activado

### Desarrollo local

```bash
npm install
node server.js
# Abre http://localhost:3000
```

## Licencia

Los datos son propiedad del Ayuntamiento de Santander, publicados bajo licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
