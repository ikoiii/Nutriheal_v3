import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
const data = await res.json();
console.log(data);
