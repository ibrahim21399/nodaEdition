const express=require("express");


const Controller=require("./../Controllers/messageController")

const router=express.Router();
router.route("/api/messages")
.post(Controller.SendMessage)


router.route("/api/messages/:stdId/:teachId")
.get(Controller.getAll)

module.exports=router;