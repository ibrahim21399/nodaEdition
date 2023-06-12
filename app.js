const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const teacherRouter = require("./Routers/teacherRouter");
const authRouter = require("./Routers/authRouter");
const studentRouter = require("./Routers/studentRouter");
const messageRouter = require("./Routers/MessageRouter");

const server = express();
mongoose
  .connect(process.env.DB_Url)
  .then(() => {
    console.log("DB Connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`I'm Listening at port ${process.env.PORT ?? 5000}.....`);
    });
  })
  .catch((error) => {
    console.log("Error occured");
  });

// Logger Middle Ware
server.use((request, response, next) => {
  console.log(request.url, request.method);
  next();
});

// Cors
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

server.use(cors(corsOptions));

//body parser
server.use(body_parser.json());
server.use(body_parser.urlencoded({ extended: false }));

//routes
server.use(authRouter);
server.use(teacherRouter);
server.use(studentRouter);
server.use(messageRouter);

//NotFound MW
server.use((request, response) => {
  response.status(404).json({ message: "Page is Not Found!" });
});

//Error MW
server.use((error, request, response, next) => {
  // response.status(500).json({message:"Something went wrong"})
  response.status(500).json({ message: error + "" });
});
