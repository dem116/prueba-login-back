const mongoose = require('mongoose');

const ItemListaSchema = new mongoose.Schema({

    item: { type: String, required: true },
    
}, { timestamps: true });

const ItemLista = mongoose.model('ItemLista', ItemListaSchema);

module.exports = ItemLista;