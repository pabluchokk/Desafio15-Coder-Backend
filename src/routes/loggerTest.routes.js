import express from 'express'
import getLogger from '../helpers/logger.js'

const app = express()
const logger = getLogger(process.env.NODE_ENV || 'development')

app.get('/loggerTest', (req,res) => {
    logger.debug('Este es un mensaje de depuración');
    logger.info('Este es un mensaje informativo');
    logger.warn('Este es un mensaje de advertencia');
    logger.error('Este es un mensaje de error');

    res.send('Logs probados correctamente. Verifique la consola o los archivos de registro según el entorno.');
});

export default loggerTest;