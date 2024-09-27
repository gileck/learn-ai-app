import { getResponseFromGpt } from "./ai/ai";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { question, mainSubject } = req.body
    console.log({ question });


    const prompt = `
        I have a question about ${mainSubject}:

        ${question}

        answer the question with a short paragraph.

        return a json array with 2 keys:
        1. answer: the answer to the question
        2. subject: a very short subject name of the answer - used to read more about the answer


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