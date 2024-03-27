import 'dotenv/config'
import connectDB from "./db/index.js";
import { app } from './app.js';

const port=process.env.PORT
connectDB()
.then(()=>{
    app.listen(port||8000,()=>{
        console.log(`Server running on PORT: ${port}`);
    })
})
.catch((err)=>{console.log("MONGODB connection failure",err)})