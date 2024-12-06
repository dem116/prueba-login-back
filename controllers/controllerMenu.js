const WeekMenu = require("../models/WeekMenu");
const moment = require("moment");
const User = require("../models/User");

const MenuController = {
  async showMenu(req, res) {
    try {
      const user = await User.findOne({ uid: req.uid });
      if (!user) return res.status(404).send("User not found");
      res.json(user.content.menu); // Access menu directly
    } catch (error) {
      res.status(500).send("Error retrieving posts");
    }
  },
  async createOrUpdateMenu(req, res) {
    try {
      const currentWeek = `Week ${moment().isoWeek()} - ${moment().year()}`;
      const { days } = req.body;

      if (!days || !Array.isArray(days) || days.length !== 7) {
        return res.status(400).json({ message: "The menu most have at least 1 meal per day every day" });
      }

      for (const day of days) {
        if (!day.breakfast && !day.lunch && !day.dinner) {
          return res.status(400).json({ 
            message: `The day ${day.day} most have at least one meal` 
          });
        }
      }

      const menu = await WeekMenu.findOneAndUpdate(
        { week: currentWeek },
        { week: currentWeek, days },
        { new: true, upsert: true }
      );

      const user = await User.findOne({ uid: req.uid });
      if (!user) return res.status(404).send("User not found");
      user.content.menu = menu; // Update the user's menu
      await user.save();

      res.status(201).json(menu);
    } catch (error) {
      console.error("Error updating or creating the menu", error);
      res.status(500).json({ message: "Error creating or updating the menu" });
    }
  },
  async resetMenu(req, res) {
    try {
      const currentWeek = `Week ${moment().isoWeek()} - ${moment().year()}`;
      const resetMenu = await WeekMenu.findOneAndUpdate(
        { week: currentWeek }, 
        { days: [] }, 
        { new: true } 
      );

      if (!resetMenu) {
        return res.status(404).send({ message: "There is not a menu for this week" });
      }

      const user = await User.findOne({ uid: req.uid });
      if (!user) return res.status(404).send("User not found");
      user.content.menu = resetMenu; // Update the user's menu
      await user.save();

      res.status(200).json({ message: "Menu reseted", resetMenu });
    } catch (error) {
      console.error("Error restarting the menu:", error);
      res.status(500).send({ message: "Error restarting the menu" });
    }
  }
};

module.exports = MenuController;