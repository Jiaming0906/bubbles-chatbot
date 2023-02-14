//current date and time
const current = new Date(); 
// console.log(current.getTimezoneOffset()/-60);
//gmt-11 660
//gmt -1 60
//gmt 0 0
//gmt +1 -60
//gmt+8 -480
//gmt+12 -720
//console.log(current.getDay());//0-sunday,6-sat

//it is currently [day], [date]. the time is [time] [timezone].

const datetime = new Date().toLocaleString().split(",");//[date, time]
const daylst = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//const timezone = current.getTimezoneOffset()/-60;
const timezone = 0/-60;

const full = `It is currently ${daylst[current.getDay()]}, \
${datetime[0]}. \
The time is ${datetime[1]} (GMT+${timezone}).`;

// console.log(0/-60 === 0);
// console.log(full);

let x = 5
if (x < 10) {
    x = 6;
    console.log(x);
};
//console.log(x);

//roll dice
const n = Math.random();

const dotenv = require("dotenv");
dotenv.config();
const LOAD_SLASH = process.argv[2] === "load";
console.log(process.argv[2])
