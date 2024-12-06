const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    meal: { type: String, required: true },
}, { _id: false });

const DayMenuSchema = new mongoose.Schema({
    day: { type: String, required: true, enum: ['monday', 'tuesday', 'wednesday', 'jueves', 'friday', 'saturday', 'sunday'] },
    breakfast: MealSchema,
    lunch: MealSchema,
    dinner: MealSchema
}, { _id: false });

const WeekMenuSchema = new mongoose.Schema({
    week: { type: String, required: true, unique: true }, 
    days: [DayMenuSchema]
}, { timestamps: true });

const WeekMenu = mongoose.model('WeekMenu', WeekMenuSchema);

module.exports = WeekMenu;
