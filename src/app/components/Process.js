import React, { useEffect } from 'react'
import { TextField, Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Modal, Typography, TextareaAutosize, Divider, List, ListItem, ListItemText, Collapse, ListItemSecondaryAction } from '@mui/material'
import { TextBox } from './TextBox';
import { ArrowBackIosSharp, ArrowCircleDown, ArrowDownward, ArrowDownwardSharp, ArrowDropDown, ArrowDropDownSharp, ArrowDropUp, Check, Close, Edit, Save, Send } from '@mui/icons-material';
import { WithCollapse } from './WithCollapse';
import { getColor } from './utils';
// import { Box, Divider, IconButton, LinearProgress, List, ListItem, ListItemText } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache } from "../useFetch";
// import { SubjectList } from "./SubjectList";
// import { getColor } from "./utils";
// import { WithCollapse } from "./WithCollapse";

async function getData({
    params,
    type
}) {
    const { result, apiPrice } = await fetchWithCache(`/api/${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
        disableFetchInBackground: true,
        // shouldUsecache: false

    })
    return { result, apiPrice }
}

const promptsByType = {
    process: 'Enter a process',
    simple: `Explain this process in simpler words`,
    why: `Explain why the process happens`,
    explain: `Explain the process in details`
}

export function ProcessWithInput() {
    const processFromUrl = new URLSearchParams(window.location.search).get('process')
    const [selectedProcess, setSelectedProcess] = React.useState(processFromUrl || 'cellular respiration');
    console.log({ selectedProcess });
    async function onSubmit(text) {
        setSelectedProcess(text)
    }
    return <Box
        sx={{
            marginTop: '20px'
        }}
    >
        <TextInputWithSend
            onSubmit={onSubmit}
            placeHolder='Enter a process'
            value={selectedProcess}
        />

        <Process
            mainProcess={selectedProcess}
        />
    </Box>
}

function setProcessInUrl(process) {
    const url = new URL(window.location.href)
    url.searchParams.set('process', process)
    window.history.pushState({}, '', url)
}
export function Process({ mainProcess }) {
    console.log({ mainProcess });
    const [inputArray, setInputArray] = React.useState([mainProcess]);
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [loadingSteps, setLoadingSteps] = React.useState({});

    useEffect(() => {
        setInputArray([mainProcess])
        setProcessInUrl(mainProcess)
    }, [mainProcess])

    function setLoadingStep(index, value) {
        setLoadingSteps({
            ...loadingSteps,
            [index]: value
        })
    }

    function onMoreInfoClosed(index) {
        setData(oldData => {
            const newData = { ...oldData }
            newData.process[index].moreInfo = null
            return newData
        })
    }


    async function addMoreInfoToStep({ step, index, type }) {
        console.log({ step, index, type, inputArray });
        setLoadingStep(index, true)
        const context = inputArray.map(item => item.title || item).join(', ')
        const { result } = await getData({
            params: {
                title: step.title,
                description: step.description,
                request: promptsByType[type] || promptsByType['explain'],
                context
            },
            type: 'process-more-info'
        })
        setData(oldData => {
            const newData = { ...oldData }
            newData.process[index].moreInfo = result
            return newData
        })
    }

    useEffect(() => {
        async function get() {
            if (!inputArray.length) {
                setData(null)
                return
            }
            setLoading(true)
            const step = inputArray[inputArray.length - 1]
            const text = step.title ? `${step.title}: ${step.description}` : step
            const context = inputArray.slice(0, inputArray.length - 1)
                .map(item => item.title || item).join(', ')

            const { result } = await getData({
                params: {
                    text,
                    context
                },
                type: 'process'
            })
            setData(result)
            setLoading(false)
        }
        get()
    }, [inputArray])


    async function onStepClicked(type, step, index) {
        if (loading) {
            return
        }
        if (type === 'process') {
            setInputArray([...inputArray, step])
        } else {
            addMoreInfoToStep({ step, index, type })
        }
    }
    return (
        <Box>
            {loading && <LinearProgress />}
            <Box sx={{ p: 2, }}>
                <IconButton
                    onClick={() => {
                        setInputArray(arr => arr.slice(0, arr.length - 1))
                    }}
                >
                    <ArrowBackIosSharp />
                </IconButton>
                {inputArray.map(item => item.title || item).join(' > ')}
            </Box>
            <Divider />
            {data && <ProcessBox data={data} onClick={onStepClicked} onMoreInfoClosed={onMoreInfoClosed} />}
        </Box >
    )
}

function StepInputOutput({ step }) {
    const { input, output } = step
    return <Box>
        {input.join(', ')} {"→"} {output.join(', ')}
    </Box>
}
export function ProcessBox({ data, onClick, onMoreInfoClosed }) {
    const process = data.process
    const [openedSteps, setOpenedSteps] = React.useState({})



    function onStepClicked(index) {
        setOpenedSteps({
            ...openedSteps,
            [index]: !openedSteps[index]
        })
    }

    return <Box sx={{}}>

        <TextBox
            text={data.intro}
        />

        <List>
            {

                process.map((step, index) => {
                    return <Box
                        key={index}
                        sx={{
                            borderBottom: '1px solid gray',
                            backgroundColor: getColor({ index }),
                        }}
                    >
                        <ListItem
                            onClick={() => onStepClicked(index)}
                            sx={{


                            }}
                        >
                            <ListItemText
                                primary={<Box
                                    sx={{
                                        display: 'inline',
                                    }}
                                >
                                    <Typography component={'span'} variant='body1'
                                        sx={{
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {step.title}:
                                    </Typography>
                                    <Typography component={'span'} variant='body1'>
                                        {` `}{step.description}
                                    </Typography>
                                </Box>}


                                secondary={<StepInputOutput step={step} />}
                            />

                            <ListItemSecondaryAction>
                                <IconButton onClick={() => onStepClicked(index)}>
                                    <ArrowDropDown />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Collapse in={openedSteps[index]}>
                            <Divider />

                            {/* <Collapse in={true}> */}
                            {
                                step.moreInfo && <Box
                                    sx={{
                                        p: 1,

                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            height: '5px',
                                            marginTop: '10px'

                                        }}
                                    >
                                        <IconButton
                                            onClick={() => onMoreInfoClosed(index)}
                                        >
                                            <Close />
                                        </IconButton>

                                    </Box>
                                    <TextBox text={step.moreInfo} />
                                    <Divider />

                                </Box>
                            }

                            <Box
                                sx={{
                                    p: 1,
                                }}
                            >

                                <Button
                                    onClick={() => onClick('process', step, index)}
                                >
                                    Process
                                </Button>

                                <Button
                                    onClick={() => onClick('simple', step, index)}
                                >
                                    Simpler
                                </Button>

                                <Button
                                    onClick={() => onClick('why', step, index)}
                                >
                                    Why
                                </Button>

                                <Button
                                    onClick={() => onClick('explain', step, index)}
                                >
                                    Explain
                                </Button>




                            </Box>

                        </Collapse>
                    </Box>
                })
            }
        </List>

    </Box>
}
