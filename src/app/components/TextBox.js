import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { localStorageAPI } from '../localStorageAPI';
import ReactMarkdown from 'react-markdown';
import { Language } from '@mui/icons-material';

export function TextBox({ text, title, setRoute }) {
    const config = localStorageAPI().getData('learn-ai-config') || {}
    const Language = config.language || 'english'
    const textDirection = Language === 'Hebrew' ? 'rtl' : 'ltr'
    if (!text) {
        return <></>
    }

    const lines = text.split('. ').filter(Boolean).map(line => {
        return `• ${line.trim()}.`
    }).join('\n ')


    return <Box
        sx={{
            lineHeight: "24px",
            whiteSpace: "pre-line",
            p: 1,
            direction: textDirection,
        }}
    >

        <Typography>
            {lines}
            {title ? <div>
                Read more about <span onClick={() => setRoute(title)} style={{ color: 'blue' }}>{title}</span>
            </div> : ''}

        </Typography>
    </Box>
}