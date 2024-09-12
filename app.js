const express = require("express");

const notificationRoute = require("./routes/notifcationRoute");
const feedbackRoute = require("./routes/feedbackRoute");

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Routing

app.use("/api/v3/notification", notificationRoute);
app.use("/api/v3/feedback", feedbackRoute);

module.exports = app;
