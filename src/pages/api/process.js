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
    const { mainSubject } = req.body
    console.log({ mainSubject });




    const prompt = `    
        I want to learn the process of "${mainSubject}".
        My goal is to understand "${mainSubject}" in a comprehensive way.
        I want to understand the process of "${mainSubject}" in a step by step manner.
        each step should be a single sentence.
        return the result in a JSON object with 1 key: "process".
        the value of the "process" key should be an array of objects, with each item being a step in the process.
        each item is an object with 2 keys:
            1. "title": a string that represents the title of the step.
            2. "description": a very short one liner that describes the step in one sentence.
    `;

    // console.log({ prompt });

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}