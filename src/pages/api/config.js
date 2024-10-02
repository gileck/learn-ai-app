
const configDefaults = {
    'response-length': 'short',
    'response-type': 'paragraph',
    'language': 'english'
}
function parseConfig(configRaw) {
    try {
        const config = JSON.parse(configRaw)
        console.log({ config });
        return { ...configDefaults, ...config }
    } catch (error) {
        return {}
    }
}

export function addConfigToPrompt(configRaw) {
    console.log({ configRaw });
    const config = parseConfig(configRaw || '{}')
    const { 'response-length': responseLength, 'response-type': responseType, 'language': responseLanguage } = config
    return `a ${responseLength} text (string) in ${responseType} in ${responseLanguage} language.`
}
