import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const PORT = 8000;
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/gemini', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const chat = model.startChat({
        history: req.body.history.map(item => ({
            role: item.role || "user", // Ensure "user" is set for the first message if missing
            parts: Array.isArray(item.parts) ? item.parts : [item.parts]
        }))
    });
    
    const msg = req.body.message

    const result = await chat.sendMessage(msg)
    const response = await result.response
    const text = response.text()
    res.send(text)
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});