const express = require("express")
const noteRouter = express.Router();
const jwt=require("jsonwebtoken")
const {NoteModel} =require("../model/note.model")
noteRouter.get("/",async (req,res)=>{
    const token = req.headers.authorization
    const decoded = jwt.verify(token,"masai")
    try {
        if(decoded){
        const notes = await NoteModel.find({"userID":decoded.userID})
        res.status(200).send(notes)
        }
    } catch (error) {
        res.status(400).send({"msg" : error.message})
    }
})

noteRouter.post("/add",async (req,res)=>{
    try {
        const note = new NoteModel(req.body)
        await note.save();
        res.status(200).send({"msg" : "A new Note has been added"})
    } catch (error) {
        res.status(400).send({"msg" : error.message})
    }
})

noteRouter.patch("/update/:noteID", async (req,res)=>{
    const {id} = req.params;
    const payload = req.body;
    try {
        const note = await  NoteModel.findByIdAndUpdate({_id:id},payload);
        res.status(200).send({"msg" : "notes are updated"})
    } catch (error) {
        res.status(400).send({"msg" : error.message})
    }

})

noteRouter.delete("/delete/:noteID", async (req,res)=>{
    const token = req.headers.authorization
    const decoded = jwt.verify(token,"masai")
    const req_id = decoded.userID;
    const noteID = req.params.noteID
    const note = NoteModel.findOne({_id:noteID})
    const userID_in_note = note.userID
    try {
        if(req_id===userID_in_note){
        const note = await NoteModel.findByIdAndDelete({_id:noteID});
        res.status(200).send({"msg" : "note are deleted"})
    } else {
        res.status(400).send({"msg" : "Not Authorised"})
        }
    } catch (error) {
        res.status(400).send({"msg" : error.message})
    }
})


module.exports = {
    noteRouter
}