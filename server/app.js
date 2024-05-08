const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const createPostRoutes = require("./routes/createPost");
const userProfileRoutes = require("./routes/userProfile");
const requireLogin = require("./middleware/requireLogin");

const { mongoURL } = require("./keys");

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(createPostRoutes);
app.use(userProfileRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
