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
        I want to start a university level (ivy league) degree on the subject "${mainSubject}".
        Return a JSON array of most popular degrees (top 5-6) that ivy league universities offer in order to learn about "${mainSubject}".
        No need to differentiate between the masters and bachelors, PHD degrees or any other type of degree.

        Return a JSON object with 1 key named "degrees" - the array of degrees, with each degree being an object with 2 keys:
            1. "title": a string that represents the title of the degree (just the subject, no types of degrees).
            2. "description": a very short one liner that describes the degree in one sentence.

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