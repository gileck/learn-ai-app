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
    const { course, degree } = req.body
    console.log({ course, degree });

    const prompt = `    
        I want to start a university level (ivy league) course on "${course}" as a part the Undergraduate Major in "${degree}".

        Return a JSON array of all classes that are a part of the curriculum of the course "${course}" in ivy league university.
        In Each Class I want to learn about 1 topic or subject as part of the course.
        The order of the classes should be in the order that I need to take them in order to finish the course (from basic to advanced).
        Each class should have a title and a description.

        Return a JSON object with 1 key named "topics" - the array of classes (each class is a topic), with each class being an object with 2 keys:
            1. "title": a string that represents the title of the class.
            2. "description": a very short one liner that describes the class in one sentence.

        The topics should be in the order that I need to take them in the course (from basic to advanced).
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