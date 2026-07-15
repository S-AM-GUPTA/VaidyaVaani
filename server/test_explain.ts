import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

(async () => {
    try {
        console.log("Testing with FLASH");
        const resFlash = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Hello"
        });
        console.log("Flash Success");
        
        console.log("Testing with PRO");
        const resPro = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: "Hello"
        });
        console.log("Pro Success");
    } catch (e) {
        console.error("FAIL:", e);
    }
})();
