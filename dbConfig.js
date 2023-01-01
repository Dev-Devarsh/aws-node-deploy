
import {connect}  from 'mongoose';
import { config } from "dotenv";
config()

connect(process.env.MONGO).then(() => {
  console.log('connection successful');
}).catch((err) =>{
  console.log(`Error connecting to MongoDB ${err}`);
});
