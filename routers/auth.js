/*
Ruta: /api/login
*/
const { Router } = require('express');
const { login,googleSignIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/',
    [
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
      
    ]
    , login);

    // login google
    router.post('/google',
    [
        check('token', 'El token es obligatorio').not().isEmpty(),
        validarCampos,
    ]
    , googleSignIn);

    //renovar token 
    router.get('/renew', validarJWT,renewToken);


module.exports = router;
