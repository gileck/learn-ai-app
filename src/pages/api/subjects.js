import { getResponseFromGpt } from "./ai/ai";
// import { getUser } from "../userApi";
// import { getDB } from "../db";
// import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { route } = req.query
    console.log({ route });
    const routeArray = route ? route.split(',') : []
    console.log({ routeArray });

    const shouldUseRandomSubjects = routeArray.length === 0;

    const lastSubject = routeArray[routeArray.length - 1];
    const subjectsWithoutLast = routeArray.slice(0, -1);

    const randomSubjectsPrompt = `
        return an array of random 5 subjects to learn about.
        return a JSON object with 1 keys:
            1. "subjects" that contains an array of strings.
    `;

    const specificSubjectPrompt = `
        I want to learn about ${lastSubject}.
        In order to deep dive into the ${lastSubject}, give me 5 sub topics of ${lastSubject}.
        The goal is to understand ${lastSubject} in a comprehensive way.

        return an array of 5 sub topics related to the subject: ${lastSubject}.
        ${subjectsWithoutLast.length > 0 ? "it should also be related to the subjects:" + subjectsWithoutLast.join(', ') : ''}
        return a JSON object with 2 keys:
            1. "subjects" that contains an array of subjects. each subject is an object with 2 keys:
                1. "subject": a string that represents the subject.
                2. "description": a very short one liner that describes the subject in one sentence.
            2. "description" that contains an a single short paragraph of ${lastSubject} provided.
            3. "questions": that contains an array of questions related to ${lastSubject}
            4. "examples": that contains an array of examples related to ${lastSubject}. each example is JSON object with 2 keys: 
                1. "text": a paragraph describing an example of "${lastSubject}" in the real world. try to be as specific as possible.
                2. "title": a title of the example.
`;

    const prompt = `
    ${shouldUseRandomSubjects ? randomSubjectsPrompt : specificSubjectPrompt}
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