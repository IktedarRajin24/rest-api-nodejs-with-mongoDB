const express = require("express");
const app = express();
const userRouter = require("./routes/users.routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user/api/", userRouter);


app.get("/", (req, res) => {
  res.send("<h1>Hello from home</h1>");
});

module.exports = app;