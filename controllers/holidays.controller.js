const Holidays = require("../models/holidays.model");

exports.insertHoliday = async (req, res) =>{
    try {
        const day = req.body.day;
        const date = req.body.date;
        const title = req.body.title;
        const newHoliday = new Holidays({
            day,
            date,
            title
        });
        const holidayData = await newHoliday.save();
        if(holidayData){
            res.status(200).send({
                message : "Successfully created holiday.",
                holidayData
            })
        }
        else{
            res.status(400).send({
                message: "Failed to create holiday."
            })
        }
    } catch (error) {
        
    }
}