const ItemLista = require("../models/ItemLista");
const User = require("../models/User");

const ItemListaController = {
  async showItems(req, res) {
    try {
      const user = await User.findOne({ uid: req.uid });
      if (!user) return res.status(404).send("User not found");
      res.json(user.content.list); // Access list directly
    } catch (error) {
      res.status(500).send("Error retrieving posts");
    }
  },
  async createItems(req, res) {
    try {
      const { item } = req.body;
      const user = await User.findOne({ uid: req.uid });
      if (!user) return res.status(404).send("User not found");
  
      const newItem = await ItemLista.create({ item });
      user.content.list.push(newItem._id); // Agregar el ID del item a la lista
      await user.save();
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).send("Error creating item");
    }
  },  
  async updateItem (req, res) {
    try {
      const { item } = req.body;
      const user = await User.findOne({ uid: req.uid });
      if (!user) return res.status(404).send("User not found");

      try {
        const idItem = req.params.itemId;
        const updatedItem = await ItemLista.findByIdAndUpdate(
          idItem, 
          { item }, 
          { new: true } 
        );
        user.content.list = updatedItem; // Update the user's list
        await user.save();
        res.json(updatedItem); 
      } catch (err) {
        console.error("Could not update item: ", err)
      }
    } catch (error) {
      res.status(500).send("Error editing item, due to error related to user");
    }
  },
  async deleteItem(req, res) {
    try {
      const user = await User.findOne({ uid: req.uid });
      if (!user) return res.status(404).send("User not found");

      try {
        const idItem = req.params.itemId;
        const deletedItem = await ItemLista.findByIdAndDelete(idItem);
        // Remove the item from the user's list (optional)
        user.content.list = null; 
        await user.save();
        res.json({ mensaje: "Item deleted", deletedItem });
      } catch (err) {
        console.error("Could not delete the item: ", err)
      }
    } catch (error) {
      res.status(500).send("Error deliting item, due to error related to user");
    }
  }
};

module.exports = ItemListaController;