const fs = require('fs');
const path = require('path');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const Medico = require('../models/medico');




//subir Imagen
const fileUpload = async (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;


    const tipoValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tipoValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo debe ser: medicos/usuarios/hospitales'
        });
    }
    //id validos 
    /* const medicoDB = await Medico.findById(id);
    console.log('upload Controllers' + ' ' + medicoDB)
    if (!medicoDB) {
        return res.status(404).json({
            ok: false,
            msg: 'Usuario no existe con ese id'
        });
    } */

    //validar si existe o no el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    // procesar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');// wolverine.1.2.3.jpg
    // console.log(nombreCortado);
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    //console.log(extensionArchivo);

    //validar extensiones
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'La extension del archivo no es valido'
        });
    }
    //generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
    //path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;
    //mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err)

            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }
    });
    //Actualizar  base de datos

    actualizarImagen(tipo, id, nombreArchivo);


    res.json({
        ok: true,
        msg: 'Archivo subido',
        nombreArchivo

    })
};

//retorna imagen 

const retornaImagen =(req, res = response)=>{

    const tipo =req.params.tipo;
    const foto =req.params.foto;
    const pathImagen = path.join(__dirname,`../uploads/${tipo}/${foto}`);
 

    // imagen por defecto
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        const pathImagen = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile(pathImagen);
    }
}

module.exports = {

    fileUpload,
    retornaImagen
};