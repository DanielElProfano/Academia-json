const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const professorSchema = new Schema(
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
            min:10,
            max: 65
        },
        rol: {
            enum: ['admin', 'professor','default'],
            type: String,
            default: 'professor',
            required: true
        },
        education: {
            type: [String],
            required: true,
        },
        courses: [{
            type: mongoose.Types.ObjectId,
            ref: 'courses'
        }],
        subjects: [{
            type: mongoose.Types.ObjectId,
            ref: 'subjects'

        }]
        
    },
    { timestamps: true }

);

const Professor = mongoose.model('professors', professorSchema); 
module.exports = Professor;