const mongoose = require('mongoose')
const Schema = mongoose.Schema

const oddsCollectionSchema = new Schema({
    _id: {type:String, required:true}, // game id
    pullTimes: {type:Array, required:true},
    odds: {type:Array, required:true}
})
const rawDataSchema = new Schema({
    _id: {type:String, required:true}, //market type
    data: {type:Array, required:true}
})
const gameDictSchema = new Schema({
    _id: {type:String, required:true}, //market type
    gameDict: {type:Object, required:true}
})
const WantDictSchema= new Schema({
    _id: {type:String, required:true}, //market type
    data: {type:String, required:true}
})


// const timeLogSchema = new Schema({
//     _id: {type:String, required:true},
//     pullTimes: {type:Date, default:Date.now} //
// })



const MLCollection = mongoose.model("MLCollection", oddsCollectionSchema, "MLCollection")
const SpreadsCollection = mongoose.model("SpreadsCollection", oddsCollectionSchema, "SpreadsCollection")
const TotalsCollection = mongoose.model("TotalsCollection", oddsCollectionSchema, "TotalsCollection")
const RawData = mongoose.model("CurrentRawData", rawDataSchema, "CurrentRawData")
const CurrentGameDicts = mongoose.model("CurrentGameDicts", gameDictSchema, "CurrentGameDicts")
const WantDict = mongoose.model("WantDict", WantDictSchema, "WantDict")

const mySchemas = {
    "MLCollection":MLCollection, 
    "SpreadsCollection":SpreadsCollection, 
    "TotalsCollection":TotalsCollection, 
    "RawData":RawData,
    "CurrentGameDicts":CurrentGameDicts,
    "WantDict":WantDict}

module.exports = mySchemas