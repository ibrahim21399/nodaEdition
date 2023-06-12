const jwt = require("jsonwebtoken");
const student = require("./../Models/studentModel");
const teacher = require("./../Models/teacherModel");
const admin = require("./../Models/adminModel");
const checkValidation = require("./../Middleware/checkValidationFn");
const bcrypt = require("bcrypt");

module.exports.login = async(request, response, next) => {

  //checkValidation(request);
  const email = request.body.email;
  let password = request.body.password;
  let loggedIn = false;

  let adminEmail ='admin@test.com';
  let adminpassword ='123456';
  if(email==adminEmail && password ==adminpassword){
      let token = jwt.sign({
          role: "admin",
          name:'admin',
      },
      process.env.key, { expiresIn: "1h" });
  response.status(200).json({ message: "admin logged in successfully", token });
  loggedIn = true;
  }


  // check if it's the admin
  if (!loggedIn) {
      await admin.findOne({email: email}).then(async(data) => {
          console.log("Admin");
          if (data) {
              await bcrypt.compare(password, data.password, (err, result) => {
                  if (result) {
                      let token = jwt.sign({
                              role: "admin",
                              _id:data.id,
                              name:data.name,
                          },
                          process.env.key, { expiresIn: "1h" });
                      response.status(200).json({ message: "admin logged in successfully", token });
                      loggedIn = true;
                  } else {
                      response.status(400).json({message: "Email or password incorrect"});
                  }
              });
          }
          console.log("admin");
      }).catch(error => next(error));
  } 
  if (!loggedIn) {
      await student.findOne({
          email: email,
      }).then(async(data) => {
          if (data) {
              if(data.Active==true){
                  await bcrypt.compare(password, data.password, (err, result) => {
                      if (result) {
                          let token = jwt.sign({
                                  role: "student",
                                  _id:data.id,
                                  name:data.name,
                              },
                              process.env.key, { expiresIn: "1h" });
                          response.status(200).json({ message: "student logged in successfully", token });
                          loggedIn = true;
                      } else {
                          response.status(400).json({message: "Email or password incorrect"});
                      }
                  });
              }else{
                  response.status(400).json({message: "This acount has been blocked"});
              }
             
          }
          console.log("std-");
      }).catch(error => next(error));
  }
 if (!loggedIn) {
          await teacher.findOne({
              email: email
          }).then(async data => {
              if (data) {
                  console.log(data.Active);
                  if(data.Active==true){
                      await bcrypt.compare(password, data.password, (err, result) => {
                          if (result) {
                              let token = jwt.sign({
                                      role: "teacher",
                                      _id:data.id,
                                      name:data.name,
                                  },
                                  process.env.key, { expiresIn: "1h" });
                              response.status(200).json({ message: "teacher logged in successfully" , token });
                              loggedIn = true;
                          } else {
                              response.status(404).json({message: "Email or password incorrect"});
                          }
                      });
                  }else{
                      response.status(400).json({message: "waiting For Admin Approve Your Account"});

                  }

              }
          }).catch(error => next(error));
      }
  }