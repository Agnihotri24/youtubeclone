import mongoose from 'mongoose'

// creating the schema
const subscriptionSchema = new mongoose.Schema({
     subscriber : 
     {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     },
     channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     }
},
{timeseries : true});

// creating the models
export const Subscription = mongoose.model("Subscription", subscriptionSchema)