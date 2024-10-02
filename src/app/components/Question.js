import React, { useEffect } from 'react'; // Added React and useEffect
import { Box, ListItem, ListItemText, LinearProgress, Collapse, Divider } from '@mui/material'; // Added MUI components
import { TextBox } from './TextBox'; // Added TextBox
import { speak } from './utils'; // Added speak
import { colors } from './utils'; // Added colors


export function Question({ mainSubject, question, mainColor, index, onQuestionClicked, setRoute, isAddedQuestion }) {
    const [answer, setAnswer] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        setAnswer(null)
        setOpen(false)
        setLoading(false)
    }, [mainSubject])
    useEffect(() => {
        if (isAddedQuestion) {
            onClick()
        }
    }, [isAddedQuestion])
    function onClick() {
        if (!answer) {
            setLoading(true)
            onQuestionClicked(question, (response) => {
                setAnswer(response)
                setLoading(false)
            })
        }
        setOpen(!open)
    }
    const bgcolor = colors.filter(c => c !== mainColor)[index % colors.length]
    return <Box
        sx={{ bgcolor, mb: 1, borderRadius: 1 }}
    >

        <ListItem
            key={question}
            onClick={onClick}
        >
            <ListItemText
                primary={question}
            />

        </ListItem>
        {loading ? <LinearProgress /> : ''}

        <Collapse in={open && answer}>
            <Divider />
            <Box
                onDoubleClick={() => speak(answer?.answer)}
                sx={{
                    p: 1,
                }}
            >
                <TextBox text={answer?.answer} title={answer?.subject} setRoute={setRoute} />
            </Box>
        </Collapse>
    </Box>
}