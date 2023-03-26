const express = require("express");
const { connection } = require("./db");
require("dotenv").config()
const cors = require("cors")
const app = express();
app.use(express.json())
const {userRouter} = require("./routes/user.routes")
const {noteRouter} = require("./routes/note.routes")
const {auth} = require("./middleware/auth.middleware")
app.use(cors())

app.use("/user",userRouter)
app.use(auth)
app.use("/notes",noteRouter)

app.listen(process.env.port,async ()=>{

    try {
        await connection
        console.log("database is connected");
    } catch (error) {
        console.log(error);
    }

    console.log("Server is Started");
})