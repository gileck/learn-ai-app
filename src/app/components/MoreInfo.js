import React, { useEffect } from 'react'
import { TextField, Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Modal, Typography, TextareaAutosize, Divider } from '@mui/material'
import { TextBox } from './TextBox';
import { ArrowCircleDown, ArrowDownward, ArrowDownwardSharp, ArrowDropDown, ArrowDropDownSharp, ArrowDropUp, Check, Close, Edit, Save, Send } from '@mui/icons-material';



function MoreInfoDialogComp({ text, context, getData, open, onClose: closeDialog, onBackClicked }) {

    const [loading, setLoading] = React.useState(false)
    const [info, setInfo] = React.useState('')

    function onClose() {
        setInfo('')
        closeDialog()
    }

    useEffect(() => {
        async function get() {
            if (!text) {
                return
            }
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

        sx={{
            height: '95%',
            marginTop: '0px'
        }}

    >
        {/* <DialogTitle
            sx={{
                backgroundColor: '#cce0e6',
            }}

        >{text}</DialogTitle> */}
        {loading && <LinearProgress />}
        <DialogContent>
            <Box
                sx={{
                    lineHeight: "24px",
                }}
            >
                {text}
            </Box>
            <Divider />
            <TextBox
                text={info}
            />

        </DialogContent>
        <DialogActions
            sx={{
                backgroundColor: '#cce0e6',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <Button
                onClick={onBackClicked}
            >
                Back
            </Button>
            <Button
                onClick={onClose}
            >
                Close
            </Button>


        </DialogActions>
    </Dialog>
}
export const MoreInfoDialog = React.memo(MoreInfoDialogComp, (prevProps, nextProps) => {
    return prevProps.open === nextProps.open && prevProps.text === nextProps.text
})

const prompts = {
    explain: text => `Can you explain this: ${text}`,
    why: text => `Can you explain why: ${text}`,
    process: text => `what is the process of: ${text}`,
    what: text => `what is: ${text}`
}


export function MoreInfoAlertText({ selectedText, closeMoreInfoBox, onMoreInfoClicked }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [text, setText] = React.useState(selectedText)
    const [showPrompts, setShowPrompts] = React.useState(false)

    useEffect(() => {
        setText(selectedText)
    }, [selectedText])

    function onEditClicked() {
        setIsEditing(true)
    }
    function onSaveClicked() {
        setIsEditing(false)
    }

    function onSendClicked(key) {
        if (prompts[key]) {
            onMoreInfoClicked(prompts[key](text))
        } else {
            onMoreInfoClicked(text)
        }
    }

    return <Box
        sx={{
            position: 'fixed',
            bottom: '20px',
            left: '8px',
            backgroundColor: '#cce0e6',
            width: '92%',
            padding: '10px',
            boxShadow: '0 0 5px 0px #000000',
            border: '0.5px solid #000000',
            zIndex: 100000,
        }}


    >

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >




                {!isEditing && <Box
                    onDoubleClick={onEditClicked}
                >{text}</Box>}
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

                <Box
                    sx={{
                        display: 'flex',
                    }}
                >
                    {!isEditing && <IconButton
                        onClick={onSendClicked}
                        disabled={!text}
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
                        onClick={() => closeMoreInfoBox()}
                    >
                        <Close />

                    </IconButton>
                    <IconButton
                        onClick={() => setShowPrompts(!showPrompts)}
                    >
                        {showPrompts ? <ArrowDropDown /> : <ArrowDropUp />}
                    </IconButton>
                </Box>

            </Box>



            {showPrompts && <Box>

                <Button
                    onClick={() => onSendClicked('what')}
                >
                    What is it?
                </Button>
                <Button
                    onClick={() => onSendClicked('explain')}
                >
                    Explain
                </Button>
                <Button
                    onClick={() => onSendClicked('why')}
                >
                    Why
                </Button>
                <Button
                    onClick={() => onSendClicked("process")}
                >
                    process
                </Button>

            </Box>}
        </Box>


    </Box>
}