const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//match un usuario
const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {

        //verificar email

        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email incorrectas'
            });
        }

        // verificar contraseña

        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validarPassword){
            return res.status(404).json({
                ok: false,
                msg: 'contraseñas incorrectas'
            });
        }

        //Generar el TOKEN-JWT
        const token = await  generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }
};

module.exports = {
    login
};