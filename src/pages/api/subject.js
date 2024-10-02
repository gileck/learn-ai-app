import { addConfigToPrompt } from "./config";
import { getResponseFromGpt } from "./ai/ai";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { route, config } = req.query
    const routeArray = route ? route.split(',') : []

    const mainSubject = routeArray[routeArray.length - 1];
    const subjectsWithoutLast = routeArray.slice(0, -1);


    const prompt = `
    I want to learn about ${mainSubject}.
        In order to deep dive into the ${mainSubject}, wrie a single short overview  of ${mainSubject} provided.
        The goal is to understand ${mainSubject} in a comprehensive way.

        ${subjectsWithoutLast.length > 0 ? "it should also be related to the subjects:" + subjectsWithoutLast.join(', ') : ''}


        return a JSON object with 1 key:
            1. description: a string that contains ${addConfigToPrompt(config)}.
    `;


    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });


}