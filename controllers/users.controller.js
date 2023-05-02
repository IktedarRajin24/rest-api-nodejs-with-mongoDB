const Users = require("../models/users.model");

exports.userLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await Users.findOne({
        email: email,
        password: password,
      }).select({
        name: 1,
        email: 1,
        _id: 0,
      });
      if (user) {
        res.status(200).send({
          message: "User found",
          user,
        });
      } else {
        res.send("Invalid user").json();
      }
    } catch (error) {}
}

exports.userSignup = async (req, res) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const newUser = new Users({
        name,
        email,
        password,
      });
      const userData = await newUser.save();
  
      res.status(200).send({
        message: "User created",
        userData,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

exports.getAllUsers = async (req, res) => {
    try {
      const users = await Users.find();
      if (users) {
        res.status(200).send(users);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

exports.deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await Users.deleteOne({ _id: id });
      if (user) {
        res.status(200).send({
          message: "User deleted successfully",
          user,
        });
      } else {
        res.status(400).send({
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

exports.updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await Users.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
        },
        { new: true }
      );
      if (user) {
        res.status(200).send({
          message: "User updated successfully",
          user,
        });
      } else {
        res.status(400).send({
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

exports.getOneUser = async (req, res) => {
    try {
      const name = req.params.name;
      const password = req.params.password;
      const user = await Users.findOne({ name: name, password: password }).select(
        {
          name: 1,
          email: 1,
          _id: 0,
        }
      );
      if (user) {
        res.status(200).send({
          message: "User found",
          user,
        });
      } else {
        res.status(400).send("Invalid user").json();
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }