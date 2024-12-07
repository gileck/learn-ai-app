import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { localStorageAPI } from '../localStorageAPI';
import ReactMarkdown from 'react-markdown';
import { Language } from '@mui/icons-material';

const parse = text => {
    return text
        .replace(/\\text\{([^}]*)\}/g, '$1') // Remove \text{}
        .replace(/\\rightarrow/g, '→')      // Replace \rightarrow with →
        .replace(/[\[\]]/g, '')            // Remove square brackets
        .replace(/\\/g, '');            // Remove slashes
}



function replaceAsterisksWithBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>');
}
const BoldText = ({ text }) => {
    // Replace `**text**` with <strong>text</strong> using regex
    const parseBoldText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/); // Split by **...**
        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <strong key={index}>
                        {part.slice(2, -2)} {/* Remove the `**` */}
                    </strong>
                );
            }
            return part; // Return normal text
        });
    };

    return <p>{parseBoldText(text)}</p>;
};
export function TextBox({ text, title, setRoute }) {
    const config = localStorageAPI().getData('learn-ai-config') || {}
    const Language = config.language || 'english'
    const textDirection = Language === 'Hebrew' ? 'rtl' : 'ltr'
    if (!text) {
        return <></>
    }

    // const lines = text.split('. ').filter(Boolean).map(line => {
    //     return `• ${line.trim()}.`
    // }).join('\n ')


    return <Box
        sx={{
            lineHeight: "24px",
            whiteSpace: "pre-line",
            p: 1,
            direction: textDirection,
        }}
    >
        <div id="text-box-id">
            <Typography>
                <ReactMarkdown>
                    {parse(text)}
                </ReactMarkdown>
                {/* <BoldText text={text} /> */}
                {title ? <div>
                    Read more about <span onClick={() => setRoute(title)} style={{ color: 'blue' }}>{title}</span>
                </div> : ''}

            </Typography>
        </div>
    </Box>
}