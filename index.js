const app = require("./app");
const PORT = 3000;
const connectDB  = require("./config/database");

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
