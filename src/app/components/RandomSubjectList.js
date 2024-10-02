import { Box } from '@mui/material'; // Added import for Box
import LinearProgress from '@mui/material/LinearProgress'; // Added import for LinearProgress
import { TextInputWithSend } from './TextInputWithSend'; // Added import for TextInputWithSend
import { SubjectList } from './SubjectList'; // Added import for SubjectList
import { useFetch, fetchWithCache } from '../useFetch'; // Added import for useFetch and fetchWithCache
import { colors } from './utils'; // Added import for colors

export function RandomSubjectList({ onDataFetched, setRoute }) {
    const { data, loading } = useFetch('/api/randomSubjects', {
        shouldUsecache: false,
        overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
        disableFetchInBackground: true,
        onSuccess: onDataFetched
    });

    async function onLoadMoreClicked(type, exclude, cb) {
        const data = await fetchWithCache('/api/randomSubjects', {
            shouldUsecache: true,
            overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
            disableFetchInBackground: true,
            body: JSON.stringify({ exclude }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

        })
        cb(data.result)

    }

    function onSubjectClicked(subject) {
        setRoute(subject)
    }

    const subjects = data?.result?.subjects;
    return <>
        <Box
            sx={{
                border: '1px solid silver',
                padding: '10px',
                borderRadius: '10px',
                background: 'antiquewhite',
            }}
        >


            <TextInputWithSend
                onSubmit={(subject) => onSubjectClicked(subject, colors[0])}
                placeHolder="Enter a subject or ask a question..."
            />
        </Box>
        {loading && <LinearProgress />}

        {!loading && <SubjectList subjects={subjects} onSubjectClicked={subject => setRoute(subject)} onLoadMoreClicked={onLoadMoreClicked} />}
    </>
}