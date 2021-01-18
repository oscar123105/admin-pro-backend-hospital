const { response, json } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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
        if (!validarPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'contraseñas incorrectas'
            });
        }

        //Generar el TOKEN-JWT
        const token = await generarJWT(usuarioDB.id);

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

const googleSignIn = async (req, res = response) => {


    const googleToken = req.body.token

    try {
        const { name, email, picture } = await googleVerify(googleToken);
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            //si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@@@',
                img: picture,
                google: true
            });
        } else {
            //existe el usuario
            usuario = usuarioDB;
            usuario.google = true;
        }
        //guardar en base de datos
        await usuario.save();

        //Generar el TOKEN-JWT
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            msg: 'Token que viene de google',
            //name, email, picture
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'el token no es valido'
        });
    }
}

module.exports = {
    login,
    googleSignIn
};