const userRouter = require('express').Router();
const { insertHoliday } = require('../controllers/holidays.controller');
const { userLogin, userSignup, getAllUsers, deleteUser, updateUser, getOneUser, logoutUser, updateUserAttendance, deleteUserAttendance } = require("../controllers/users.controller");

userRouter.post("/login", userLogin);

userRouter.post("/signup", userSignup);

userRouter.get("/", getAllUsers);

userRouter.get("/:name/:password", getOneUser);

userRouter.put("/update/:id", updateUser);

userRouter.delete("/delete/:id", deleteUser);

userRouter.put("/updateAttendance/:id/:date", updateUserAttendance);

userRouter.delete("/deleteAttendance/:id/:date", deleteUserAttendance);

userRouter.post("/logout/:id", logoutUser);

userRouter.post("/holiday/insert", insertHoliday)

module.exports = userRouter;


