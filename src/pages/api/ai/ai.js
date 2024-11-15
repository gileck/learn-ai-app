import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from 'fs'
import path from 'path'

let OPENAI_API_KEY = null
const isLocal = process.env.NODE_ENV === 'development'
if (isLocal) {
    const { parsed } = dotenv.config()
    OPENAI_API_KEY = parsed.OPENAI_API_KEY
} else {
    OPENAI_API_KEY = process.env.OPENAI_API_KEY
}
//create  gptFiles if not exist
if (isLocal && !fs.existsSync(path.resolve('./gptFiles'))) {
    fs.mkdirSync(path.resolve('./gptFiles'))
}

// const { parsed: { OPENAI_API_KEY } } = dotenv.config()
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const MILLION = 1000000
const modelPrices = {
    'gpt-4o-mini': {
        prompt_tokens_price: 0.15 / MILLION,
        completion_tokens_price: 0.6 / MILLION
    },
    'gpt-3.5-turbo': {
        prompt_tokens_price: 0.5 / MILLION,
        completion_tokens_price: 1.5 / MILLION
    },
    'gpt-4-turbo': {
        prompt_tokens_price: 10 / MILLION,
        completion_tokens_price: 30 / MILLION
    },
    'gpt-4o': {
        prompt_tokens_price: 5 / MILLION,
        completion_tokens_price: 15 / MILLION
    },
}

function calcPrice(model, tokens) {
    const { completion_tokens, prompt_tokens } = tokens
    const prompt_tokens_price = modelPrices[model].prompt_tokens_price
    const completion_tokens_price = modelPrices[model].completion_tokens_price
    const price = ((prompt_tokens) * prompt_tokens_price) + ((completion_tokens) * completion_tokens_price)
    return price * 3.7
}

const models = {
    '3': 'gpt-4o-mini',
    '4': 'gpt-4o',

}
export async function getResponseFromGpt({ system, inputText, isJSON, model }) {
    const modelToUse = models[model] || 'gpt-4o-mini'


    const data = {
        model: modelToUse,
        temperature: 0.8,
        response_format: { "type": isJSON ? "json_object" : 'text' },
        messages: [
            {
                "role": "system",
                "content": `${system}`

            },
            {
                "role": "user",
                "content": `${inputText}`
            }
        ],
        max_tokens: 10000,
    }


    // console.log({ data });

    const startTime = new Date()


    const response = await openai.chat.completions.create(data).catch(e => {
        console.log(`ERROR in getResponseFromGpt: ${e.message}`)
        return {
            error: e.message,

        }
    })

    const endTime = new Date()
    const duration = (endTime - startTime) / 1000

    if (!response || response.error) {
        return {
            result: null,
            apiPrice: 0,
            modelToUse,
            error: true,
            message: response?.error,
            duration,
            usage: response?.usage || {},
        }
    }


    const content = response.choices[0].message.content
    const finish_reason = response.choices[0].finish_reason
    const usage = response.usage

    const apiPrice = calcPrice(modelToUse, usage)

    if (process.env.NODE_ENV === 'development') {
        fs.appendFileSync(path.resolve('./gptFiles', `${(new Date()).toLocaleTimeString()}.json`), `
    ${JSON.stringify({ content, usage, apiPrice, finish_reason }, null, 2) + '\n\n'}
    `)
    }

    let result = null
    try {
        result = isJSON ? JSON.parse(content) : content
    } catch (e) {
        console.log(e.message)
        console.log({ content })
        return {
            result: null,
            apiPrice: 0,
            modelToUse,
            error: true,
            message: e.message,
            finish_reason,
            duration,
            usage
        }
    }

    return {
        result,
        apiPrice,
        modelToUse,
        usage,
        duration
    }


}

const imageCosts = {
    'dall-e-3': {
        '1024x1024': 0.040 * 3.7,
    },
    'dall-e-2': {
        '1024x1024': 0.020 * 3.7,
        '512x512': 0.018 * 3.7,
        '256x256': 0.016 * 3.7,
    }
}

export async function generateImage({
    prompt
}) {
    try {
        const modelToUse = 'dall-e-2'
        const size = "256x256"
        const response = await openai.images.generate({
            model: modelToUse,
            prompt,
            n: 1,
            size,
            quality: 'standard'
        });

        const price = imageCosts[modelToUse][size]
        const imageUrl = response.data[0].url;
        return {
            url: imageUrl,
            apiPrice: price
        }
    } catch (error) {
        console.error("Error generating image:", error);
    }
}