//current date and time
// const current = new Date(); 
// console.log(current.getTimezoneOffset()/-60);
//gmt-11 660
//gmt -1 60
//gmt 0 0
//gmt +1 -60
//gmt+8 -480
//gmt+12 -720
//console.log(current.getDay());//0-sunday,6-sat

// console.log(0/-60 === 0);
// console.log(full);

let x = 5
if (x < 10) {
    x = 6;
    //console.log(x);
};
//console.log(x);

//roll dice
const n = Math.random();

const dotenv = require("dotenv");
dotenv.config();
const LOAD_SLASH = process.argv[2] === "load";
//console.log(process.argv[2])

// const t = 1000;
// setTimeout(myGreeting, 5*t-200);

// function myGreeting() {
//     console.log("hi");
//   }

// console.log(/^\d+$/.test("0.123456789"));
// console.log(parseInt("123"))
// console.log(`timer for ${5*t} seconds started`);

const axios = require('axios');

axios
  .get(
    `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={e51c1157be8424b781af3be17803c071}`
  )
  .then(response => {
    let apiData = response;
    let temp = apiData.data.main.temp;
    console.log(temp);
  }).catch(err => {
    console.log(err);
  })
