import { getResponseFromGpt } from "./ai/ai";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { title, mainSubject } = req.body

    const prompt = `
            Write an example of "${title}" in the real world. try to be as specific as possible.
            it should be related to the subject: ${mainSubject}.
            return a JSON object with 2 keys:
                1. "text": a paragraph describing an example of "${title}" in the real world. try to be as specific as possible.
                2. "title": a title of the example.
    `;


    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}