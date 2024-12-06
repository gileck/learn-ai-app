import React, { useEffect } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Modal, Typography } from '@mui/material'
import { TextBox } from './TextBox';


function MoreInfoDialogComp({ text, context, getData, open, onClose }) {

    console.log({
        text,
        context,
        open
    });
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
