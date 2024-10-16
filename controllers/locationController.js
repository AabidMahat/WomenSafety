const Location = require("../models/locationModel");

exports.createLocation = async (locationData) => {
  const { userId, latitude, longitude } = locationData;

  console.log(`Received location from ${userId}: ${latitude}, ${longitude}`);

  const location = await Location.create({
    userId,
    latitude,
    longitude,
    updatedAt: Date.now(),
  });

  if (!location) {
    throw new Error("Failed to create location");
  }

  return location;
};

exports.updateLocation = async (locationData) => {
  const { userId, latitude, longitude } = locationData;

  const location = await Location.findOneAndUpdate(
    { userId },
    { $set: { latitude, longitude, updatedAt: new Date() } },
    { upsert: true, new: true }
  );

  if (!location) {
    throw new Error("Failed to update location");
  }
  return location;
};

exports.getLocation = async (userId) => {
  const location = await Location.findOne({ userId });

  if (!location) {
    throw new Error("Failed to update location");
  }
  return location;
};

exports.getAllLocation = async () => {
  const location = await Location.find().sort({ updatedAt: -1 });

  if (!location) {
    throw new Error("Failed to get locations");
  }
  return location;
};
