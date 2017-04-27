const express = require('express'),
      jwt = require('jsonwebtoken'),
      router = express.Router(),
      User = require('../models/User'),
      bodyParser = require('body-parser'),
      logger = require('morgan');

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());
router.use(logger('dev'));

/*-----------------------------------CHECK PROVIDED TOKEN-------------------------------------------*/
router.use('/jwt',(req,res,next) =>{
   const token = req.body.token || req.query.token || req.headers['authorization'];
   if(token){
      jwt.verify(token,superSecret,{algorithm: 'HS512' } ,(err,decoded)=>{
         if(err){
            return res.send({success : false, message : 'Failed to authenticate token'});
         }else{
            req.decoded = decoded;
            next();
         }
      });
   }else{
      return res.status(403).send({success : false,message : 'No token provided'});
   }
});
/*---------------------------------------------------------------------------------------------------*/
/*-------------------------------------------LOGIN---------------------------------------------------*/
router.post('/login',(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
    User.findOne({'email' : email},(err,user) =>{
      if(err){
         return res.status(500).send();
      }
      if(!user){
         return res.status(404).send();
      }
      user.comparePassword(password,(err,isMatch) =>{
          if(isMatch && isMatch == true){
             const user_id = user._id;
             const email = user.email;
             const tokenData = {
                email
             };
             const token = jwt.sign(tokenData,superSecret, {algorithm: 'HS512' } , {
                expiresIn : 60*60*24
            });
            return res.status(200).send();
          }else{
             return res.status(401).send();
          }
      });
    });
});
/*---------------------------------------------------------------------------------------------------*/
/*-------------------------------------------REGISTER------------------------------------------------*/
router.post('/register',(req,res)=>{
  const newUser = new User();
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  newUser.save((err,savedUser) =>{
    if(err){
    return res.status(406).send();
   }else{
    return res.status(200).send();
   }
  });

});
/*---------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------*/
router.get('/jwt/checkToken' , (req,res) => {
  return res.status(200).send('It Works :)');
});
module.exports = router;
