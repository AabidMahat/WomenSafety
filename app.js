const express = require("express");

const notificationRoute = require("./routes/notifcationRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const userRoute = require("./routes/userRoute");
const guardianRoute = require("./routes/guardianRoute");
const tokenRoute = require("./routes/tokenRoute");
const requestRoute = require("./routes/requestRouter");
const communityRouter = require("./routes/communityRoute");
const postRouter = require("./routes/postRoute");

const authenticateToken = require("./middlewares/authenticationMiddleware");

const app = express();


app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Routing

app.use("/api/v3/notification",authenticateToken, notificationRoute);
app.use("/api/v3/feedback",authenticateToken, feedbackRoute);
app.use("/api/v3/user", userRoute);
app.use("/api/v3/guardian",authenticateToken, guardianRoute);
app.use("/api/v3/token",authenticateToken, tokenRoute);
app.use("/api/v3/request",authenticateToken, requestRoute);
app.use("/api/v3/community",authenticateToken, communityRouter);
app.use("/api/v3/post",authenticateToken, postRouter);

module.exports = app;
