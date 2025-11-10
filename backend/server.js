const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// CRÍTICO: Azure usa process.env.PORT
const PORT = process.env.PORT || 8080;

// Variables de entorno
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const DB_CONNECTION = process.env.DATABASE_URL || 'local-db';

// Middleware
app.use(express.json());

// Servir frontend estático (build de React)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Cargar "base de datos" desde archivo si existe, con fallback en memoria
const dbFilePath = path.join(__dirname, 'database', 'db.json');
let dbData;
try {
    if (fs.existsSync(dbFilePath)) {
        const raw = fs.readFileSync(dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        const fileUsers = Array.isArray(parsed.users) ? parsed.users : [];
        const ensured = fileUsers.slice(0, 2);
        while (ensured.length < 2) {
            ensured.push({ id: ensured.length + 1, name: ensured.length === 0 ? 'Admin' : 'User', role: ensured.length === 0 ? 'admin' : 'user' });
        }
        dbData = { users: ensured };
    } else {
        dbData = {
            users: [
                { id: 1, name: 'Admin', role: 'admin' },
                { id: 2, name: 'User', role: 'user' }
            ]
        };
    }
} catch (error) {
    console.error('Error cargando db.json, usando datos por defecto:', error);
    dbData = {
        users: [
            { id: 1, name: 'Admin', role: 'admin' },
            { id: 2, name: 'User', role: 'user' }
        ]
    };
}

/**
 * Endpoint de verificación de salud del servidor.
 * Proporciona información sobre el estado del servidor, entorno, base de datos y tiempo de actividad.
 *
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} JSON con el estado del servidor.
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString(),
        database: DB_CONNECTION ? 'Connected' : 'Disconnected',
        uptime: process.uptime()
    });
});

/**
 * Endpoint de información de la aplicación.
 * Proporciona detalles sobre la aplicación, versión, entorno y autores.
 *
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} JSON con información de la aplicación.
 */
app.get('/api/info', (req, res) => {
    res.json({
        app: 'TP05 CI/CD Pipeline',
        version: '1.0.0',
        environment: ENVIRONMENT,
        author: 'Kevin y Octavio'
    });
});

/**
 * Endpoint de diagnóstico para la base de datos.
 * Devuelve la ruta del archivo de base de datos y la lista de usuarios actuales.
 *
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} JSON con la ruta del archivo y los usuarios.
 */
app.get('/api/debug/db', (req, res) => {
  res.json({
    filePath: dbFilePath,
    users: dbData.users
  });
});

/**
 * Endpoint para obtener la lista de usuarios.
 * Lee los usuarios desde el archivo de base de datos y los normaliza.
 *
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Array} JSON con la lista de usuarios normalizados.
 */
app.get('/api/users', (req, res) => {
    let sourceUsers = dbData.users;
    try {
        // Releer el archivo en cada request para evitar artefactos antiguos
        if (fs.existsSync(dbFilePath)) {
            const raw = fs.readFileSync(dbFilePath, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.users) && parsed.users.length > 0) {
                sourceUsers = parsed.users;
            }
        }
    } catch (e) {
        console.error('Error leyendo db.json en /api/users:', e);
    }

    const normalizedUsers = (sourceUsers || []).map((u, idx) => ({
        id: typeof u.id === 'number' ? u.id : idx + 1,
        name: u.name || 'User',
        role: u.role && String(u.role).trim() !== '' ? u.role : 'user'
    }));
    res.json(normalizedUsers);
});

/**
 * Endpoint para crear un nuevo usuario.
 * Agrega un usuario a la lista en memoria con un ID único.
 *
 * @param {Object} req - Objeto de solicitud de Express. Espera { name: string, role: string } en el body.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} JSON con el nuevo usuario creado.
 */
app.post('/api/users', (req, res) => {
    const newId = dbData.users.length > 0 ? Math.max(...dbData.users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newId,
        name: req.body.name || "User",
        role: req.body.role || "user"
    };
    dbData.users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * Endpoint para eliminar un usuario por ID.
 * Busca y elimina el usuario de la lista en memoria.
 *
 * @param {Object} req - Objeto de solicitud de Express. Parámetro :id en la URL.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Respuesta 204 si se elimina, 404 si no se encuentra.
 */
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const numId = parseInt(id, 10);
    const userIndex = dbData.users.findIndex(u => u.id === numId);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    dbData.users.splice(userIndex, 1);
    res.status(204).send();
});

// Ruta principal (frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Catch-all para SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${ENVIRONMENT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});
