const express = require("express");

const notificationRoute = require("./routes/notifcationRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const userRoute = require("./routes/userRoute");
const guardianRoute = require("./routes/guardianRoute");
const tokenRoute = require("./routes/tokenRoute");
const requestRoute = require("./routes/requestRouter");
const communityRouter = require("./routes/communityRoute");
const postRouter = require("./routes/postRoute");

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Routing

app.use("/api/v3/notification", notificationRoute);
app.use("/api/v3/feedback", feedbackRoute);
app.use("/api/v3/user", userRoute);
app.use("/api/v3/guardian", guardianRoute);
app.use("/api/v3/token", tokenRoute);
app.use("/api/v3/request", requestRoute);
app.use("/api/v3/community", communityRouter);
app.use("/api/v3/post", postRouter);

module.exports = app;
