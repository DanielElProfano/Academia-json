const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema(
     {
        name: {
                type: String,
                required: true
            },
        lastName: {
                type: String,
                required: true
        },
        mail: {
                type: String,
                required: true
        },
        password: {
                type: String,
                required: true
        },
        photo: {
                type: String,
                
        },
        age: {
            type: Number,
            min:14,
            max: 65
        },
        rol: {
            enum: ['admin', 'professor','default'],
            type: String,
            default: 'default',
            required: true
        },
        courses: [{
            type: mongoose.Types.ObjectId,
            ref: 'courses'
        }],
        faltas:{
            type: [Date],
        }
    },
    { timestamps: true }

);

const Student = mongoose.model('students', studentSchema); 
module.exports = Student;