require('dotenv').config();
const cors = require('cors');
const { response } = require('express');
const express = require('express');
const {dbConnection} = require('./database/config');


//crear el servidor de express
const app = express();
//configurar CORS (Midleware) 
app.use(cors());
//lectura y parseo del body
app.use(express.json());
//llamar a la BDD
dbConnection();

//rutas

app.use('/api/usuarios', require('./routers/usuarios'));
app.use('/api/hospitales', require('./routers/hospitales'));
app.use('/api/medicos', require('./routers/medicos'));
app.use('/api/todo', require('./routers/busquedas'));
app.use('/api/upload', require('./routers/uploads'));
app.use('/api/login', require('./routers/auth'));

//puerto

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto_:'  + process.env.PORT);

});

