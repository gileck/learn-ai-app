import React from 'react';
import { Box, Button, IconButton } from '@mui/material'; // Added import for Box
import LinearProgress from '@mui/material/LinearProgress'; // Added import for LinearProgress
import { TextInputWithSend } from './TextInputWithSend'; // Added import for TextInputWithSend
import { SubjectList } from './SubjectList'; // Added import for SubjectList
import { useFetch, fetchWithCache } from '../useFetch'; // Added import for useFetch and fetchWithCache
import { colors } from './utils'; // Added import for colors
import { localStorageAPI } from '../localStorageAPI';
import { Add } from '@mui/icons-material';

export function RandomSubjectList({ onDataFetched, setRoute }) {
    const deletedSubjects = localStorageAPI().getData('learn-ai-deletedSubjects') || []
    const [showInput, setShowInput] = React.useState(false)

    const { data, loading } = useFetch('/api/randomSubjects', {
        shouldUsecache: false,
        overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
        disableFetchInBackground: true,
        onSuccess: onDataFetched,
        body: JSON.stringify({
            exclude: deletedSubjects
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    function onSubjectEntered(subject) {
        setRoute(subject)
    }
    function onSubjectClicked(subject) {
        setRoute(subject.name, subject.description)
        const deletedSubjects = localStorageAPI().getData('learn-ai-deletedSubjects') || []
        if (deletedSubjects.includes(subject)) return
        deletedSubjects.push(subject.name)
        localStorageAPI().saveData('learn-ai-deletedSubjects', deletedSubjects)
    }


    async function onLoadMoreClicked(type, exclude, cb) {
        const deletedSubjects = localStorageAPI().getData('learn-ai-deletedSubjects') || []
        const data = await fetchWithCache('/api/randomSubjects', {
            shouldUsecache: true,
            overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
            disableFetchInBackground: true,
            body: JSON.stringify({
                exclude: [
                    ...deletedSubjects,
                    ...exclude
                ]
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

        })
        cb(data.result)

    }

    const subjects = data?.result?.subjects || []
    return <>

        {showInput ? <Box
            sx={{
                border: '1px solid silver',
                padding: '10px',
                borderRadius: '10px',
                background: 'antiquewhite',
                marginTop: '10px',
            }}
        >
            <TextInputWithSend
                onSubmit={(subject) => onSubjectEntered(subject, colors[0])}
                placeHolder="Enter a subject or ask a question..."
            />
        </Box> : <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px',
            }}
        ><Button
            startIcon={<Add />}
            onClick={() => setShowInput(true)}>

                Add a subject
            </Button></Box>
        }

        {loading && <LinearProgress />}

        {!loading && <SubjectList
            subjects={subjects}
            onSubjectClicked={onSubjectClicked}

            onLoadMoreClicked={onLoadMoreClicked} />}
    </>
}