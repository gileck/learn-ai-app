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
        you need to generate the content of the lecture: "${topic}" in the course "${course}" in ivy league university.
        only add the content that will be discussed in the lecture about ${topic} in the course ${course}.
        

        Return a JSON object with the following keys:
            "overview": a short overview of the topic: ${topic}
            "introduction": a short introduction to: ${topic}
            "subTopics": a JSON array of subtopics that are part of the topic in the context of the class. Each subtopic should have a title and a description. add only sub topics that will be discussed in the class.
            "questions": a JSON array of questions that can be asked in the exam on the topic. Each question should have a title and a description.

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