//gives the current date time

// var currentDate = new Date().toLocaleString();
// var datetime = currentDate.split(",")//[date,time]
// console.log(datetime);//[date,time]

// var current = new Date(); 
// console.log(current.getTimezoneOffset())
// //gmt-11 660
// //gmt -1 60
// //gmt 0 0
// //gmt +1 -60
// //gmt+8 -480
// //gmt+12 -720
// console.log(current.getDay());//0-sunday,6-sat

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Returns current date and time'),
    async execute(interaction) {

        //it is currently [day], [date]. the time is [time] [timezone].
        const currentTime = new Date();

        const dateTime = new Date().toLocaleString().split(",");//[date, time]
        const daylst = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const timeZone = currentTime.getTimezoneOffset()/-60;

        if (timeZone >= 0){
            return interaction.reply(`It is currently ${daylst[currentTime.getDay()]}, ${dateTime[0]}. The time is${dateTime[1]} (GMT+${timeZone}).`);
        } else if (timeZone === 0) {
            return interaction.reply(`It is currently ${daylst[currentTime.getDay()]}, ${dateTime[0]}. The time is${dateTime[1]} (GMT+0).`);
        } else {
            return interaction.reply(`It is currently ${daylst[currentTime.getDay()]}, ${dateTime[0]}. The time is${dateTime[1]} (GMT${timeZone}).`);
        }
    }
};
