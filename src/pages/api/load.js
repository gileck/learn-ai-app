import { getResponseFromGpt } from "./ai/ai";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};



export default async function handler(req, res) {
    const { type, mainSubject, exclude } = req.body
    console.log({ type, mainSubject, exclude });

    const promptByType = {
        "subjects": `
            return an array of 5 subjects (sub topics) related to the subject: ${mainSubject}.`,
        "questions": `
            return an array of 5 questions related to ${mainSubject}`,
        "examples": `
            return an array of examples related to ${mainSubject}. each example is JSON object with 2 keys: 
                1. "text": a paragraph describing an example of "${mainSubject}" in the real world. try to be as specific as possible.
                2. "title": a title of the example.
            `,

    }


    const prompt = `    
        I want to learn about "${mainSubject}".
        My goal is to understand "${mainSubject}" in a comprehensive way.
        
        ${promptByType[type]}

        

        ${exclude ? "do not include: " + exclude.join(', ') : ''}

        --------------

        return the result in a JSON array.
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