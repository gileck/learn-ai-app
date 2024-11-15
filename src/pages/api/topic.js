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
    const { topic, course, degree } = req.body
    console.log({ topic, course, degree });

    const prompt = `    
        I am taking a university level (ivy league) course on "${course}" as a part the Undergraduate Major in "${degree}".
        I want to learn about "${topic}" as part of the course.

        Write an overview of the topic "${topic}" in the course "${course}" in ivy league university.
        Add everything I need to know about the topic "${topic}" in the course "${course}" in ivy league university.

        Return a JSON object with 2 keys:
            1. "title": a string that represents the title of the topic.
            2. "overview": a short overview of the topic
            3. subTopics: a JSON array of subtopics that are part of the topic. Each subtopic should have a title and a description.

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