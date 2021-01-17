const { Schema, model, SchemaTypes } = require('mongoose');
const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    //relacion con la tabla usuario
    usuario: {
        required: true,
        type: SchemaTypes.ObjectId,
        ref: 'Usuario'
    },
     //relacion con la tabla Hospital
     hospital: {
        required: true,
        type: SchemaTypes.ObjectId,
        ref: 'Hospital'
    }
    //para setear el nombre de la colleccion en MongoDB 
}, { collection: 'medicos' });

MedicoSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Medico', MedicoSchema);