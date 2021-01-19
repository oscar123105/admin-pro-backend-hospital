const { response } = require('express');
const bcrypt = require('bcryptjs');
const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');




//obtener todos los hospitales 
const getHospitales = async (req, res) => {

    const hospitales = await Hospital.find().populate('usuario', 'nombre');

    res.json({
        ok: true,
        hospitales
    })
};
//crear un hospital 
const crearHospitales = async (req, res = response) => {

    const uid = req.uid;

    //console.log(req.body);
    const hospital = new Hospital(
        {
            usuario: uid,
            ...req.body
        });
    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }

};

//actualizar un hospital
const actualizarHospitales = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const hospitalDB = await Hospital.findById(uid);
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no existe con ese id'
            });
        }
        //actualizaciones
        const campos = req.body;
        const hospitalActualizado = await Hospital.findByIdAndUpdate(uid, campos, { new: true });
        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }
};

//borrar hospitales
const deleteHospitales = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const hospitalDB = await Hospital.findById(uid);
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no existe con ese id'
            });
        }
        //borrar
        const borrarHospital = await Hospital.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Hospital se elimino correctamente'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error inesperado revisar los logs"
        });
    }
};


module.exports = {
    getHospitales,
    crearHospitales,
    actualizarHospitales,
    deleteHospitales
};