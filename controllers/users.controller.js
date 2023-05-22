const TimeTracking = require("../models/timeTracking.model");
const Users = require("../models/users.model");
const Durations = require("../models/duration.model");
const Holidays = require("../models/holidays.model");
const PartTimers = require("../models/partTime.model");
const FullTimers = require("../models/fullTime.model");

exports.userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Users.findOne({
      email: email,
      password: password,
    }).select({
      email: 1,
      name: 1,
      employeeType: 1,
    });
    if (user) {
      const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
      const date = new Date();
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const day = dayName.toLocaleLowerCase();
      const hour = date.getHours();
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      const currentTime =
        Math.round(parseFloat(hour + "." + minutes) * 1e2) / 1e2;
      const getDate = date.getDate();
      const getMonth = date.getMonth() + 1;
      const getYear = date.getFullYear();
      const currentDate = getDate + "_" + getMonth + "_" + getYear;
      const employeeType = user.employeeType;

      const timing = await TimeTracking.findOne({ userID: user._id });
      const holiday = await Holidays.findOne({ date: currentDate });
      //console.log(day);

      if (timing) {
        if (timing.date == currentDate || timing.day == dayName) {
          res.status(400).send({
            message: "User already logged in.",
          });
        }
      } else if (weekdays.includes(day) && !holiday) {
        
        if (employeeType == "Part-time") {
          const partTimerSchedule = await PartTimers.findOne({
            userID: user._id,
          });
          const getWorkingHour = partTimerSchedule.workingHours[day];
          
          const starting = parseFloat(getWorkingHour.slice(0, 2));
          const startingTime = starting - 0.4;
          const ending = parseFloat(getWorkingHour.slice(getWorkingHour.length-2, getWorkingHour.length));
          console.log(currentTime);
          if (
            (currentTime >= startingTime - 0.3 &&
              currentTime <= starting + 0.3) 
          ) {
            // console.log("inside else");
            const newTiming = new TimeTracking({
              userID: user._id,
              inTime: currentTime,
              date: currentDate,
              day: dayName,
            });
            const timingData = await newTiming.save();
            res.status(200).send({
              message: "User found",
              user,
              timingData,
              employeeType,
            });
          } else {
            res
              .status(400)
              .send({ message: "Not your allocated working hour" });
          }
        } else if (employeeType == "Full-time") {
console.log(currentTime >= 16)
          if (currentTime >= 16 || currentTime <= 6) {
            res.status(400).send({
              message: "You can not login now.",
            });
          } else {
            const newTiming = new TimeTracking({
              userID: user._id,
              inTime: currentTime,
              date: currentDate,
              day: dayName,
            });
            const timingData = await newTiming.save();
            res.status(200).send({
              message: "User Found",
              user,
              timingData,
              employeeType,
            });
          }
        }
      } else {
        res.status(500).send({ message: "Not a working day" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send(error);
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
    const month = date.getMonth();
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const employeeType = req.body.employeeType;
    const endingMonth = req.body.ending;
    const workingHours = {
      sunday: req.body.sunday,
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
    };
    //const ending = endingMonth.charAt(0).toUpperCase();
    let partTimerData, fullTimerData;
    if (monthNames.indexOf(endingMonth) >= month) {
      const status = true;
      const newUser = new Users({
        name,
        email,
        password,
        isActive: status,
        employeeType,
      });
      const userData = await newUser.save();
      if (userData.employeeType == "Part-time") {
        const partTimer = new PartTimers({
          userID: userData._id,
          workingHours,
        });
        partTimerData = await partTimer.save();
      } else if (userData.employeeType == "Full-time") {
        const fullTimer = new FullTimers({
          userID: userData._id,
        });
        fullTimerData = await fullTimer.save();
      }
      const userID = userData._id;
      const newUserDuration = new Durations({
        userID: userID,
        ending: endingMonth,
      });
      const userDuration = await newUserDuration.save();
      if (userData && userDuration) {
        if (fullTimerData) {
          res.status(200).send({
            message: "User created",
            userData,
            userDuration,
            fullTimerData,
          });
        } else if (partTimerData) {
          res.status(200).send({
            message: "User created",
            userData,
            userDuration,
            partTimerData,
          });
        }
      } else {
        res.status(400).send({
          message: "User can not be created",
        });
      }
    }
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
      const hour = date.getHours();
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      const outTime = Math.round(parseFloat(hour + "." + minutes) * 1e2) / 1e2;
      console.log(hour);
      let status;
      if (user.employeeType == "Full-time") {
        const fullTimerSchedule = await FullTimers.findOne({
          userID: user._id
        });
        const totalHours = fullTimerSchedule.totalWorkingHours;
        const inTime = timing.inTime;
        const totalTime = (outTime - inTime).toFixed(2);
        if(inTime >=12 || totalTime<= 6){
          status = "Half Day";
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
          
        }else{
          status = "Full Day";
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
        }
      } else if (user.employeeType == "Part-time") {
        const partTimerSchedule = await PartTimers.findOne({
          userID: user._id,
        });
        const getWorkingHour = partTimerSchedule.workingHours[day];
        const starting = parseFloat(getWorkingHour.slice(0, 2));
        const startingTime = starting - 0.4;
        const ending = parseFloat(getWorkingHour.slice(getWorkingHour.length-2, getWorkingHour.length)) - 0.4;
        const inTime = timing.inTime;
        if (
          outTime >= ending - 0.3
        ) {
          status = "Full Day";
          const totalTime = (outTime - inTime).toFixed(2);
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
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

exports.updateUserAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const date = req.params.date;
    const user = await TimeTracking.findOneAndUpdate(
      { userID: id, date: date },
      {
        $set: {
          inTime: req.body.inTime,
          outTime: req.body.outTime,
        },
      },
      {
        new: true,
      }
    );
    if (user) {
      res.status(200).send({
        message: "User attendance updated successfully",
        user,
      });
    } else {
      res.status(400).send({
        message: "User not found.",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteUserAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const date = req.params.date;
    const user = await TimeTracking.findOneAndDelete({
      userID: id,
      date: date,
    });
    if (user) {
      if (!user.date) {
        res.status(400).send({
          message: "User was not present on that day.",
        });
      } else {
        res.status(200).send({
          message: "User attendance deleted successfully",
          user,
        });
      }
    } else {
      res.status(404).send({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
