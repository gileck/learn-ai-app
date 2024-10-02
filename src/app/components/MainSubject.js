import React from 'react'; // Import React
import { Box, Typography, Divider, LinearProgress } from '@mui/material'; // Import UI components
import { ArrowBack } from '@mui/icons-material'; // Import ArrowBack icon
import { TextBox } from './TextBox.js'; // Import TextBox component
import { useFetch, fetchWithCache } from '../useFetch'; // Import useFetch and fetchWithCache
import { colors } from './utils'; // Import colors
import { WithCollapse } from './WithCollapse'; // Import WithCollapse component
import { SubjectList } from './SubjectList'; // Import SubjectList component
import { QuestionsList } from './QuestionsList'; // Import QuestionsList component
import { ExamplesList } from './ExamplesList'; // Import ExamplesList component

export function MainSubject({
    route,
    setRoute,
    setBackRoute,
    onDataFetched

}) {



    const [mainColor, setColor] = React.useState(colors[0]);

    const { data, loading } = useFetch('/api/subject', {
        query: { route },
        shouldUsecache: true,
        overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
        disableFetchInBackground: true,
        onSuccess: onDataFetched
    });
    const { result, apiPrice } = data || {};
    // console.log({ result, apiPrice });
    const { description } = result || {}
    const shouldShowHeader = route.length > 0;
    const singleSubject = route.length !== 0;

    const mainSubject = route[route.length - 1];

    function onSubjectClicked(subjectName, selectedColor) {
        setRoute(subjectName);
        setColor(selectedColor)

    }

    async function onQuestionClicked(question, setAnswer) {
        // console.log({ question });
        const response = await fetchWithCache('/api/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, mainSubject }),
            onSuccess: onDataFetched,
            disableFetchInBackground: true,

        })
        // console.log({ response });

        setAnswer(response.result)

    }

    async function onLoadMoreClicked(type, exclude, onLoaded) {
        const response = await fetchWithCache('/api/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, mainSubject, exclude }),
            onSuccess: onDataFetched,
            disableFetchInBackground: true,

        })
        // console.log({ response });
        onLoaded(response.result)
    }

    function loadExample({ title }) {
        return fetchWithCache('/api/example', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, mainSubject }),
            onSuccess: onDataFetched,
            disableFetchInBackground: true,
        })
    }

    function loadData({ type, params }) {
        return fetchWithCache('/api/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, mainSubject, params }),
            onSuccess: onDataFetched,
            disableFetchInBackground: true,
        })
    }


    const params = {

        description,
        mainColor,
        route,
        setRoute,
        setBackRoute,
        onSubjectClicked,
        onQuestionClicked,
        onLoadMoreClicked,
        loadData,
        loadExample,
        mainSubject,
    }

    return <>
        <Box
            sx={{
                p: 1,
                bgcolor: mainColor,
                borderRadius: 1,
                mb: 1,

            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <ArrowBack onClick={() => setBackRoute()} />
                <Typography variant="h6" sx={{
                    margin: 1,

                }}>
                    {mainSubject}
                </Typography>
            </Box >

            <Box sx={{
                padding: 1,

            }} >
                <Typography variant="h12" sx={{
                    color: 'gray'
                }}>

                    {route.join(' > ')}
                </Typography>
            </Box>
            <Divider />
            {loading ? <LinearProgress /> : ''}

            <Box
                sx={{
                    borderRadius: 1,
                    visibility: loading ? 'hidden' : 'visible',

                }}
            >
                <TextBox text={description} />
            </Box>
        </Box >
        <MainList {...params} />

    </>
}

function MainList(params) {
    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflow: 'auto',
            height: '100%'
        }}
    >
        <WithCollapse type='subjects' {...params} mainColor={"lightgreen"} >
            {data => <SubjectList subjects={data.subjects} {...params} />}
        </WithCollapse>
        <Divider />
        <WithCollapse type='questions' {...params} mainColor={"lightblue"}>
            {data => < QuestionsList questions={data.questions} {...params} />}
        </WithCollapse >
        <Divider />

        <WithCollapse type='examples' {...params} mainColor={"orange"}>
            {data => <ExamplesList examples={data.examples} {...params} />}
        </WithCollapse>

    </Box >
}