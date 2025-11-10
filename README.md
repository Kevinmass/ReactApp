# ReactApp - TP05 CI/CD Pipeline

## Descripción

Esta aplicación es un proyecto de ejemplo para demostrar un pipeline de CI/CD completo. Consiste en un frontend desarrollado en React y un backend en Node.js con Express. La aplicación permite gestionar usuarios básicos (crear, leer y eliminar) y muestra el estado de salud del servidor.

## Características

- **Frontend**: Interfaz de usuario en React para gestionar usuarios.
- **Backend**: API REST en Node.js/Express para operaciones CRUD de usuarios.
- **Base de datos**: Almacenamiento en memoria con respaldo en archivo JSON.
- **CI/CD**: Configurado para despliegue en Azure Pipelines.
- **Health Check**: Endpoint para verificar el estado del servidor.

## Tecnologías Utilizadas

- **Frontend**: React, JavaScript
- **Backend**: Node.js, Express
- **Base de datos**: JSON (simulada)
- **Despliegue**: Azure Pipelines, Docker (opcional)

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd ReactApp
   ```

2. Instala las dependencias del backend:
   ```bash
   npm install
   ```

3. Instala las dependencias del frontend:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Ejecución en Desarrollo

1. Construye el frontend:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. Inicia el servidor:
   ```bash
   npm start
   ```

3. Abre tu navegador en `http://localhost:8080` (o el puerto configurado).

### Ejecución con Docker (Opcional)

Si tienes Docker configurado, puedes usar los scripts en el directorio Spectre para ejecutar la aplicación completa.

## API Endpoints

### Health Check
- **GET** `/api/health`: Devuelve el estado del servidor, entorno, timestamp y uptime.

### Información de la App
- **GET** `/api/info`: Proporciona detalles de la aplicación, versión y autores.

### Usuarios
- **GET** `/api/users`: Obtiene la lista de todos los usuarios.
- **POST** `/api/users`: Crea un nuevo usuario. Body: `{ "name": "string", "role": "string" }`
- **DELETE** `/api/users/:id`: Elimina un usuario por ID.

### Debug
- **GET** `/api/debug/db`: Devuelve información de diagnóstico de la base de datos.

## Estructura del Proyecto

```
ReactApp/
├── backend/
│   ├── server.js          # Servidor Express principal
│   └── database/
│       └── db.json        # Archivo de base de datos JSON
├── frontend/
│   ├── src/
│   │   ├── App.js         # Componente principal de React
│   │   └── ...            # Otros archivos de React
│   └── build/             # Archivos construidos para producción
├── azure-pipelines.yml    # Configuración de CI/CD para Azure
├── package.json           # Dependencias del backend
└── README.md              # Este archivo
```

## Funciones Documentadas

### Backend (server.js)

- **app.get('/api/health')**: Endpoint de verificación de salud del servidor. Proporciona información sobre el estado del servidor, entorno, base de datos y tiempo de actividad.
  - Entrada: req (Object), res (Object)
  - Salida: JSON con estado del servidor

- **app.get('/api/info')**: Endpoint de información de la aplicación. Proporciona detalles sobre la aplicación, versión, entorno y autores.
  - Entrada: req (Object), res (Object)
  - Salida: JSON con información de la aplicación

- **app.get('/api/debug/db')**: Endpoint de diagnóstico para la base de datos. Devuelve la ruta del archivo de base de datos y la lista de usuarios actuales.
  - Entrada: req (Object), res (Object)
  - Salida: JSON con ruta del archivo y usuarios

- **app.get('/api/users')**: Endpoint para obtener la lista de usuarios. Lee los usuarios desde el archivo de base de datos y los normaliza.
  - Entrada: req (Object), res (Object)
  - Salida: Array JSON con lista de usuarios normalizados

- **app.post('/api/users')**: Endpoint para crear un nuevo usuario. Agrega un usuario a la lista en memoria con un ID único.
  - Entrada: req (Object con body {name, role}), res (Object)
  - Salida: JSON con nuevo usuario creado

- **app.delete('/api/users/:id')**: Endpoint para eliminar un usuario por ID. Busca y elimina el usuario de la lista en memoria.
  - Entrada: req (Object con param :id), res (Object)
  - Salida: Respuesta 204 si elimina, 404 si no encuentra

### Frontend (App.js)

- **App()**: Componente principal de la aplicación React. Gestiona el estado de usuarios, salud del servidor y errores. Permite crear y eliminar usuarios a través de la interfaz.
  - Entrada: Ninguna
  - Salida: JSX.Element renderizado

- **fetchHealth()**: Función asíncrona para obtener el estado de salud del servidor. Realiza una petición GET a /api/health y actualiza el estado.
  - Entrada: Ninguna
  - Salida: Actualiza estado 'health' o 'error'

- **fetchUsers()**: Función asíncrona para obtener la lista de usuarios del servidor. Realiza una petición GET a /api/users y actualiza el estado.
  - Entrada: Ninguna
  - Salida: Actualiza estado 'users' o 'error'

- **handleCreateUser()**: Función asíncrona para crear un nuevo usuario. Envía una petición POST a /api/users con el nombre y rol del nuevo usuario. Actualiza la lista de usuarios y limpia los campos de entrada.
  - Entrada: Estados newUserName y newUserRole
  - Salida: Actualiza estado 'users', limpia newUserName y newUserRole, o establece 'error'

- **handleDeleteUser(id)**: Función asíncrona para eliminar un usuario por ID. Envía una petición DELETE a /api/users/:id y actualiza la lista de usuarios.
  - Entrada: id (number) del usuario
  - Salida: Actualiza estado 'users' o establece 'error'

## Contribución

1. Haz un fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## Autores

- Kevin
- Octavio
