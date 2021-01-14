const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');




//obtener todos los usuarios 
const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })
};
//crear un usuario 
const crearUsuarios = async (req, res = response) => {

    //console.log(req.body);
    const { password, email } = req.body;
    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();
        //Generar el TOKEN-JWT
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }

};

//actualizar un usuario
const actualizarUsuarios = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe con ese id'
            });
        }
        //actualizaciones

        const campos = req.body;
        //validacion en caso de existir mail en bdd
        if (usuarioDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne({ email: req.body.email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con el email que esta actualizando'
                });

            }
        }
        delete campos.password;
        delete campos.google;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }
};

//borrar usuarios
const deleteUsuarios = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe con ese id'
            });
        }
        //borrar
        const borrarUsuario = await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario se elimino correctamente'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }
};


module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    deleteUsuarios
};