const { Schema, model, SchemaTypes } = require('mongoose');
const HospitalSchema = Schema({
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
    }
    //para setear el nombre de la colleccion en MongoDB 
}, { collection: 'hospitales' });

HospitalSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);