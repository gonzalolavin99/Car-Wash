import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Verificar la conexión
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectar a la base de datos:', err.stack);
    }
    if (client) {
        client.query('SELECT NOW()', (err, result) => {
            release();
            if (err) {
                return console.error('Error ejecutando consulta:', err.stack);
            }
            console.log('Conexión a la base de datos establecida exitosamente.');
            console.log('Hora actual del servidor:', result.rows[0].now);
        });
    } else {
        console.error('No se pudo obtener un cliente de la pool');
    }
});

// Manejar errores de conexión
pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de la base de datos', err);
    process.exit(-1);
});

export default pool;