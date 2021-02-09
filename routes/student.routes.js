const express = require('express');
const passport = require('passport');
const Student = require('../models/Student');
const Course = require('../models/Course')
const fileMiddleware = require('../middleware/file.middleware');
const auth = require('../middleware/authenticated.middleware');

// const { updateOne } = require('../models/Course');
const router = express.Router();

router.get('/', [auth.isAdmin], async(req, res, next) => {
    const courses = await Course.find();
    return res.status(200).render('student/createStudent', { courses });
});

router.post('/create',  [auth.isAdmin, fileMiddleware.upload.single('photo'),fileMiddleware.uploadImage], async(req, res, async) =>{
    passport.authenticate('registerStudent', (error, user) => {
        if(error){
            return res.render('error', {error, tittle: "Error"});
        }
        return res.json(user);
    })(req);
})

router.get('/show', [auth.isAdmin], async(req, res, next) => {
    try{
       
        const allStudents = await Student.find({}, {password: 0}).populate('courses');
        return res.status(200).json(allStudents);
    }catch(error){
        next(error)
    }
})

router.get('/:id/modify/', [auth.isAdmin], async(req, res, next) => {
    try{
        const id = req.params.id;
        const student = await Student.findById(id).populate('courses');
        res.status(200).json(student);
    }catch(error){
        next(error);
    }
})

router.post('/modify/', [auth.isAdmin], [fileMiddleware.upload.single('photo')], async(req, res, next) => {
    try{

        const student = await Student.findByIdAndUpdate(req.body._id, req.body, {new : true});
        return res.status(200).json(student)
    }catch(error){
        next(error);
    }
})

router.get('/:id/delete', [auth.isAdmin], async (req, res, next) => {
    try{
        const id = req.params.id;
        const courses = await Student.findById(id);
        idCourse = [...courses.courses]
        idCourse.forEach(async element => {
            const deleteStudentInCourse = await Course.updateOne(  //borra el alumno del curso
                {_id : idCourse},
                {$pull: { students : id}},
                {new : true})
       });
        await Student.findByIdAndDelete(id);
        return res.status(200).redirect('/student/show')
    }catch(error){
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try{
        const id = req.params.id;
        const student= await Student.findById(id).populate('courses');
        return res.status(200).render('student/showStudent', { student }); 
    }catch(error){
        next(error);
    }
});

router.get('/:id/falta', [auth.isProfessor], async (req, res, next) => {
    try{
        const id = req.params.id;
        const falta = await Student.findByIdAndUpdate(
            {_id: id}, 
            {$push: {faltas : new Date()}},
            {new : true})
        return res.json(falta)
    }catch(error){
        next(error);
    }
});


module.exports = router;