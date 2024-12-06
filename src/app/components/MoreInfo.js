import React, { useEffect } from 'react'
import { TextField, Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Modal, Typography, TextareaAutosize } from '@mui/material'
import { TextBox } from './TextBox';
import { Check, Close, Edit, Save, Send } from '@mui/icons-material';



function MoreInfoDialogComp({ text, context, getData, open, onClose }) {

    const [loading, setLoading] = React.useState(false)
    const [info, setInfo] = React.useState('')

    useEffect(() => {
        async function get() {
            setLoading(true)
            const data = await getData('moreInfo', { text, context })
            setLoading(false)
            setInfo(data?.result)
        }
        if (open) {
            get()
        }

    }, [text, open])

    return <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}

    >
        <DialogTitle>{text}</DialogTitle>
        {loading && <LinearProgress />}
        <DialogContent>
            <TextBox
                text={info}
            />

        </DialogContent>
        <DialogActions>
            <Button
                onClick={onClose}
            >
                Close
            </Button>
        </DialogActions>
    </Dialog>
}
export const MoreInfoDialog = React.memo(MoreInfoDialogComp, (prevProps, nextProps) => {
    return prevProps.open === nextProps.open
})


export function MoreInfoAlertText({ selectedText, setSelectedText, onMoreInfoClicked }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [text, setText] = React.useState(selectedText)

    useEffect(() => {
        setText(selectedText)
    }, [selectedText])

    function onEditClicked() {
        setIsEditing(true)
    }
    function onSaveClicked() {
        setIsEditing(false)
    }

    function onSendClicked() {
        onMoreInfoClicked(text)
    }

    return <Alert
        sx={{
        }}
        action={
            <Box
                sx={{
                    display: 'flex',
                }}
            >
                {!isEditing && <IconButton
                    onClick={onSendClicked}
                >
                    <Send />
                </IconButton>}

                {!isEditing && <IconButton
                    onClick={onEditClicked}
                >
                    <Edit />
                </IconButton>}
                {isEditing && <IconButton
                    onClick={onSaveClicked}
                >
                    <Check />
                </IconButton>}

                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setSelectedText(null)}
                >
                    <Close />

                </IconButton>
            </Box>
        }

        severity="info">



        {!isEditing && <Box>{text}</Box>}
        {isEditing && <TextField
            size='small'
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
                width: "340px",
                "& .MuiInputBase-input": {
                    fontSize: "14px", // Adjust the font size here
                },
            }}
            multiline={true}



        />}


    </Alert>
}