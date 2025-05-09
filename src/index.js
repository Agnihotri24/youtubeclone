import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db-conn.js";
import app from './app.js'

dotenv.config();

// connect to MongoDB
connectDB()
.then(()=>
{
  app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

})
.catch(()=>
{
    console.log("Something issue to connection with database");
})


