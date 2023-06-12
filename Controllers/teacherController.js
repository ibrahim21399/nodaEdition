const Teacher = require("./../Models/teacherModel");
const Rating = require("./../Models/ratingModel");
const bcrypt = require("bcrypt");
const checkValidation = require("./../Middleware/checkValidationFn");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "teacherapp67@gmail.com",
    pass: "nryxzoxaeroptjfy",
  },
});

//getActiveTeachers
module.exports.getActiveTeachers = (request, response, next) => {
  console.log("get Active");
  Teacher.find({ Active: true })
    .then((data) => {
      console.log(data);

      if (data.length == 0) throw new error("No data");
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//getPendingTeachers
module.exports.getNotActiveTeachers = (request, response, next) => {
  console.log("get Not Active");
  Teacher.find({ Active: false })
    .then((data) => {
      if (data.length == 0) throw new error("No data");
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//getHighRateTeachers
exports.getHighRateTeachers = async (req, res, next) => {
  Teacher.find({})
    .sort({ averageRating: -1 })
    .then((data) => {
      if (data.length == 0) throw new error("No data");
      res.status(200).json({ data });
    })
    .catch((error) => next(error));
};
//getById
module.exports.getTeacherById = (request, response, next) => {
  Teacher.find({ _id: request.params.id })
    .populate({
      path: "studentEnrolled",
      select: "name email -_id",
    })
    .then((data) => {
      if (data.length == 0) throw new error("No data");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

//Update
module.exports.updateTeacher = (request, response, next) => {
  Teacher.updateOne(
    { _id: request.body._id },
    {
      $set: {
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        pricePerHour: request.body.pricePerHour,
        experienceYears: request.body.experienceYears,
        Latitude: request.body.Latitude,
        Longitude: request.body.Longitude,
        field: request.body.field,
        password: request.body.password,
      },
    }
  )
    .then((data) => {
      if (data.matchedCount == 0) throw new error("No Data!");
      response.status(200).json({ message: "updated", data });
    })
    .catch((error) => {
      next(error);
      console.log(error + "");
    });
};

//ChangeStatus
module.exports.activateTeacher = (request, response, next) => {
  console.log(request.params.id);
  Teacher.updateOne(
    { _id: request.params.id },
    {
      $set: {
        Active: true,
        AcceptanceDate: Date.now(),
      },
    }
  )
    .then((data) => {
      if (data.matchedCount == 0) throw new error("No Data!");
      else {
        Teacher.findById(request.params.id).then((data) => {
          const mailOptions = {
            from: "teacherapp67@gmail.com",
            to: data.email,
            subject: "Your account has been approved",
            text: "Congratulations! Your account has been approved.",
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        });
        response.status(200).json({ message: "updated", data });
      }
    })
    .catch((error) => {
      next(error);
      console.log(error + "");
    });
};

//Create
module.exports.registerTeacher = (request, response, next) => {
  // checkValidation(request)
  console.log(request);
  Teacher.findOne({ email: request.body.email })
    .then((data) => {
      if (data) {
        throw new Error("this email is already taken");
      }
      // encrypt the password
      bcrypt.hash(request.body.password, 10).then((hash) => {
        let newTeacher = new Teacher({
          email: request.body.email,
          Phone: request.body.Phone,
          field: request.body.field,
          experienceYears: request.body.experienceYears,
          Latitude: request.body.Latitude,
          Longitude: request.body.Longitude,
          name: request.body.name,
          pricePerHour: request.body.pricePerHour,
          Active: false,
          password: hash,
        });
        newTeacher
          .save()
          .then((data) => {
            response
              .status(201)
              .json({ message: "teacher registered successfully", data });
          })
          .catch((error) => next(error));
      });
    })
    .catch((error) => next(error));
};

module.exports.getFeedbackForTeacher = async (req, res, next) => {
  try {
    const teacherId = req.params.id;

    const feedback = await Rating.find(
      { teacherId: teacherId },
      { feedback: 1, rate: 1, studentId: 1, _id: 0 }
    ).populate({
      path: "studentId",
      select: "name email -_id",
    });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
