var fs = require('fs');
const readline = require('readline');

var path = 'driverdetails.txt';
const driverDetails = {};

async function createDriver(){
    // Read the stream from the  input file
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

            // calculate speed for each trip and discard trips with avg speed < 5 or > 100 mph
            let tripSpeed =  Math.ceil((milesDriven * 60) /minutesDiff);
            if (tripSpeed < 5 || tripSpeed > 100){
                minutesDiff = 0;
                milesDriven = 0
            }

            // calculate total miles and minutes driven     
            driver[driverName].minutes = driver[driverName].minutes + minutesDiff;
            driver[driverName].miles = driver[driverName].miles + milesDriven;
        }
    }
    for(const driverObj in driver){
        driver[driverObj].avgSpeed = Math.ceil((driver[driverObj].miles * 60) / driver[driverObj].minutes);
        // handle falsey values
        driver[driverObj].avgSpeed = driver[driverObj].avgSpeed || 0;
    }

    let arr = Object.entries(driver);
    const outputArr = arr.sort((x,y) => (y[1].miles - x[1].miles));
    let text = '';
    outputArr.forEach(x => {
        (x[1].avgSpeed < 5 || x[1].avgSpeed > 100)
        ?(text = text + `${x[0]}: ${x[1].miles} miles \n`)
        :(text = text + `${x[0]}: ${x[1].miles} miles @ ${x[1].avgSpeed} mph \n`) 
    })
    // Write to the output file
    fs.writeFile('output.txt', text, (err) => {
        if(err){
            throw(err);
        }
    })
    console.log(text);
    return  
}).catch((err) =>
    console.log(err)
)






