const TimeTracking = require("../models/timeTracking.model");
const Users = require("../models/users.model");
const Durations = require("../models/duration.model");

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
      _id: 1,
      workingHours: 1,
    });
    if (user) {
      const date = new Date();
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const day = dayName.toLocaleLowerCase();
      const hour = date.getHours() % 12 || 12;
      const getWorkingHour = user.workingHours[day];
      const starting = parseInt(getWorkingHour.slice(0, 1));
      const ending = parseInt(getWorkingHour.slice(5, 6));
      const getDate = date.getDate();
      const getMonth = date.getMonth() + 1;
      const getYear = date.getFullYear();
      const currentDate = getDate + "/" + getMonth + "/" + getYear;
      console.log(currentDate);

      if (user.workingHours.hasOwnProperty(day)) {
        if (starting == hour) {
          console.log(user.workingHours[day]);
          console.log(starting);
          console.log(ending);
          console.log(hour);
          const timing = await TimeTracking.findOne({ userID: user._id });
          // console.log(timing);

          if (timing) {
            if (timing.date == currentDate || timing.day == dayName) {
              res.status(400).send({
                message: "User already logged in.",
              });
            }
          } else {
            console.log("inside else");
            const newTiming = new TimeTracking({
              userID: user._id,
              inTime: hour,
              date: currentDate,
              day: dayName,
            });
            const timingData = await newTiming.save();
            //console.log(timingData);
            res.status(200).send({
              message: "User found",
              user,
              timingData,
            });
          }
        } else {
          res.status(500).send({ message: "Not your allocated working hour" });
        }
      } else {
        res.status(500).send({ message: "Not a working day" });
      }
    } else {
      res.status(500).send({ message: "Invalid user" });
    }
  } catch (error) {
    res.status(500).send(error).json();
  }
};

exports.userSignup = async (req, res) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date();
    const monthName = date.getMonth();
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const workingHours = {
      sunday: req.body.sunday,
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
    };
    const endingMonth = req.body.ending;
    const newUser = new Users({
      name,
      email,
      password,
      workingHours,
    });
    const userData = await newUser.save();
    const userID = userData._id;
    const newUserDuration = new Durations({
      userID,
      ending: endingMonth,
    });
    const userDuration = await newUserDuration.save();

    // console.log(userDuration.starting)
    // console.log(userDuration.ending)
    // console.log(monthNames.indexOf(userDuration.starting));
    if(monthNames.indexOf(userDuration.ending) >= monthName && monthNames.indexOf(userDuration.starting)<= monthName){
      console.log(monthNames.indexOf(userDuration.ending))
      console.log(monthName);
      console.log(monthNames.indexOf(userDuration.starting))

      const user = await Users.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            isActive: true
          },
        },
        { new: true }
        );
    }
    res.status(200).send({
      message: "User created",
      userData,
      userDuration,
    });

    
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    if (users) {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

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
};

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
};

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
};

exports.logoutUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ _id: id });
    // console.log(user);
    if (!user) {
      res.status(400).send({
        message: "Invalid user",
      });
    }
    const timing = await TimeTracking.findOne({ userID: id });
    // console.log(timing);
    if (!timing) {
      res.status(400).send({
        message: "User not logged in.",
      });
    } else if (timing.outTime) {
      res.status(400).send({
        message: "User is already logged out",
      });
    } else {
      // console.log(user)
      const date = new Date();
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const day = dayName.toLocaleLowerCase();
      const hour = date.getHours() % 12 || 12;
      const getWorkingHour = user.workingHours[day];
      const starting = timing.inTime;
      const ending = parseInt(getWorkingHour.slice(5, getWorkingHour.length));
      const outTime = hour;

      let status;
      if (outTime >= ending) {
        status = "Full Day";
        const totalTime = outTime - starting;
        const timingData = await TimeTracking.findByIdAndUpdate(
          { _id: timing._id },
          {
            $set: {
              outTime,
              totalTime,
              status,
            },
          },
          { new: true }
        );
        res.status(200).send({
          message: "Successfully logged out",
          timingData,
        });
      } else {
        res.status(500).send({
          message: "You can not log out!!",
        });
      }
    }
  } catch (error) {
    res.status(404).send(error);
  }
};
