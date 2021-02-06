const express = require('express');
const passport = require('passport');
const router = express.Router();
const Professor = require('../models/Professor');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Course = require('../models/Course');
const fileMiddleware = require('../middleware/file.middleware');
const auth = require('../middleware/authenticated.middleware');


router.get('/',  async(req, res, next) => {
    res.status(200).render('professor/createProfessor')
})

router.post('/create', [auth.isAdmin, fileMiddleware.upload.single('photo'), fileMiddleware.uploadImage],async(req, res, next) => {
    passport.authenticate('registerProfessor', (error, user) => {
        if(error){
            return res.status(403).json(error);
        }
        return res.status(201).json(user);
    })(req, res, next);
})

router.get('/choose', [auth.isAdmin], async(req, res, next) => { //inscribe en el curso todos los p
    try{
        const { id, name } = req.query;
        let hasProfessor = false;
        const professors = await Professor.find({education : name}); //busca todos los profesores que dan la asignatura pasada en NAME
        if(professors.length){
            hasProfessor = true;
        }
        professors.forEach(element => { 
            element._doc = {...element._doc, subject : name, idSubject : id}
            })
         res.status(200).render('addSubjectToProfessor', {professors, hasProfessor});   
        }
    catch(error){
        next(error);
    }
})

router.get('/addsubject', [auth.isAdmin], async(req, res, next) => {
    try{
        const {idProf, idSub, name } = req.query;
        const professors = await Professor.findByIdAndUpdate(idProf,{$addToSet: {subjects: idSub}}).populate('subjects');
        const addProfessorToSubject = await Subject.findByIdAndUpdate(idSub, {$addToSet:{professors: idProf}})
        res.json(professors);
    }catch(error){
        next(error);
    }
});

router.get('/show', [auth.isProfessor], async(req, res, next) => {
    try{
        const allProfessors = await Professor.find({}, {password: 0}).populate('courses');
        res.status(200).json(allProfessors);
    }catch(error){
        next(error);
    }
});

router.get('/:id/modify/', [auth.isAdmin], async(req, res, next) => {
    try{
        const id = req.params.id;
        const professor = await Professor.findById(id, {password: 0}).populate('courses');
        return res.status(200).json(professor);

    }catch(error){
        next(error);
    }
})

router.post('/modify/', [auth.isAdmin], async(req, res, next) => {
    try{
        
        // const id = req.body._id;
        const professor = await Professor.findByIdAndUpdate(req.body._id, req.body,
        {new : true});
        res.status(200).json(`professor`);

    }catch(error){
        next(error);
    }
})

router.get('/:id/delete',[auth.isAdmin], async(req, res, next) => {
    try{
        const id = req.params.id
        await Professor.findByIdAndDelete(id);
        const response = await Subject.find({ professors : id }).lean()  // subjects
        response.forEach(async element => {
            const idSubjectToDelete = JSON.stringify(element._id); //consigo el id de la asignatura que imparte
            const IdSubject = idSubjectToDelete.slice(1,idSubjectToDelete.length-1); //casteo para que sea válido el ID
            const ObjectID = mongoose.Types.ObjectId(IdSubject); //construyo el objeto ID
            const deleteSubject = await Subject.updateOne(
                    {_id : element._id }, 
                    {$pull:{professors : id}}, 
                    {new: true})     
            })
        return res.json("File delete suscessfully");
        }catch(error){
            next(error);
        }
    })

router.get('/:id/students', async(req, res, next) => { //recibe el id del profesor
    try{
        const array = [];
        const idProf = req.params.id;
        const professor = await Professor.findById(idProf);
        const students = false; //para no mostrar el campo de estudiantes
        const allSubjects = await Subject.find({professors : idProf }).distinct('course').lean();
        allSubjects.forEach(async element => {
            const course = await Course.findById(element._id);
            array.push(course)
        })
        return res.status(200).render('professor/showCourses', { array, professor, students });
    }catch(error){
        next(error);
    }
})

router.post('/:id/allstudents', async (req, res, next) => {    //muestra todos los alumnos de un curso
    const idProf = req.params.id;                               //impartido por el profesr
    const id = req.body.id;
    const students = true;
    const allStudents = await Student.find({ courses: id}).populate('courses');
    return res.status(200).render('professor/showCourses', { allStudents, students, idProf })
})

router.get('/allstudents', async (req, res, next) => {
    const { id, idProf } = req.query;
    
    const students = true;
    const allStudents = await Student.find({ courses: id}).populate('courses');
    return res.status(200).render('professor/showCourses', { allStudents, students , idProf})
})
router.get('')





module.exports = router;