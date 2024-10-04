import { getResponseFromGpt } from "./ai/ai";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { exclude } = req.body;


    const prompt = `
    return an array of random 5 subjects to learn about.
    return a JSON object with a single key "subjects" that contains an array of subjects.
    each subject is a an object with 2 keys:
        1. "name": a string that represents the subject.
        2. "description": a very short one liner that describes the subject in one sentence.
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