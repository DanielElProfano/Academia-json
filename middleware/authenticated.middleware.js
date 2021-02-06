const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/login');
    }
}

const isAdmin = (req, res, next) => {
    if(req.user.rol === 'admin') {
        return next();
    } else {
        const error = new Error('No tiene permisos de Administrador')
        return res.status(403).render('error', { error });
    }
}
const isProfessor = (req, res, next) => {
    const { rol } = req.user;
    if(rol === 'professor' || rol === 'admin') {
        return next();
    } else {
        const error = new Error('No tiene permisos');
        return res.status(403).render('error', { error });
    }
}
const isStudent = (req, res, next) => {
    const { rol } = req.user;
    if(rol === 'student' || rol === 'admin'){
        return next();
    } else {
        return res.redirect('/');
    }
}

module.exports = {
    isAuthenticated,
    isAdmin,
    isProfessor,
    isStudent
}