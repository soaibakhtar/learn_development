const express = require("express")
const userRouter = express.Router();
const { UserModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

//Registration
userRouter.post("/register", async (req, res) => {
    const {email,pass,location,age} = req.body
    try {

        bcrypt.hash(pass, 5, async  (err, hash) =>{
            // Store hash in your password DB.
            const user =  new UserModel({email,pass:hash,location,age})
            await user.save()
            res.status(200).send({"msg" : "Registration has been done!"})
        });

        // const user = new UserModel(req.body)
        // await user.save()
        // res.status(200).send({"msg" : "Registration has been done!"})

    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }


})

//Login
userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body;

    try {
        const user = await UserModel.findOne({email})
        console.log(user);
        if(user){
            bcrypt.compare(pass,user.pass, (err,result) =>{
                if(result){
                    res.status(200).send({"msg" : "Login successfull!","token":jwt.sign({"userID" : user._id},"masai")})
                } else{
                    res.status(400).send({"msg" : "Worng Password!"})
                }
            })
        }

    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})

module.exports = {
    userRouter
}