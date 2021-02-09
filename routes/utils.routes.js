const express= require('express');
require('dotenv').config();
const Student = require('../models/Student')
const Course = require('../models/Course');
const router = express.Router();
const nodemailer = require('nodemailer');
const Professor = require('../models/Professor');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)

router.get('/:idStd/:from/mailform', async(req, res, next) => {
    try{
        // const { from, course } = req.query;
        const { idStd, from } = req.params; 
        const student = await Student.findById(idtd); 
        const professor = await Professor.findById(from);
        return res.status(200).render('professor/mailForm', { student, professor, course })
    }catch(error){
        next(error);
    }
});
router.post('/mail', async(req, res, next) => {
    const { from, to, subject, text } = req.body;
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com ',
        port: 465,
        auth: {
            user: 'pruebesitasparanode@gmail.com', //pruebesitasparanode Fullstack
            pass: 'Fullstack'
        }
    });
    
    let mailOptions = {
        from: 'pruebesitasparanode@gmail.com',
        to: 'pruebesitasparanode@gmail.com',
        subject, 
        text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return res.status(200).json('Email sended');

})
router.get('/sms', async(req, res, next) => {
   
    client.messages.create
        ({
            body: 'Hi there!', 
            from: '+18186865971', 
            to: '+686558335'
        })
        .then(message => console.log(message.sid));
        
})


module.exports = router;