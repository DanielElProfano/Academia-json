const express = require('express');
const passport = require('passport');
const Professor = require('../models/Professor');
const Subject = require('../models/Subject');
const router = express.Router();

router.post('/logout', (req, res, next) => {
    if(req.user){
            req.logout();
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                return res.status(200).json({message: 'Logout successful'});
            })
    }else{
        return res.sendStatus(403);
    }
})
router.post('/', async (req, res, next) =>{
    
    passport.authenticate('login', (error, user) => { 
        if(error) {
            return res.status(403).json({message: 'user not found'})
        }
        req.logIn(user, (error) => {
            if (error) {
              return res.json(error);
            }
            delete user.password;
            return res.status(200).send(req.user)
      });
    })(req, res, next);
});
router.get('/checkSession', async(req, res, next) => {
    try{
        if(req.user){
            return res.status(200).json(req.user); 
        }else{
            return res.status(403).json({message: 'user not found'})
        }
    }catch(error){
        next(error);
    }
})

module.exports = router;