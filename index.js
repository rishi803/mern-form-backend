const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// local db : "mongodb://127.0.0.1/my_database_name";

require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USERNAME +
      ":" +
      encodeURIComponent(process.env.DB_PASSWORD) +
      "@" +
      process.env.DB_CLUSTER +
      "/" +
      process.env.DB_NAME +
      "?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error("DB connection error:", error);
  });

  
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

// Routes

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("user",req.body)
  try {
    const user = await User.findOne({ email: email });

    if (user && password === user.password) {
      //    res.send({message:"Login success"})
      res.send({ message: "UserExist", user: user });
    } else if (user && password !== user.password) {
      res.json("WrongPassword");
    } else {
      // res.send({message:"User not registered"})
      res.json("UserNotExist");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ message: "Registration failed due to an error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  //   console.log("user",req.body)
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.json("Exist");
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });

      await newUser.save();
      res.json("NotExist");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ message: "Registration failed" });
  }
});

app.listen(8000, (req, res) => {
  console.log("Listening on port 8000");
});
