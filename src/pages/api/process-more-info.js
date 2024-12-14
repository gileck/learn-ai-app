import { getResponseFromGpt } from "./ai/ai";
import { addConfigToPrompt } from "./config";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

function parseConfig(configRaw) {
    try {
        const config = configRaw
        return { ...configDefaults, ...config }
    } catch (error) {
        return {}
    }
}

export default async function handler(req, res) {
    const { title, description, request, context } = req.body



    const prompt = `    
        I am learning about the process of "${title}".
        ${context ? `in the context of "${JSON.stringify(context)}".` : ''}

        I was told that the process of "${title}" is: "${description}".

        I have a question or a request for more information:

        "${request}"
    `;


    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: false,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}