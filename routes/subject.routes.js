const express= require('express');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/authenticated.middleware');

router.get ('/', async(req, res, next) => { //recogera el nombre del curso. y la ID y lo desplegara en la pag.
    const { name , id } = req.query;
    return res.status(200).render('createSubject', { name, id });
})
router.post('/create', async(req, res, next) =>{ //asignar asigmaturas a un curso existente
    try{
        let array = [];

        const id = req.query.id  //Id del curso
        
        const { name, students, professors } = req.body
        const newSubject = new Subject({
            course : id,
            name,
            students : students ? students : [],
            professors : professors ? professors : []
        })
        const addSubject = await newSubject.save();

        const addSubjectToCourse = await Course.findByIdAndUpdate(id, 
                {$push: { subjects: addSubject._id}}); //pushea en el array subjects del modelo COURSE la asignatura.
        return res.status(201).render('createSubject', 
            {
                title : "Create subject",
                id
            })
    }catch(error){
        next(error);
    }
})

router.get('/show', async(req, res, next) =>{
    try{
        const subjects = await Subject.find();
        return res.status(200).render('showSubjects', { subjects })
    }catch(error){
        next(error);
    }
})
router.get('/subjects', async(req, res, next) => {  //muestra todos las asignaturas de un curso pasando la ID por Query param
    try{
    const id = req.query.id; //id del curso al que pertenecen las asignaturas.
    const subjects = await Subject.find({course: id}).populate('professors');
    const course = await Course.findById(id);
    return res.status(200).render('course/modifyCourse', { subjects , id, course});
    }catch(error){
        next(error);
    }
})

router.get('/:id/delete', async(req, res, next) => {  //borra asignaturas de un curso pasado por Id y vuelve a renderizar la pantalla
    try{
        const id = req.params.id;
        const idCourse = req.query.id;
        await Subject.findByIdAndDelete(id);
        const ObjectID = mongoose.Types.ObjectId(id);
        const deleteCourse = await Course.updateOne(
            {_id : idCourse},
            {$pull: {subjects : ObjectID}},
            {new: true})
        return res.status(200);
    }catch(error){
        next(error);
    }
})
router.get('/exam', async(req, res, next) => {  //borra asignaturs de un curso pasado por Id y vuelve a renderizar la pantalla
    try{
        const id = req.query.id;
        const allSubjects = await Course.findById(id).populate('subjects').populate('students');
        res.json(allSubjects)
    }catch(error){
        next(error);
    }
})

router.get('/test', [auth.isProfessor], async(req, res, next) =>{
    try{
        idCourse = req.query.id;
        const course = await Course.findById(id).populate('subject');
        

    }catch(error){
        next(error)
    }
})



module.exports = router;