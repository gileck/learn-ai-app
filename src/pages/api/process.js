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



    const prompt = `    
        I want to learn the process of: "${text}".

        ${context ? `In the context of: ${JSON.stringify(context)}` : ''}
        
        My goal is to understand the process in a comprehensive way.
        I want to understand the process in a step by step manner.
        
        each step should be a single sentence explainig the step.
        its important that the steps are in the correct order and that the steps are clear and concise.


        return the result in a JSON object with 2 key: 
        1. "intro": a string that introduces the process.
        2. "process": an array of steps in the process.
        
        the value of the "process" key should be an array of objects, with each item being a step in the process.
        each item is an object with 2 keys:
            1. "title": a string that represents the title of the step.
            2. "description": a very short one liner that describes the step in one sentence.
            3. "input": an array of strings that represents the input of the step if any.
            4. "output": an array of strings that represents the output of the step if any.

    `;


    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}