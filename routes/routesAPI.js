const express = require("express");
const router = express.Router();
const ItemLista = require("../models/ItemLista");
const WeekMenu = require("../models/WeekMenu");
const controllerList = require("../controllers/controllerList");
const controllerMenu = require("../controllers/controllerMenu");
const User = require("../models/User");
const verifyToken = require("../middlewares/authUser");

router.post("/register", async (req, res) => {
  try {
    const { uid, email } = req.body; // El UID debe generarse en el frontend
    const newUser = new User({ uid, email });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Other routes (with verifyToken middleware)
router.get("/items", verifyToken, controllerList.showItems);
router.get("/menu", verifyToken, controllerMenu.showMenu);
router.post("/itemcreate", verifyToken, controllerList.createItems);
router.post("/menucreate", verifyToken, controllerMenu.createOrUpdateMenu);
router.put("/item/:itemId", verifyToken, controllerList.updateItem);
router.put("/menu/reset", verifyToken, (req, res, next) => {
  req.body = {};
  next();
}, controllerMenu.resetMenu);
router.delete("/item/delete/:itemId", verifyToken, controllerList.deleteItem);

module.exports = router;

