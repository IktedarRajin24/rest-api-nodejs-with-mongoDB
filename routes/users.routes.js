const userRouter = require('express').Router();
const { userLogin, userSignup, getAllUsers, deleteUser, updateUser, getOneUser, logoutUser } = require("../controllers/users.controller");

userRouter.post("/login", userLogin);

userRouter.post("/signup", userSignup);

userRouter.get("/", getAllUsers);

userRouter.get("/:name/:password", getOneUser);

userRouter.delete("/delete/:id", deleteUser);

userRouter.put("/update/:id", updateUser);

userRouter.post("/logout/:id", logoutUser);

module.exports = userRouter;


