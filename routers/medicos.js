/*
Ruta: /api/medicos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getMedicos, crearMedicos, actualizarMedicos,deleteMedicos } = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.get('/',validarJWT, getMedicos);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital debe ser valido').isMongoId(),
        validarCampos,
    ]
    , crearMedicos);

router.put('/:id',validarJWT,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital debe ser valido').isMongoId(),
        validarCampos,
    ]
    , actualizarMedicos);

router.delete('/:id',validarJWT, deleteMedicos);

module.exports = router;
