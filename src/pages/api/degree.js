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
    const { degree } = req.body
    console.log({ degree });

    const prompt = `    
        I want to start a university level (ivy league) Major degree on "${degree}".
        Return a JSON array of all courses that I need to take to complete a degree in "${degree}" in ivy league university.
        The order of the courses should be in the order that I need to take them (from basic to advanced).
        Each course should have a title and a description.

        Return a JSON object with 1 key named "courses" - the array of courses, with each course being an object with 2 keys:
            1. "title": a string that represents the title of the course.
            2. "description": a very short one liner that describes the course in one sentence.

        The courses should be in the order that I need to take them (from basic to advanced).
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