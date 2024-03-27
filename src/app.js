import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"


const app= express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16kb"})); //form data
app.use(express.urlencoded({extended:true,limit:"16kb"}))//url data
app.use(express.static("public"))//stores files like images,pdfs
app.use(cookieParser())//do CRUD operations on client's browser


export {app};