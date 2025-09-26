import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const oddsCollectionSchema = new Schema({
    _id: {type:String, required:true}, // game id
    pullTimes: {type:Array, required:true},
    odds: {type:Array, required:true}
});

const rawDataSchema = new Schema({
    _id: {type:String, required:true}, //market type
    data: {type:Array, required:true}
});

const gameDictSchema = new Schema({
    _id: {type:String, required:true}, //market type
    gameDict: {type:Object, required:true}
});

const WantDictSchema = new Schema({
    _id: {type:String, required:true}, //market type
    data: {type:Array, required:true}
});

const TrackingArrSchema = new Schema({
    _id: {type:String, required:true}, //market type
    data: {type:Array, required:true}
});

const CsvDataSchema = new Schema({
    _id: {type:String, required:true}, //market type
    data: {type:String, required:true}
});

// Create models with error handling to prevent overwrite errors
const MLCollection = mongoose.models.MLCollection || mongoose.model("MLCollection", oddsCollectionSchema, "MLCollection");
const SpreadsCollection = mongoose.models.SpreadsCollection || mongoose.model("SpreadsCollection", oddsCollectionSchema, "SpreadsCollection");
const TotalsCollection = mongoose.models.TotalsCollection || mongoose.model("TotalsCollection", oddsCollectionSchema, "TotalsCollection");
const RawData = mongoose.models.CurrentRawData || mongoose.model("CurrentRawData", rawDataSchema, "CurrentRawData");
const CurrentGameDicts = mongoose.models.CurrentGameDicts || mongoose.model("CurrentGameDicts", gameDictSchema, "CurrentGameDicts");
const WantDict = mongoose.models.WantDict || mongoose.model("WantDict", WantDictSchema, "WantDict");
const TrackingArr = mongoose.models.TrackingArr || mongoose.model("TrackingArr", TrackingArrSchema, "TrackingArr");
const CsvData = mongoose.models.CsvData || mongoose.model("CsvData", CsvDataSchema, "CsvData");

const mySchemas = {
    "MLCollection": MLCollection, 
    "SpreadsCollection": SpreadsCollection, 
    "TotalsCollection": TotalsCollection, 
    "RawData": RawData,
    "CurrentGameDicts": CurrentGameDicts,
    "WantDict": WantDict,
    "TrackingArr": TrackingArr,
    "CsvData": CsvData
};

export default mySchemas;
