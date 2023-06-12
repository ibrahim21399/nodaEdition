const Student = require("./../Models/studentModel");
const Teacher = require("./../Models/teacherModel");
const Rating = require("./../Models/ratingModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "teacherapp67@gmail.com",
    pass: "nryxzoxaeroptjfy",
  },
});

//getAll
module.exports.getAllStudent = (request, response, next) => {
  console.log("get all students");
  Student.find({})
    .then((data) => {
      if (data.length == 0) throw new Error("No data");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

//getById
module.exports.getStudentById = (request, response, next) => {
  console.log("get by id");

  Student.find({ _id: request.params.id })
    .then((data) => {
      if (data.length == 0) throw new Error("No data");
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

//EnrollToTeacher
module.exports.enrollStudent = async (request, response, next) => {
  try {
    console.log("EnrollToTeacher");
    const teacherId = request.body.teacherId;
    const studentId = request.body.studentId;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    if (teacher.studentEnrolled.includes(studentId)) {
      throw new Error("Student is already enrolled");
    }
    teacher.studentEnrolled.push(studentId);
    await teacher.save();
    response.status(200).json(teacher);
  } catch (error) {
    next(error);
  }
};

//create
module.exports.createStudent = (request, response, next) => {
  console.log("create");

  Student.find({ email: request.body.email })
    .then((Data) => {
      if (Data.length != 0) {
        //exist
        console.log(request.body);
        throw new Error("this email is already taken");
      } else {
        bcrypt
          .hash(request.body.password, 10)
          .then((hash) => {
            let student = new Student({
              email: request.body.email,
              name: request.body.name,
              password: hash,
              Active: true,
            });
            student.save().then((data) => {
              response.status(201).json({ message: "created", data });
              console.log("created");
            });
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
};

//Update
module.exports.updateStudent = (request, response, next) => {
  console.log("update");

  Student.updateOne(
    { _id: request.body._id },
    {
      $set: {
        email: request.body.email,
        name: request.body.name,
      },
    }
  )
    .then((data) => {
      console.log(data.matchedCount);
      if (data.matchedCount == undefined) throw new Error("No Data!");
      response.status(200).json({ message: "updated", data });
    })
    .catch((error) => {
      next(error);
      console.log(error + "");
    });
};

//Delete
module.exports.deleteStudent = (request, response, next) => {
  console.log("delete");

  Student.deleteOne({ _id: request.params.id })
    .then((data) => {
      response.status(200).json({ message: "Deleted", data });
    })
    .catch((error) => next(error));
};

//ChangeStatus
module.exports.blockAccount = (request, response, next) => {
  Student.updateOne(
    { _id: request.params.id },
    {
      $set: {
        Active: false,
      },
    }
  )
    .then((data) => {
      if (data.matchedCount == 0) throw new Error("No Data!");
      response.status(200).json({ message: "updated", data });
    })
    .catch((error) => {
      next(error);
      console.log(error + "");
    });
};
module.exports.activateAccount = (request, response, next) => {
  Student.updateOne(
    { _id: request.params.id },
    {
      $set: {
        Active: true,
      },
    }
  )
    .then((data) => {
      if (data.matchedCount == 0) {
        throw new error("No Data!");
      } else {
        Student.findById(request.params.id).then((data) => {
          const mailOptions = {
            from: "teacherapp67@gmail.com",
            to: data.email,
            subject: "Your account has been Activted",
            text: "Congratulations! Your account has been Activeted by Admin.",
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        });
      }
      response.status(200).json({ message: "updated", data });
    })
    .catch((error) => {
      next(error);
      console.log(error + "");
    });
};

module.exports.addRating = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { rate, feedback, studentId } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Check if the student is enrolled in the teacher
    if (!teacher.studentEnrolled.includes(studentId)) {
      return res
        .status(400)
        .json({ error: "Student is not enrolled in this teacher" });
    }

    const existingRating = await Rating.findOne({
      teacherId,
      studentId,
    });
    if (existingRating) {
      // Update existing rating
      existingRating.rate = rate;
      existingRating.feedback = feedback;
      await existingRating.save();
    } else {
      // Add new rating
      const newRating = new Rating({
        teacherId,
        studentId,
        rate,
        feedback,
      });
      await newRating.save();
    }

    // Calculate the average rating for the teacher
    const ratings = await Rating.find({ teacherId });
    if (ratings.length === 0) {
      teacher.averageRating = null; // Set averageRating to null if there are no ratings
    } else {
      const totalRating = ratings.reduce((total, rating) => {
        return total + rating.rate;
      }, 0);
      teacher.averageRating = totalRating / ratings.length;
    }

    await teacher.save();

    res.json({ message: "Rating added successfully", teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
