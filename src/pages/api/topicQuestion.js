import { getResponseFromGpt } from "./ai/ai";
import { addConfigToPrompt } from "./config";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { question, topic, subTopic, course, degree } = req.body


    const prompt = `
        I am taking a university level (ivy league) course on "${course}" as a part the Undergraduate Major in "${degree}".
        I am studying the subtopic "${subTopic}" in the topic "${topic}" in the course "${course}".

        As part of the course I need to answer the question about ${subTopic}. This is the question:

        ${question}

        
        --- END OF QUESTION ---

        Guidelines for response:

        Answer the question in the context of the topic: ${subTopic}, ${topic} in the course ${course} of the Undergraduate Major in ${degree}.
        Only add the relevant content of the topic that will be discussed in the lecture about ${topic} in the course ${course}.
        
        Return a json array with 2 keys:
        1. answer (type: string): the answer to the question. 


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