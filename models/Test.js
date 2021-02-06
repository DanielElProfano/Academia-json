const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSquema = new Schema({
    date: {
        type: [date],
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'courses', 
    }
  },
    {timestamps : true}
 )

const Test = mongoose.model('test', testSquema); 
module.exports = Test;