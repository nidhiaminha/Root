# Root
### Node
* Install Node
* You will need a node package installed in your environment.
* Go onto [official Node.js website](https://nodejs.org/) to download the installer.

### Scope of functionalities
The fs library is used to read from and write to files.
```
    const fileStream = fs.createReadStream(path);

    const readLines = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
```
The createDriver() function registers the driver and creates a driver object.
```
        if(word.length === 2 && word[0] === 'Driver'){
            let name = word[1];
            driverDetails[name] = {};
            driverDetails[name].minutes = 0;
            driverDetails[name].miles = 0;
        }
 ```
 The getDriverDetails() function picks the command Trip and calculates the avg speed, miles and minutes driven for each driver.
 ```
    for(const driverObj in driver){
        driver[driverObj].avgSpeed = Math.ceil((driver[driverObj].miles * 60) / driver[driverObj].minutes);
        // handle falsey values
        driver[driverObj].avgSpeed = driver[driverObj].avgSpeed || 0;
    }
```
After the calculations are done update the driver details and write to the output file
 ```
    fs.writeFile('output.txt', text, (err) => {
        if(err){
            throw(err);
        }
    })
 ```
### Running the Project
* node main.js
