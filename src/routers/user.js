const mongoose = require('mongoose');
const express = require('express');
const User = require("../models/Users");
const router = express.Router();


router.post("/create_user", (req, res) => {
    console.log(req.body);   
    console.log(req.params);
    const user = new User(req.body);
    user.save().then((result) => {
        res.send(result);
        console.log("saved");
    }).catch((err) => {
        res.send(err);
 })
    
});
















module.exports = router;
