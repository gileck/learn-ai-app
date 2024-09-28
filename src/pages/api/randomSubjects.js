import { getResponseFromGpt } from "./ai/ai";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { exclude } = req.body;
    console.log({ exclude });


    const prompt = `
    return an array of random 5 subjects to learn about.
    return a JSON object with a single key "subjects" that contains an array of strings.
    ${exclude ? "do not include: " + exclude.join(', ') : ''}
    `;

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}