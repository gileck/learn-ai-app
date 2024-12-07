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
    const { context, text } = req.body
    const { degree, course, topic, subTopic } = context;
    console.log({ context, text });

    const prompt = `    
        I am taking a course on "${course}" as a part of the Undergraduate Major in "${degree}".
        I am currently studying the topic "${topic}" and I am trying to understand the subtopic "${subTopic}".

        I have a question or a request for more information on the following:

        "${text}"

        

        
    `;

    // console.log({ prompt });

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: false,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}