require('dotenv').config();
const cors = require('cors');
const { response } = require('express');
const express = require('express');

const {dbConnection} = require('./database/config');


//crear el servidor de express
const app = express();
//configurar CORS (Midleware) 
app.use(cors());
//llamar a la BDD
dbConnection();

//rutas

app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola mundo'
    })
});

//puerto

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto_:'  + process.env.PORT);

});

