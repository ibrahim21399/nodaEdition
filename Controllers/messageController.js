
const Model = require("./../Models/messageModel");
const Student = require("./../Models/studentModel");
const Teacher = require("./../Models/teacherModel");

//getAll
module.exports.getAll =(request, response, next) => {
  console.log("get all messages");

  Model.find({teacher:request.params.teachId,student:request.params.stdId}).then((data) => {
      if (data.length == 0) throw new error("No data");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

 
//send message 
module.exports.SendMessage = (request, response, next) => {
  console.log("SendMessage");
  console.log(request.body);


    const newMessage = new Model({
      student:request.body.student,
      teacher:request.body.teacher,
      message:request.body.message,
      isTeacher:request.body.isTeacher
    });
    newMessage.save().then((data) => {
        response.status(201).json({ message: "sent", data });
        console.log("sent");
      })
      .catch((error) => {
        next(error);
        console.log(error + "");
      });
  return newMessage;

};

