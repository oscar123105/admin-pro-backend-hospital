const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');




//obtener todas las busquedas
const getTodo = async (req, res) => {

    const busqueda = req.params.busqueda;
    const regex = await RegExp(busqueda, 'i');

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),

    ]);


    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales

    })
};

//obtener todas las busquedas por colecciones
const getDocumentosColeccion = async (req, res) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = await RegExp(busqueda, 'i');

    let data = [];
    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex }).populate('usuario', 'nombre img').populate('hospital', 'nombre img');
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex }).populate('usuario', 'nombre img');
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex })
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La coleccion debe ser medicos/hospitales/usuarios'
            });
    }
    res.json({
        ok: true,
        resultado: data

    })
};

module.exports = {
    getTodo,
    getDocumentosColeccion
};