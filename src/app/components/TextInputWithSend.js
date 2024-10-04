import React, { useEffect } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendRounded from '@mui/icons-material/SendRounded';

export function TextInputWithSend({ onSubmit, placeHolder }) {
    const [input, setInput] = React.useState('');
    useEffect(() => {
        const callback = (e) => {
            if (e.key === 'Enter') {
                setInput('')
                onSubmit(input)

            }
        }
        window.addEventListener('keydown', callback)
        return () => {
            window.removeEventListener('keydown', callback)
        }
    }, [input])
    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',

        }}
    >
        <TextField
            value={input}
            label={placeHolder}
            variant="outlined"
            margin="normal"
            onInput={(e) => setInput(e.target.value)}
            sx={{
                width: '85%',
                mt: '1px',
            }}
        />
        <Box
            sx={{
                borderRadius: '15px',
                marginBottom: '8px',
                borderColor: !input ? 'lightgray' : 'gray',
                bgcolor: '#46ab46',
                marginRight: '10px',
                marginLeft: '10px',

            }}
        >
            <IconButton
                disabled={!input}
                onClick={() => {
                    onSubmit(input)
                    setInput('')
                }}>

                <SendRounded
                    sx={{
                        color: 'black'
                    }}
                />
            </IconButton>
        </Box>
    </Box>
}