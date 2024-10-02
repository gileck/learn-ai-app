import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export function TextBox({ text, title, setRoute }) {
    return <Box
        sx={{
            lineHeight: "24px",
            whiteSpace: "pre-line",
            p: 1
        }}
    >
        <Typography>
            {text}
            {title ? <div>
                Read more about <span onClick={() => setRoute(title)} style={{ color: 'blue' }}>{title}</span>
            </div> : ''}
        </Typography>
    </Box>
}