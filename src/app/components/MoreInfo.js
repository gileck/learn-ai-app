import React, { useEffect } from 'react'
import { TextField, Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Modal, Typography, TextareaAutosize, Divider, List, ListItem, ListItemText, Collapse, ListItemSecondaryAction } from '@mui/material'
import { TextBox } from './TextBox';
import { ArrowCircleDown, ArrowDownward, ArrowDownwardSharp, ArrowDropDown, ArrowDropDownSharp, ArrowDropUp, Check, Close, Edit, Save, Send } from '@mui/icons-material';
import { WithCollapse } from './WithCollapse';
import { getColor } from './utils';
import { ProcessBox } from './Process';


const CompByType = {
    process: ProcessBox
}
const getCompByType = (type) => CompByType[type] || TextBox


function MoreInfoDialogComp({ input, context, getData, open, onClose: closeDialog, onBackClicked }) {

    if (!input) {
        return null
    }

    console.log({ input });
    const { text, type } = input

    const [loading, setLoading] = React.useState(false)
    const [info, setInfo] = React.useState('')

    function onClose() {
        setInfo('')
        closeDialog()
    }

    useEffect(() => {
        const apiByType = {
            process: 'process',
        }
        async function get() {
            if (!text) {
                return
            }
            setLoading(true)

            const data = await getData(apiByType[type] || 'moreInfo', { text, context, type })
            console.log({ data });
            setLoading(false)
            setInfo(data?.result)
        }
        if (open) {
            get()
        }

    }, [text, open])

    if (loading) {
        return <Box
            sx={{
                position: 'fixed',
                top: '0px',
                left: '0px',
                width: '100%',
            }}
        >
            <LinearProgress
                color='secondary'
            />
        </Box>
    }


    const Comp = getCompByType(type)
    return <Dialog
        open={open && !loading}
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
        <DialogContent>
            <Box
                sx={{
                    lineHeight: "24px",
                }}
            >
                {text}
            </Box>
            <Divider />
            {info && <Comp data={info} text={info} />}

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
    return prevProps.open === nextProps.open && prevProps.input?.text === nextProps.input?.text
})

const prompts = {
    explain: text => `Can you explain this: ${text}`,
    why: text => `Can you explain why: ${text}`,
    process: text => text,
    what: text => `what is: ${text}`
}


export function MoreInfoAlertText({ selectedText, closeMoreInfoBox, onMoreInfoClicked }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [text, setText] = React.useState(selectedText)
    const [showPrompts, setShowPrompts] = React.useState(true)

    useEffect(() => {
        setText(selectedText)
    }, [selectedText])

    function onProcessClicked() {
        onMoreInfoClicked({
            text,
            type: 'process'
        })
    }

    function onEditClicked() {
        setIsEditing(true)
    }
    function onSaveClicked() {
        setIsEditing(false)
    }

    function onSendClicked(key) {
        if (prompts[key]) {
            onMoreInfoClicked({
                text,
                type: key
            })
        } else {
            onMoreInfoClicked({
                text,
                type: 'explain'
            })
        }
    }

    return <Box
        sx={{
            position: 'fixed',
            bottom: '20px',
            left: '8px',
            backgroundColor: 'white',
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
                    onClick={() => onProcessClicked()}
                >
                    process
                </Button>

            </Box>}
        </Box>


    </Box>
}