import { getResponseFromGpt } from "./ai/ai";
import { addConfigToPrompt } from "./config";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { question, mainSubject, config } = req.body


    const prompt = `
        I have a question about ${mainSubject}:

        ${question}

        
        --- END OF QUESTION ---

        Guidelines for response:
        
        Return a json array with 2 keys:
        1. answer (type: string): the answer to the question. the answer should be ${addConfigToPrompt(config)}
        2. subject (type: string): a very short subject name of the answer - used to read more about the answer


    `;

    console.log({ prompt });

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}