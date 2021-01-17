const { response } = require('express');
const bcrypt = require('bcryptjs');
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');




//obtener todos los medicos 
const getMedicos = async (req, res) => {

    const medicos = await Medico.find().populate('usuario','nombre').populate('hospital','nombre');

    res.json({
        ok: true,
        medicos
        
    })
};
//crear un medico 
const crearMedicos = async (req, res = response) => {

    const uid= req.uid;

    try {
        const medico = new Medico({
            usuario: uid,
            ...req.body
        });


        const medicoDB= await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }

};

//actualizar un medico
const actualizarMedicos = async (req, res = response) => {

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

//borrar medicos
const deleteMedicos = async (req, res = response) => {

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
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    deleteMedicos
};