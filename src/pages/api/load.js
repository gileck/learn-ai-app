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
    const { type, mainSubject, exclude, config } = req.body
    console.log({ type, mainSubject, exclude });

    const promptByType = {
        "subjects": `
            return an array of 5 subjects (sub topics) related to the subject: ${mainSubject}.
            each subject is an object with 2 keys: 
                1. "name": a string that represents the subject.
                2. "description": a very short one liner that describes the subject in one sentence.
            `,
        "questions": `
            return an array of 5 questions related to ${mainSubject}`,
        "examples": `
            return an array of 5 examples related to ${mainSubject}. each example is JSON object with 2 keys: 
                1. "text": ${addConfigToPrompt(config)}, describing an example of "${mainSubject}" in the real world. try to be as specific as possible.
                2. "title": a title of the example.
            `,
        "facts": `
            return an array of 5 interesting facts related to ${mainSubject}. each fact is an object with 2 keys: 
                1. "text": ${addConfigToPrompt(config)}, describing an interesting fact of "${mainSubject}" that is not commonly known.
                2. "title": a very short title of the fact.
            `

    }


    const prompt = `    
        I want to learn about "${mainSubject}".
        My goal is to understand "${mainSubject}" in a comprehensive way.
        
        ${promptByType[type]}

        

        ${exclude ? "do not include: " + exclude.join(', ') : ''}

        --------------

        return the result in a JSON with a key named "${type}" that contains an array of strings.
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