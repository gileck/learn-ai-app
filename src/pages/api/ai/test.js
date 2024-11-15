import { generateImage } from './ai.js'

async function start() {
    const result = await generateImage({
        prompt: 'a sunset over the ocean'
    })
    console.log({ result });

}
start()