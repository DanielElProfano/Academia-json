const express= require('express');
const Course = require('../models/Course');
const Subject = require('../models/Subject')
const Professor = require('../models/Professor');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const auth = require('../middleware/authenticated.middleware');
const router = express.Router();

router.post('/create', [auth.isAdmin], async(req, res, next) =>{ //seleccionar asignaturas a un curso existente
    const { name } = req.body
    const newCourse = new Course({ name })
    const addCourse = await newCourse.save();  //creamos un curso nuevo
    return res.status(201).json(addCourse)
})

router.get('/', [auth.isAdmin], async(req, res, next) => {
    return res.status(200).render('course/createCourse');
})

router.get('/show', [auth.isAdmin], async (req, res, next) =>{
    try{
        courses = await Course.find().populate('professors').populate('students');
        return res.status(200).json(courses);
    }catch(error){
        next(error);
    }
})

router.get('/:id/delete', [auth.isAdmin], async(req, res, next) => {
    try{
        const id = req.params.id
        await Course.findByIdAndDelete(id);
        const allProfessors = await Professor.find({ courses : id }).lean()  // prfessor
        // response.forEach(async element => { //array con tosos los profesores que imparten ese curso
        //     const idProfessorToDelete= JSON.stringify(element._id); //consigo el id de los prfessor a borrar
        //     const idProfessor = idProfessorToDelete.slice(1,idProfessorToDelete.length-1); //casteo para que sea válido el ID
        //     const ObjectID = mongoose.Types.ObjectId(idProfessor); //construyo el objeto ID
        //     const allProfessors = await Professor.find({courses : ObjectID}) //muestra todos los profesores que imparten esa asignatura
            allProfessors.forEach(async element => {  //itero por todos los profesores
                const deleteSubject = await Professor.updateOne(
                {_id :element._id }, 
                {$pull:{courses : id}}, 
                {new: true})     
            })
        
        ObjectID = mongoose.Types.ObjectId(id)
        const allStudents = await Student.find({courses : ObjectID}) //muestra todos los alumnos que reciben este curso
        allStudents.forEach(async element => {  //itero por todos los alumnos
        const deleteCourse = await Student.updateOne(
                {_id :element._id }, 
                {$pull:{courses : id}}, 
                {new: true})     
            })
        // const response2 = await Subject.deleteMany({ course : id })
        return res.json("File delete suscessfully");
    }catch(error){
        next(error);
    }
})

router.get('/addsubject/:id', [auth.isAdmin], async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findById(id);
    const hola = course.subjects.length;
    res.json(course)
})


router.post('/addProfessor/:idProf/:idCourse', [auth.isAdmin], async(req, res, next) => {
    try{
        const {idProf, idCourse } = req.params;
        const professors = await Professor.findByIdAndUpdate(idProf,{$addToSet: {courses: idCourse}});
        const addProfessorToCourse = await Course.findByIdAndUpdate(idCourse, {$addToSet:{professors: idProf}})
        res.json(professors);
    }catch(error){
        next(error);
    }
});
router.post('/addStudent/:idStudent/:idCourse', [auth.isAdmin], async(req, res, next) => {
    try{
        const {idStudent, idCourse } = req.params;
        const professors = await Student.findByIdAndUpdate(idStudent,{$addToSet: {courses: idCourse}});
        const addProfessorToCourse = await Course.findByIdAndUpdate(idCourse, {$addToSet:{students: idStudent}})
        res.json(professors);
    }catch(error){
        next(error);
    }
});





module.exports = router;
