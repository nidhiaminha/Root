var fs = require('fs');
const readline = require('readline');

var path = 'driverdetails.txt';
const driverDetails = {};

async function createDriver(){
    const fileStream = fs.createReadStream(path);

    const readLines = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
    for await (const line of readLines) {
        const word = line.split(' ');

        // create driver details with drivers
        if(word.length === 2 && word[0] === 'Driver'){
            let name = word[1];
            driverDetails[name] = {};
            driverDetails[name].minutes = 0;
            driverDetails[name].miles = 0;
        }

    }
    return driverDetails;
}

createDriver().then(async function getDriverDetails(driver)  {
    const time_start = new Date();
    const time_end = new Date();
    const fileStream = fs.createReadStream(path);

    const readLines = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
    for await (const line of readLines){
        const word = line.split(' ');
        if(word.length === 5 && word[0] === 'Trip'){
            let driverName = word[1];
            let timeStart = word[2].split(':');
            let timeEnd = word[3].split(':');
            let milesDriven = Number(word[4]);
    
            // create date format
            time_start.setHours(timeStart[0], timeStart[1], 0, 0);
            time_end.setHours(timeEnd[0], timeEnd[1], 0,0)
            let diffInMilliSeconds = Math.floor(time_end-time_start);
            let minutesDiff = Math.floor(diffInMilliSeconds / 60000);

            // calculate total miles and minutes driven     
            driver[driverName].minutes = driver[driverName].minutes + minutesDiff;
            driver[driverName].miles = driver[driverName].miles + milesDriven;
        }
    }
    for(const driverObj in driver){
        driver[driverObj].avgSpeed = Math.ceil((driver[driverObj].miles * 60) / driver[driverObj].minutes);
        // handle falsey values
        driver[driverObj].avgSpeed = driver[driverObj].avgSpeed || 0;
        // if avgSpeed is < 5mph or >100mph
        if(driver[driverObj].avgSpeed < 5 || driver[driverObj].avgSpeed > 100){
            driver[driverObj].miles = 0;
            driver[driverObj].minutes = 0;
            driver[driverObj].avgSpeed = 0;
        }
    }
    console.log(driver);
}).catch(
    console.log('rejected')
)






