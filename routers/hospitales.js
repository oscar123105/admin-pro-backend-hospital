/*
Ruta: /api/hospitales
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getHospitales, crearHospitales, actualizarHospitales,deleteHospitales } = require('../controllers/hospitales');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.get('/',validarJWT, getHospitales);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ]
    , crearHospitales);

router.put('/:id',validarJWT,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ]
    , actualizarHospitales);

router.delete('/:id',validarJWT, deleteHospitales);

module.exports = router;
