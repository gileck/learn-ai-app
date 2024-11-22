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
    const { topic, course, degree, subTopic } = req.body
    console.log({ topic, course, degree, subTopic });

    const prompt = `    
        
        I am taking a university level (ivy league) course on "${course}" as a part the Undergraduate Major in "${degree}".
        you need to generate the content of the topic: "${subTopic}" as part of the lecture ${topic} in the course "${course}" in ivy league university.
        only add the relevant content of the topic: ${subTopic} that will be discussed in the lecture about ${topic} in the course ${course}.
        
        Return a JSON object with the following keys:
            "introduction": a short introduction to ${subTopic}
            "concepts: a JSON array of the main 1-3 concepts that are part of the topic in the context of the class. 
                Each concept should have: a title and a description. 
                The description should be a detailed explanation of the concept. should be at least 3 paragraphs long. be as detailed as possible. be sure to include all the important points.

            "questions": a JSON array of questions that can be asked in the exam on the topic. Each question should have a title and a description.
            "examples: a JSON array of real world examples that can be used to explain the concepts. Each example should have a title and a description.
            
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