//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
// SETUP & API KEYS

var express = require("express")
// const cors = require("cors");
const axios = require("axios");
const e = require("express");
var router = express.Router()

const mongoose = require("mongoose");
require('dotenv').config()
const apiKey = process.env.REACT_APP_API_KEY
const schemas = require("../models/schemas")
// const oddsHistoryModel = schemas["OddsHistory"]
const MLCollection = schemas["MLCollection"]
const SpreadsCollection = schemas["SpreadsCollection"]
const TotalsCollection = schemas["TotalsCollection"]
const RawData = schemas["RawData"]
const CurrentGameDicts = schemas["CurrentGameDicts"]
const WantDict = schemas["WantDict"]
const TrackingArr = schemas["TrackingArr"]
const CsvData = schemas["CsvData"]

const dbOptions = {}
mongoose.connect(process.env.DB_URI, dbOptions)
// .then(() => MLCollection.deleteMany({}) )
// .then(() => SpreadsCollection.deleteMany({}) )
// .then(() => TotalsCollection.deleteMany({}) )
.then(() => console.log("0. DB IS CONNECTED!") )
.catch(() => console.log("ERROR: mongoDB did not connect"))

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
// PULLING DATA FROM API + SENDING TO App.js

// API GET MAIN SETTINGS
const PULL_ALL_US = false;
const GET_RAW_DATA = false;
var REAL_DATA = false;
REAL_DATA = true;
const LESS_TOTAL_GAMES = 32

// INITIAL VALUES
const defaultMarketBackup = "h2h"
const defaultSportBackup = "americanfootball_nfl"


////////////
// POST WANT DICT root
////////////
router.post('/wantdict', function(req, res,next) {
    console.log("\n\n\n$ NEW POST REQUEST FOR WANT DICT w:")
    const new_data = req.headers["dict"];
    const mkt = req.headers["market"];

    // console.log("\n\treq.headers[dict]: ")
    // console.log(new_data)

    if (mkt == "h2h") {
        WantDict.findOneAndUpdate(
            {_id:"wantDict"},
            { $set: { "data.h2h": new_data }}
        ).then(() => {console.log("WANT h2h STORED SUCCESS!")}).catch(err=>{console.log(err); res.json("Error! cannot save")})
    } else if (mkt == "spreads") {
        WantDict.findOneAndUpdate(
            {_id:"wantDict"},
            { $set: { "data.spreads": new_data }}
        ).then(() => {console.log("WANT spr STORED SUCCESS!")}).catch(err=>{console.log(err); res.json("Error! cannot save")})
    } else if (mkt == "totals") {
        WantDict.findOneAndUpdate(
            {_id:"wantDict"},
            { $set: { "data.totals": new_data }}
        ).then(() => {console.log("WANT tot STORED SUCCESS!")}).catch(err=>{console.log(err); res.json("Error! cannot save")})
    } 
});

router.post('/storetracking', function(req, res,next) {
    const new_data = req.headers["arr"];
    const mkt = req.headers["market"];
    console.log("\n\n\n$ NEW POST REQUEST FOR TRK ARR w: ", mkt)
    if (mkt == "h2h") {
        TrackingArr.findOneAndUpdate(
            {_id:"trackingIDs"},
            { $set: { "data.h2h": new_data }}
        ).then(() => {console.log("TRK h2h STORED SUCCESS!")}).catch(err=>{console.log(err); res.json("Error! cannot save")})
    } else if (mkt == "spreads") {
        TrackingArr.findOneAndUpdate(
            {_id:"trackingIDs"},
            { $set: { "data.spreads": new_data }}
        ).then(() => {console.log("TRK spr STORED SUCCESS!")}).catch(err=>{console.log(err); res.json("Error! cannot save")})
    } else if (mkt == "totals") {
        TrackingArr.findOneAndUpdate(
            {_id:"trackingIDs"},
            { $set: { "data.totals": new_data }}
        ).then(() => {console.log("TRK tot STORED SUCCESS!")}).catch(err=>{console.log(err); res.json("Error! cannot save")})
    } 
});

router.get('/pullwantdict', async function(req, res, next) {
    console.log("\n\n\n$ NEW PULL REQUEST FOR WANT DICT");
    var pull_market = req.headers["market"] 

    await WantDict.findById("wantDict")
    .then(function(mongo_response){
        var pulledData = mongo_response["data"][0]
        var marketSpecific = pulledData[pull_market]
        console.log("\tPULLED DATA FROM wantDict: \n\t",marketSpecific)

        res.send(marketSpecific); // already processed
    })
});

router.get('/pulltracking', async function(req, res, next) {
    var pull_market = req.headers["market"] 
    console.log("\n\n\n$ NEW PULL REQUEST FOR TRACKING ARR w ",pull_market);

    await TrackingArr.findById("trackingIDs")
    .then(function(mongo_response){
        var pulledData = mongo_response["data"][0]
        var marketSpecific = pulledData[pull_market]
        console.log("\tPULLED DATA FROM trackingIDs: \n\t",marketSpecific)

        res.send(marketSpecific); // already processed
    })
});


router.get('/pullcsv', async function(req, res,next) {
    var pull_market = req.headers["market"] 
    console.log("\n\n\n$ NEW PULL REQUEST FOR CSV DATA w ",pull_market);

    await CsvData.findById(pull_market)
    .then(function(mongo_response){
        var pulledData = mongo_response["data"]
        res.send(pulledData); // already processed
    })
})


////////////
// PULL SAVED REQS USED GET root
////////////
router.get('/reqs', async function(req, res,next) {
    console.log("\n\n\n$ NEW PULL REQUEST FOR REQS USED")
    await RawData.findById("reqsUsed")
    .then(function(mongo_response){
        var pulledData = mongo_response["data"]
        console.log("\tPULLED DATA FROM reqsUsed:\n\t\t",pulledData)
        res.send(pulledData); // already processed
    })
})


////////////
// PULL SAVED GameDicts GET root
////////////
router.get('/gamedict', async function(req, res,next) {
    var pull_market = req.headers["market"] 

    // console.log("\n\n\n$ NEW PULL REQUEST FOR SAVED GAME DICTS")
    // console.log("\twith header: ",pull_market )

    // PULL SAVED DICT DATA
    const pulledGame = await MLCollection.findById("CAZUNAM");

    await CurrentGameDicts.findById(pull_market)
    .then(function(mongo_response){
        var pulled_data = mongo_response["gameDict"]
        // console.log("\n\nPULLED DATA FROM  currentgamedicts:\n",pulled_data)
        res.send(pulled_data); // already processed
    })
})


////////////
// REFRESH GET root
////////////
router.get('/', async function(req, res,next) {
    console.log("\n* NEW GET REQUEST TO oddsAPI.js")
    // console.log("\twith headers: ",req.headers)

    // TODO: ONLY PROCEED IF CALL WAS NOT MADE WITHIN LAST MINUTE, OTHEREWSIE SEND STORED RAW DATA

    // RECEIVE AND CHECK HEADER VALS
    var current_market = req.headers["markets"] 
    var current_sport_key = req.headers["sport"] 
    var allBooks = req.headers["allbooks"] 

    var current_regions;
    if (allBooks === "true") {
        current_regions = "us,us2"
    } else if (allBooks === "false") {
        current_regions = "us"
    }
    // var current_sport_key;
    // await req.headers["sport"].then(function(sport_hdr){
    //     console.log("\tA.")
    //     current_sport_key = sport_hdr
    // })

    console.log("\tB.", current_market)
    console.log("\tB.", current_sport_key)
    console.log("\tB.", current_regions)

    // PULL ODDS DATA
    if (REAL_DATA){pullOddsFromSite(res, current_market, current_sport_key, current_regions);} 
    else{
        await RawData.findById(rawDataMarketNames[current_market])
        .then(function(mongo_response){
            var fake_data = mongo_response["data"]
            // console.log('fd: ',getRawDataMarketType(fake_data))

            var pullTime = (new Date()).toISOString();
            pullTime = pullTime.slice(0, -5); // take off seconds
            finishGet(res, fake_data, -88, 88, pullTime, current_market);
        })
    }
}) 

// AXIOS GETTING DATA FROM SITE
function pullOddsFromSite(get_res, market, sport, region) {
    console.log("\n1. pullOddsFromSite - running with Axios\n\tmkt: ",market,"sport: ",sport,"regions: ",region);
    axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/odds`, {params: {apiKey,regions:region,markets:market,oddsFormat,dateFormat}})
    .then(res => {
        console.log("2. pullOddsFromSite returning Data")
        let remaining = res.headers['x-requests-remaining']
        let used = res.headers['x-requests-used']

        var pullTime = (new Date()).toISOString();
        pullTime = pullTime.slice(0, -5); // take off seconds
        finishGet(get_res, res.data, used, remaining, pullTime, market);
    })
    .catch(error => {
        console.log('\nx x x x x x x x\nERROR in func: pullOddsFromSite')
        console.log('\tError status', error.res.status)
        console.log('\t',error.res.data)
    })
}

// RECEIVE AXIOS DATA + CALL PROCESS DATA FUNC
// SEND BACK TO App.js
async function finishGet(res, json_data, used, remaining, pullTime, market){
    //send raw data only when true
    if (GET_RAW_DATA == true){
        res.send(json_data); // already processed
    } else{
        // STORE RAW DATA FROM API IN MONGO - In case new call is made within same minute, dont have to waste Requests
        if (REAL_DATA){
            console.log("\t$ storing raw data in Mongo...")
            storeRawData(json_data, used, market)
        }
        // console.log("mkt check: ",market)

        let gameDictParsed = processData(json_data, market);
        console.log("\t- 3. processData Finished ",market)

        await storeHistoryData(gameDictParsed, pullTime, market).
        then(() => console.log("\t- 4. Storing history data finished!"))
        .catch((err) => console.log("\t- 4x. error in storing data",err))
        
        // TEXT FORMATTING + ADDING CHART DATA
        console.log("5. Finishing GameDict")
        const finalGameDict = await finishGameDict(gameDictParsed, market)
        // .then(function(finalGameDict) {
        //     // console.log(finalGameDict)
    
        //     console.log("8. gameDictParsed being sent\n")
        //     console.log('\tAPI Requests',parseInt(used),"/",parseInt(remaining)+parseInt(used))
        //     res.send([finalGameDict, used]);
        // })

        // STORE FULL GAMEDICT IN MONGODB
        console.log("6. Store full gameDict in Mongo")
        await storeGameDict(finalGameDict, market)

        console.log("\n7. buildAndStoreCSV called")
        const gamesCSV = buildAndStoreCSV(gameDictParsed, market)


        console.log("8. gameDictParsed being sent")
        console.log('\tAPI Requests',parseInt(used),"/",parseInt(remaining)+parseInt(used))
        res.send([finalGameDict, used, gamesCSV]);
        console.log("9. ALL DONE YAY!\n\n")
        // console.log(finalGameDict)

    }
}
///////////// END OF PULLING+SENDING DATA ////////////////////////

const collectionObjects = {"h2h":MLCollection, "spreads":SpreadsCollection,"totals":TotalsCollection}
async function storeHistoryData(game_dict, pullTime, market){
    console.log("4. Storing History data in Collections: ",market)
    var game_ids = Object.keys(game_dict)
    // game_ids = game_ids.slice(0,3)
    
    const CurrentCollection = await collectionObjects[market]
    // console.log("CurrentCollection: ", CurrentCollection)

    for (let i=0; i < game_ids.length; i++){
        let cur_game_id = game_ids[i]
        let odds = game_dict[cur_game_id]["odds"]


        let average_odd = calcAvgOdd(odds, market, cur_game_id)


        // CHECK IF GAME DOC EXISTS
        // console.log('\tSTORE GAME - ',cur_game_id)

        CurrentCollection.findOne({ _id: cur_game_id }).select("_id").lean().then(result => {
            if (result) {
                // console.log("\t+ GAME ALREADY EXISTS")
                CurrentCollection.findOneAndUpdate(
                    {_id:cur_game_id},
                    { $push: { 
                        odds: average_odd,
                        pullTimes: pullTime
                    }}
                ).then(() => {var idk = 0})
            } else {
                // console.log("\tx GAME DOES NOT EXIST")
                const newGame = new CurrentCollection({
                    _id: cur_game_id,
                    odds: [average_odd],
                    pullTimes: [pullTime]
                })
                newGame.save().then(() => {console.log('\t\tgame initialized')})
            }
        });
    }
}


async function storeGameDict(game_dict, market){
    CurrentGameDicts.findOneAndUpdate(
        {_id: market},
        { $set: {gameDict: game_dict}}
    ).then(() => {
        console.log('\t- 6. Finished storing GameDict')
    })
    
}

function buildAndStoreCSV(game_dict, market) {
    let csv_string = "TEAM,FD,DK,CES,MGM,E,BB,FLF\n"
    let all_book_ids = ["fanduel","draftkings","williamhill_us","betmgm","espnbet","ballybet","fliff"]
    let weekBroken = false

    var game_ids = Object.keys(game_dict)
    for (let i=0; i < game_ids.length; i++) {
        let curID = game_ids[i]
        let game = game_dict[curID]

        // CHECK FOR WEEK CHANGE
        if (!weekBroken){
            var tuesday = new Date();
            tuesday.setDate(tuesday.getDate() + (2 + 7 - tuesday.getDay()) % 7);
            var mo = tuesday.getMonth()
            if (mo < 10){mo = "0"+mo;}
            var threshold_date = ""+tuesday.getFullYear() + mo + tuesday.getDate() + "12"
            
            let game_date = parseInt(game["times"]["full"]) // 2024081220 YYYYMMDDHH
            if (game_date > threshold_date) {
                // add week break
                csv_string += "\nNEW WEEK\n"
                weekBroken = true
            }
        }
        
        let home_str = game["home"] + ","
        let away_str = game["away"] + ","
        
        let odds = game["odds"]
        let cur_book_ids = Object.keys(odds)

        for (let j=0; j < all_book_ids.length; j++) {
            let cur_book = all_book_ids[j]
            if (cur_book_ids.includes(cur_book)){
                let printodd1, printodd2;
                if (market == "h2h"){
                    printodd1 = odds[cur_book][0]
                    printodd2 = odds[cur_book][1] 
                } else if (market == "spreads"){
                    printodd1 = odds[cur_book][2]
                    printodd2 = odds[cur_book][3] 
                } else if (market == "totals"){
                    printodd1 = odds[cur_book][2]
                    printodd2 = printodd1
                }

                home_str += printodd1 + ","
                away_str += printodd2 + "," 
            } else{
                home_str += " ,"
                away_str += " ,"
            }  
        }
        let game_str = home_str + "\n" + away_str + "\n" 
        csv_string += game_str
    }
    storeCSV(csv_string, market)
    return csv_string
}
async function storeCSV(csv_string, market){
    CsvData.findOneAndUpdate(
        {_id: market},
        { $set: {data: csv_string}}
    ).then(() => {
        console.log('\t- 7?. Finished storing Csv Data')
    })
}


async function finishGameDict(game_dict, market) {
    const CurrentCollection = collectionObjects[market]
    var game_ids = Object.keys(game_dict)
    for (let i=0; i < game_ids.length; i++) {
        let game_id = game_ids[i]
        // console.log("$ ",game_dict[game_id]["home"])
        
    ///////////////////////////////
    // FORMAT INTO AMERICAN STRINGS
    ///////////////////////////////
        // REFORMAT "ODDS"
        let odds_dict = game_dict[game_id]["odds"]
        var book_ids = Object.keys(odds_dict)
        for (let b=0; b < book_ids.length; b++) {
            let book_id = book_ids[b]

            let odd1 = american(odds_dict[book_id][0])
            let odd2 = american(odds_dict[book_id][1])

            game_dict[game_id]["odds"][book_id][0] = odd1
            game_dict[game_id]["odds"][book_id][1] = odd2
        }
        // REFORMAT "CALCS"
        let best1, best2;
        if (market == "totals"){
            best1 = "o"+game_dict[game_id]["calcs"]["best"][0]
            best2 = "u"+game_dict[game_id]["calcs"]["best"][1]
            if (best1==="o0"){best1="-"}
            if (best2==="u0"){best2="-"}
        } else {
            best1 = american(game_dict[game_id]["calcs"]["best"][0])
            best2 = american(game_dict[game_id]["calcs"]["best"][1])    
        }
        game_dict[game_id]["calcs"]["best"][0] = best1
        game_dict[game_id]["calcs"]["best"][1] = best2

    ///////////////////////////////
    // ADD CHART DATA
    ///////////////////////////////
        const MAX_ODDS_HIST_LENGTH = 10
        await CurrentCollection.findById(game_id)
        .then(function(pulledGame){
            const pulledTimes = pulledGame["pullTimes"]
            const pulledOddsHistory = pulledGame["odds"]
            
            assert(
                (pulledTimes.length === pulledOddsHistory.length), 
                "MongoDB list lengths do not match: odds & times"
            )
    
            // FOR NOW JUST SEND LAST AVG
            // console.log("\tpullHist: ",pulledOddsHistory[0])
            let last_avg = pulledOddsHistory[pulledOddsHistory.length - 1]
            // let second_last_avg = pulledOddsHistory[pulledOddsHistory.length - 2]
            game_dict[game_id]["calcs"]["avg"] = last_avg.toFixed(1);
            // game_dict[game_id]["chartData"]["times"] = pulledTimes;
            // game_dict[game_id]["chartData"]["odds"] = pulledOddsHistory;
            let times20 = pulledTimes
            let odds20 = pulledOddsHistory

            if (times20.length > MAX_ODDS_HIST_LENGTH) {
                times20 = times20.slice(-MAX_ODDS_HIST_LENGTH) // TODO
                odds20 = odds20.slice(-MAX_ODDS_HIST_LENGTH) // TODO
            } 
            let unixTimes = []
            for (let i=0; i < times20.length; i++){
                // RAW = 2024-09-08T17:43:55Z
                let iso2date = new Date(times20[i]);
                let unixTime = iso2date.valueOf()

                unixTimes.push(unixTime)
            }

            game_dict[game_id]["chartData"]["times"] = unixTimes;
            game_dict[game_id]["chartData"]["odds"] = odds20;
            game_dict[game_id]["chartData"]["dirChange"] = getDirChange(unixTimes,odds20,market);
        
        }).catch(function(err) {
            console.log("\t? - BIGERROR!",err)
            game_dict[game_id]["calcs"]["avg"] = 0;
        })
    }
    console.log("\t- 5. Finished, returning GameDict")
    return game_dict
}

const marketScales = {
    "h2h": -5,
    "spreads": 2,
    "totals": 2,
}

function getDirChange(unixTimes,odds20,market) {
    const marketScale = marketScales[market]

    let curTime = unixTimes[unixTimes.length-1]
    let curOdd = odds20[odds20.length-1]

    let weight_sum = 0
    let val_sum = 0
    for (let i=0; i < unixTimes.length-1; i++){
        let t_delta = (curTime - unixTimes[i]) / 60000 // converts ms to minutes
        let t_delta_days = t_delta / 1440 // converts min to days
        // let weight = 1.1 / (1 + 3**(5*t_delta_days - 2))
        let weight = .1 / (2*(t_delta_days) + .1)
        let val = (odds20[i] - curOdd ) * weight
        weight_sum += weight
        val_sum += val
    }
    let w_avg = val_sum / weight_sum
    let change = -w_avg // / marketScale // negative to make down movement GOOD
   
    return change*100
}


//########################################################################################################//
//########################################################################################################//
//########################################################################################################//
// PROCESSING DATA NUMERICALLY + FORMATTING INTO SIMPLER DICTIONARY
function processData(JSON_data, market){
    console.log("3. processData running with mkt:",market)//,JSON_data["0e92fbe2ff57b1a7fd753bc2aea3edd2"])//["bookmakers"][0]["markets"][0]["outcomes"])
    let all_games_dict = {};
    let total_games = Math.min(JSON_data.length, 32) // so it doesnt pull further than 2 weeks
    total_games = total_games 
    // console.log("\n\n\n&&&& YEET\n", JSON_data,"\n\n");

    for (let game_idx=0; game_idx < total_games; game_idx++){
        let game_raw = JSON_data[game_idx];
        
        // BUILD DICT FOR APP.JS
        var vals_dict = {};
        try {
            vals_dict["times"] = buildTimeDict(game_raw["commence_time"])
        }
        catch {
            // vals_dict["times"] = buildTimeDict(game_raw["commence_time"])
            vals_dict["times"] = {"full":"","time":"LIVE","weekday":""}
            // console.log("\n\n\n&&&& YEET\n", game_raw,"\n\n");
        }
        vals_dict["home"] = translateName(game_raw["home_team"],toMy3Code) 
        vals_dict["away"] = translateName(game_raw["away_team"],toMy3Code)         

        vals_dict["odds"] = buildOddsDict(game_raw["bookmakers"], game_raw["home_team"], market)
        vals_dict["chartData"] = {times:[],odds:[]}


        if (Object.keys(vals_dict["odds"]).length === 0){
            console.log("empty odds dict")
            vals_dict["calcs"] = {"best":[0,0], "hold":"-", "bestBooks1":[], "bestBooks2":[]}
        } else {
            vals_dict["calcs"] = buildCalcsDict(vals_dict["odds"], market )
        }


        let myGameID = vals_dict["home"]+vals_dict["away"]+vals_dict["times"]["full"];
        all_games_dict[myGameID] = vals_dict
    }
    
    // console.log("\n\n* * * GAME DICT= ", all_games_dict)
    return all_games_dict
}




// + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
// + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
// + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
// BUILD ODDS DICT + CALCULATIONS
function buildOddsDict(bookmakers, home_name, mkt) {
    if (bookmakers == []){
        return {}
    }

    // ASSUME HOME TEAM LISTED FIRST
    let home_idx = 0
    let away_idx = 1
    let homeTeamCheck = ""
    try {
        homeTeamCheck = bookmakers[0]["markets"][0]["outcomes"][0]["name"]
    }
    catch {
    }
    if (homeTeamCheck != home_name) {
        home_idx = 1
        away_idx = 0
    }


    // console.log("\t3a. building OddsDict w mkt: ",mkt)
    var odds_dict = {};

    // BUILD MAIN ODDS ARRAYS
    for  (let d=0; d < bookmakers.length; d++){
        let book_data = bookmakers[d];
        let book_id = book_data["key"];
        // skip unwanted books
        if (myPlusSharpBooks.includes(book_id)){
            let odds_data = book_data["markets"][0]["outcomes"]
            if (mkt=="h2h"){
                let odd1 = odds_data[home_idx]["price"];
                let odd2 = odds_data[away_idx]["price"];
                odds_dict[book_id] = [odd1, odd2]
            } else if (mkt=="spreads"){
                let odd1 = odds_data[home_idx]["price"];
                let odd2 = odds_data[away_idx]["price"];
                let spread1 = odds_data[home_idx]["point"];
                let spread2 = odds_data[away_idx]["point"];
                odds_dict[book_id] = [odd1, odd2, spread1, spread2]
            } else if (mkt=="totals"){
                let over = odds_data[0]["price"];
                let under = odds_data[1]["price"];
                let total = odds_data[home_idx]["point"];
                odds_dict[book_id] = [over, under, total] 
            } else{
                console.log('MARKET ERROR - not a valid market: ', mkt)
            }
        }
    }

    return odds_dict
}

function buildCalcsDict(odds_dict, mkt) {
    // MAKE CALCULATIONS
    var calcs_dict = {};

    var bestLineRes = getBestLine(odds_dict, mkt);
    calcs_dict["best"] = bestLineRes[0];
    calcs_dict["bestBooks1"] = bestLineRes[1];
    calcs_dict["bestBooks2"] = bestLineRes[2];
    
    calcs_dict["hold"] = getHold(odds_dict, mkt);
    // console.log(calcs_dict["hold"])

    return calcs_dict
}


function getBestLine(odds_dict, mkt) {
    if (Object.keys(odds_dict).length === 0){
        console.log("empty odds dict")
        return [[0,0], [], []]
    }

    // console.log("getting best line w: ",mkt, "\n",odds_dict)
    const init_val = -999999999;
    let best1 = init_val;
    let best2 = init_val;
    let bp1 = 1;
    let bp2 = 1;
    let bestBooks1 = []
    let bestBooks2 = []

    for(let [book_id, odds_data] of Object.entries(odds_dict)) {
        // skip unwanted books
        if (myBooks.includes(book_id)){
            if (mkt == "h2h"){ // max price
                let [odd1, odd2] = odds_data;
                if (odd1 > best1) {
                    best1 = odd1
                    bestBooks1 = [book_id]
                } else if (odd1 == best1) { 
                    best1 = odd1
                    bestBooks1.push(book_id) 
                }
                if (odd2 > best2) {
                    best2 = odd2
                    bestBooks2 = [book_id]
                } else if (odd2 == best2) { 
                    best2 = odd2
                    bestBooks2.push(book_id) 
                }
            } else if (mkt == "spreads"){ // max spread
                let [price1, price2, spread1, spread2] = odds_data;
                price1 = odd2prob(price1)
                price2 = odd2prob(price2)

                if (spread1 > best1) {
                    best1 = spread1
                    bp1 = price1
                    bestBooks1 = [book_id]
                } else if (spread1 == best1) { 
                    if (price1 < bp1){
                        bp1 = price1
                        bestBooks1 = [book_id]
                    } else if (price1 == bp1){
                        bestBooks1.push(book_id) 
                    }
                }
                if (spread2 > best2) {
                    best2 = spread2
                    bp2 = price2
                    bestBooks2 = [book_id]
                } else if (spread2 == best2) { 
                    if (price2 < bp2){
                        bp2 = price2
                        bestBooks2 = [book_id]
                    } else if (price2 == bp2){
                        bestBooks2.push(book_id) 
                    }
                }
            } else if (mkt == "totals"){ // min over, max under
                if (best1 ===  init_val) { 
                    best1 = -1*init_val 
                }
                let [priceO, priceU, total] = odds_data;
                priceO = odd2prob(priceO)
                priceU = odd2prob(priceU)

                if (total < best1) {
                    best1 = total
                    bp1 = priceO
                    bestBooks1 = [book_id]
                } else if (total == best1) { 
                    if (priceO < bp1){
                        bp1 = priceO
                        bestBooks1 = [book_id]
                    } else if (priceO == bp1){
                        bestBooks1.push(book_id) 
                    }
                }
                if (total > best2) {
                    best2 = total
                    bp2 = priceU
                    bestBooks2 = [book_id]
                } else if (total == best2) { 
                    if (priceU < bp2){
                        bp2 = priceU
                        bestBooks2 = [book_id]
                    } else if (priceU == bp2){
                        bestBooks2.push(book_id) 
                    }
                }
            }
        }
    }
    if (best1 === init_val || best2 === init_val) {
        return null
    }
    
    // console.log("\n\nRESPONSE")
    // console.log([[best1,best2], bestBooks1, bestBooks2])
    return [[best1,best2], bestBooks1, bestBooks2]
}

function getHold(odds_dict, mkt) {
    // console.log("\n____________________________\n\nHOLD CALC", odds_dict)


    // BUILD ARRAYS FOR EASIER ANALYSIS
    let prices1 = [];
    let prices2 = [];
    let lines1 = [];
    let lines2 = [];

    for(let [book_id, odds_data] of Object.entries(odds_dict)) {
        // skip unwanted books
        if (myBooks.includes(book_id)){
            if (mkt == "h2h"){ // max price
                let [odd1, odd2] = odds_data;
                prices1.push(odd1)
                prices2.push(odd2)
            } else if (mkt == "spreads"){ // max spread)

                let [odd1, odd2, spread1, spread2] = odds_data;
                prices1.push(odd1)
                prices2.push(odd2)
                lines1.push(spread1)
                lines2.push(spread2)

            } else if (mkt == "totals"){ // min over, max under
                let [over, under, total] = odds_data;
                prices1.push(over)
                prices2.push(under)
                lines1.push(total)
                lines2.push(total)
            }
        }
    }

    // CALCULATE HOLDS
    let best1 = -9999999999999999999
    let best2 = -9999999999999999999
    if (mkt == "h2h"){ 
        best1 = Math.max(...prices1)
        best2 = Math.max(...prices2)

        let p1 = odd2prob(best1)
        let p2 = odd2prob(best2)
        return [calcHoldPercent(p1,p2),""]
    } else if (mkt == "spreads" || mkt == "totals"){ 
        let maxLine = Math.max(...lines1)
        let minLine = Math.min(...lines1)
        let diff = maxLine - minLine
        let diffStr = diff.toString()

        let modeLine1 = findMode(lines1);
        let modeLine2 = findMode(lines2);
        for (let i=0; i < lines1.length; i++){
            if (lines1[i] === modeLine1){

                let price = prices1[i]
                if (price > best1) { 
                    best1 = price 
                }            
            }
            // console.log("\t2. ",lines2[i]," = ", modeLine2)
            if (lines2[i] === modeLine2){

                let price = prices2[i]
                if (price > best2) { 
                    best2 = price
                }            
            }
        }

        let p1 = odd2prob(best1)
        let p2 = odd2prob(best2)
        return [calcHoldPercent(p1,p2),diffStr]
    }
}


// {}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}
// {}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}
// {}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}
// MONGO STORAGE HELPER FUNCS

router.get('/getHistory', (req, res) => {
    console.log("\nROUTER.GET HISTORY CALL")
    MLCollection.find()
    .then(hist => res.json(hist))
    .catch(err => res.json(err))

    console.log("\n")
})

const rawDataMarketNames = {
    "h2h":"RawML",
    "spreads":"RawSpreads",
    "totals":"RawTotals"
}
async function storeRawData(raw_data, used, mkt){
    RawData.findOneAndUpdate(
        {_id: rawDataMarketNames[mkt]},
        { $set: {data: raw_data}}
    ).then(() => {
        console.log('\t$ finished updating raw data in mongodb: ',rawDataMarketNames[mkt])
    })
    RawData.findOneAndUpdate(
        {_id: "reqsUsed"},
        { $set: {data: [used]}}
    ).then(() => {
        console.log('\t$ finished updating ReqsUsed in mongodb: ', used)
    })
}


async function dbSave() {
    const newGame = new MLCollection({
        _id:"CAZUNAM",
        pullTimes:["0312"],
        odds:[2]
    })
    const saveGame = await newGame.save()
    if (saveGame) {
        console.log("\n!!!!!!!!!!!!!!\nDB WAS SAVED YAYYY")
    } else {
        console.log("\nx x x x x x x x\nDB !NOT! SAVED YAYYY")

    }
}



async function dbUpdate() {
    console.log("\nDB UPDATE CALL")

// TIMESTAP MODULE
    // var pullTime = (new Date()).toISOString();
    // pullTime = pullTime.slice(0, -5); // take of seconds

// PULL MODULE
    // const pulledGame = await MLCollection.findById("CAZUNAM");
    // const pulledTimes = pulledGame["pullTimes"]
    // const pulledOddsHistory = pulledGame["odds"]

    // assert(
    //     (pulledTimes.length === pulledOddsHistory.length), 
    //     "MongoDB list lengths do not match: odds & times"
    // )
    // // console.log("\n\n! ! ! !\npulledgame")
    // // console.log(pulledOddsHistory)
   
// UPDATE MODULE
    // MLCollection.findOneAndUpdate(
    //     {_id:"CAZUNAM"},
    //     { $push: { 
    //         odds: 11,
    //         pullTimes: "nondup"
    //     }}
    // ).then(() => {
    //     console.log('yay')
    // })


// CREATE DOCUMENT MODULE
    // const newGame = new schemas.MLCollection({
    //     _id:"MUN-MCI"
    // })
    // await newGame.save()

// DELETE DOCUMENT MODULE
    // await MLCollection.findByIdAndDelete("CAZUNAM");
}



// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ //
// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ //
// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ //
// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ //
// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ //
// HELPERS + MORE SETTINGS


// the-odds-api.com api pulls
const oddsFormat = 'american' // decimal | american
const dateFormat = 'iso' // iso | unix
const myBooks = [
    // my books
    "draftkings",
    "williamhill_us",
    "betmgm",
    "espnbet",
    "ballybet",
    // "betrivers",
    "fliff",
    "fanduel",
    "betonlineag"
]
const sharpBooks = [
    "fanduel",
    "draftkings",
    "williamhill_us",
    "betmgm",
    "espnbet",
    // just sharp
    "bovada",
    "lowvig",
    "betonlineag"
]
const myPlusSharpBooks = [
    // my books
    "draftkings",
    "williamhill_us",
    "betmgm",
    "espnbet",
    "ballybet",
    // "betrivers",
    "fliff",
    "fanduel",
    // sharp tracking
    "bovada",
    "lowvig",
    "betonlineag"
]

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function odd2prob(odd){
    // '=if(d>0,100/(100+d),-d/(100-d))
    if (odd > 0){
        return 100 / (100 + odd)
    } else {
        return -1 * odd / (100 - odd)
    }
}

function prob2odd(prob){
    // reuturns number not string
    if (prob < .5){
        return 100/prob -100
    } else {
        return 100*prob / (prob-1)
    }
}

function calcHoldPercent(p1,p2){
    // returns string in format "0.0%""
    return ((1 - (p1 + p2))*100).toFixed(1) + "%"
}

function translateName(input,dict) {
    return dict[input]
}

function findMode(lines) {
    const frequencyMap = {};
    lines.forEach(number => {
        frequencyMap[number] =
            (frequencyMap[number] || 0) + 1;
    });

    let mode = null;
    let maxFrequency = 0;
    for (const number in frequencyMap) {
        const frequency = frequencyMap[number];
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            mode = parseFloat(number);
        }
    }
    return mode
}

function american(num) {
    // convert number to string in +000,-000 format
    if (num > 0){
        return "+"+num
    } else if (num < 0){
        return num.toString()
    } else {
        return "-"
    }
}

const weekdays = ['SUN','MON','TUE','WED','THU','FRI','SAT']
function buildTimeDict(utc_time){
    var et_time = new Date(utc_time)
    // var current_time = new Date().getTime().toISOString() // TODO

    // console.log("\nGET TIME:")
    // console.log("\tGAME: ", et_time)
    // console.log("\tCURR: ", current_time)
    // console.log("\tC>G: ", et_time < current_time)

    var yr = et_time.getFullYear()
    var mo = et_time.getMonth()
    var day = et_time.getDate()
    var hr = et_time.getHours()
    var minute = et_time.getMinutes()
    var wkday_idx = et_time.getDay() // 0-6 index starting Sunday
    if (minute < 10){minute = "0"+minute;}
    
    // FORMAT NICELY
    var weekday = weekdays[wkday_idx]
    var time = hr+":"+minute

    // FULL DATE CODE FOR IDs
    if (mo < 10){mo = "0"+mo;}
    var full = ""+yr + mo + day + hr
    
    var timeDict = {
        "full":full,
        "weekday":weekday,
        "time":time
    }

    return timeDict
}


function getRawDataMarketType(data){
    var k = Object.keys(data)[0]
    var m = data[k]["bookmakers"][0]["markets"][0]["key"]
    return m
}

const TEST_ID = "NOLAR202411116"
function calcAvgOdd(odds, market, cur_game_id){
    const diffScaling = 2;
    var book_ids = Object.keys(odds)

    //  ARRDATA = prices1, prices2, lines1
    var arrData = [[],[],[]]
    
    
    let mkt_data_size = odds[book_ids[0]].length
    let data_depth = Math.min(mkt_data_size, 3)

    // BUILD ARRAYS FOR EASIER ANALYSIS
    for (let i=0; i < data_depth; i++){
        for (let b=0; b < book_ids.length; b++){
            if (sharpBooks.includes(book_ids[b])) {
                // console.log(book_ids[b])
                let num = odds[book_ids[b]][i]
                if (i < 2){ // convert odds to probs
                    num = odd2prob(num)
                }
                arrData[i].push(num)
            }
        }
    }
    // console.log("\n\n=============================\nCALCULATING AVG WITH ODDS:\n",odds)
    // console.log("\nAND arrData:\n",arrData)

    // CALCULATE AVERAGES
    let final_avg = 0
    if (market == "h2h"){
        let avg_p1 = average(arrData[0])
        let avg_p2 = average(arrData[1])
        let normp1 = avg_p1 / (avg_p1 + avg_p2)
        let normp2 = avg_p2 / (avg_p1 + avg_p2)
        let normp2_inv = 1 - normp2
        let avg_prob = average([normp1,normp2_inv])
        final_avg = prob2odd(avg_prob)
    } else if (market == "spreads" || market == "totals"){
        if (cur_game_id == TEST_ID) {
            console.log("\n\nCALC AVG ODDSSSSS")
            console.log(odds)
            console.log("arrData: ",arrData)
        }
        let adj_lines = [];
        for (let i=0; i < arrData[0].length; i++){
            let p1 = arrData[0][i]
            let p2 = arrData[1][i]
            let normp1 = p1 / (p1 + p2)
            let normp2 = p2/ (p1 + p2)
            let normp2_inv = 1 - normp2
            let avg_p = average([normp1,normp2_inv])
            let diff = (avg_p - 0.5) * 22
            
            let og_line = arrData[2][i]
            let adjusted_line = og_line
            if (og_line > 0) {
                adjusted_line += -diff
            } else {
                adjusted_line += diff
            }
            adj_lines.push(adjusted_line)

            if (cur_game_id == TEST_ID) {
                console.log("************")
                console.log("ps: " ,p1," / ",p2)
                console.log("avg_p: ",avg_p)
                console.log("diff: ",diff)
                console.log("adj_line: ",adjusted_line)
            }
        }
        final_avg = average(adj_lines)

        if (cur_game_id == TEST_ID) {
            console.log("************")
            console.log("adj_lines: ",adj_lines)
            console.log("final_avg: ",final_avg)
        }
    }
    return final_avg
}

function average(arr){
    let total=0;
    for(var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total / arr.length;
}

const toMy3Code = {
    // odds-api to my personal 3 letter codes

    // MLB
    'Arizona Diamondbacks':'ARI',
    'Atlanta Braves':'ATL',
    'Baltimore Orioles':'BAL',
    'Boston Red Sox':'BOS',
    'Chicago Cubs':'CHC',
    'Chicago White Sox':'CHW',
    'Cincinnati Reds':'CIN',
    'Cleveland Guardians':'CLE',
    'Colorado Rockies':'COL',
    'Detroit Tigers':'DET',
    'Houston Astros':'HOU',
    'Kansas City Royals':'KC',
    'Los Angeles Angels':'LAA',
    'Los Angeles Dodgers':'LAD',
    'Miami Marlins':'MIA',
    'Milwaukee Brewers':'MIL',
    'Minnesota Twins':'MIN',
    'New York Mets':'NYM',
    'New York Yankees':'NYY',
    'Oakland Athletics':'OAK',
    'Philadelphia Phillies':'PHI',
    'Pittsburgh Pirates':'PIT',
    'San Diego Padres':'SD',
    'San Francisco Giants':'SF',
    'Seattle Mariners':'SEA',
    'St. Louis Cardinals':'STL',
    'Tampa Bay Rays':'TB',
    'Texas Rangers':'TEX',
    'Toronto Blue Jays':'TOR',
    'Washington Nationals':'WAS',
    
    // NFL
    'Arizona Cardinals':'ARI',
    'Atlanta Falcons':'ATL',
    'Baltimore Ravens':'BAL',
    'Buffalo Bills':'BUF',
    'Carolina Panthers':'CAR',
    'Chicago Bears':'CHI',
    'Cincinnati Bengals':'CIN',
    'Cleveland Browns':'CLE',
    'Dallas Cowboys':'DAL',
    'Denver Broncos':'DEN',
    'Detroit Lions':'DET',
    'Green Bay Packers':'GB',
    'Houston Texans':'HOU',
    'Indianapolis Colts':'IND',
    'Jacksonville Jaguars':'JAC',
    'Kansas City Chiefs':'KC',
    'Las Vegas Raiders':'LV',
    'Los Angeles Chargers':'LAC',
    'Los Angeles Rams':'LAR',
    'Miami Dolphins':'MIA',
    'Minnesota Vikings':'MIN',
    'New England Patriots':'NE',
    'New Orleans Saints':'NO',
    'New York Giants':'NYG',
    'New York Jets':'NYJ',
    'Philadelphia Eagles':'PHI',
    'Pittsburgh Steelers':'PIT',
    'San Francisco 49ers':'SF',
    'Seattle Seahawks':'SEA',
    'Tampa Bay Buccaneers':'TB',
    'Tennessee Titans':'TEN',   
    'Washington Commanders':'WAS'
}



module.exports=router