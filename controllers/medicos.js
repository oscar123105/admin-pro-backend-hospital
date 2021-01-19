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
        const medicoDB = await Medico.findById(uid);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no existe con ese id'
            });
        }
        //actualizaciones

        const campos = req.body;

        const medicoActualizado = await Medico.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
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
        const medicoDB = await Medico.findById(uid);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no existe con ese id'
            });
        }
        //borrar
        const borrarMedico = await Medico.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Medico se elimino correctamente'
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