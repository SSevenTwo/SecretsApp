//jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//set up mongoose and encryption

mongoose.connect("mongodb://localhost:27017/userDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "thisisaverylongstringforsecretpurposes";

userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"]});

const User = mongoose.model("user", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
      let username = req.body.username;
      let password = req.body.password;

      User.findOne({ email: username }, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          if (user) {
            if (user.password === password) {
              res.render("secrets");
            } else {
              res.render("home");
            }
          }
        }
      });
    });

      app.get("/register", function(req, res) {
        res.render("register");
      });

      app.post("/register", function(req, res) {
        let newUser = new User({
          email: req.body.username,
          password: req.body.password
        });

        newUser.save(function(err) {
          if (!err) {
            res.render("secrets");
          }
        });
      });

      app.listen(3000, function() {
        console.log("Server started on port 3000.");
      });
