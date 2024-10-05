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
import { localStorageAPI } from '../localStorageAPI.js';
import { ItemsList } from './ItemsList.js';

export function MainSubject({
    route,
    setRoute,
    setBackRoute,
    onDataFetched

}) {



    const [mainColor, setColor] = React.useState(colors[0]);

    const config = localStorageAPI().getData('learn-ai-config') || {}
    const { data, loading } = useFetch('/api/subject', {
        query: { route, config: JSON.stringify(config) },
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

    function onSubjectClicked(subject, selectedColor) {
        setRoute(subject.name, subject.description);
        setColor(selectedColor)

    }

    async function onQuestionClicked(question, setAnswer) {
        // console.log({ question });
        const config = localStorageAPI().getData('learn-ai-config') || {}
        const response = await fetchWithCache('/api/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question,
                mainSubject,
                config: JSON.stringify(config)
            }),
            onSuccess: onDataFetched,
            disableFetchInBackground: true,

        })
        // console.log({ response });

        setAnswer(response.result)

    }

    async function onLoadMoreClicked(type, exclude, onLoaded) {
        const config = localStorageAPI().getData('learn-ai-config') || {}


        const response = await fetchWithCache('/api/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                mainSubject,
                exclude,
                config: JSON.stringify(config),
                route: route.join(', ')
            }),
            onSuccess: onDataFetched,
            disableFetchInBackground: true,

        })
        // console.log({ response });
        onLoaded(response.result)
    }

    function loadExample({ title }) {
        const config = localStorageAPI().getData('learn-ai-config') || {}
        return fetchWithCache('/api/example', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, mainSubject, config: JSON.stringify(config) }),
            onSuccess: onDataFetched,
            disableFetchInBackground: true,
        })
    }

    function loadData({ type, params }) {
        const config = localStorageAPI().getData('learn-ai-config') || {}
        return fetchWithCache('/api/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                mainSubject,
                params,
                config: JSON.stringify(config),
                route: route.join(', ')

            }),
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

const listItems = [
    {
        type: 'subjects',
        Comp: SubjectList,
        mainColor: 'lightgreen',
    },
    {
        type: 'questions',
        Comp: QuestionsList,
        mainColor: 'lightblue',
    },
    {
        type: 'examples',
        Comp: ItemsList,
        mainColor: 'orange',
    },
    {
        type: 'facts',
        Comp: ItemsList,
        mainColor: '#dacdff',
    }
]

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
        {
            listItems.map(({ type, Comp, mainColor }) => {
                return <WithCollapse type={type} {...params} mainColor={mainColor} >
                    {data => <Comp {...data} items={data[type]} type={type} {...params} />}
                </WithCollapse>
            })
        }
        {/* <WithCollapse type='subjects' {...params} mainColor={"lightgreen"} >
            {data => <SubjectList subjects={data.subjects} {...params} />}
        </WithCollapse>
        <Divider />
        <WithCollapse type='questions' {...params} mainColor={"lightblue"}>
            {data => < QuestionsList questions={data.questions} {...params} />}
        </WithCollapse >
        <Divider />

        <WithCollapse type='examples' {...params} mainColor={"orange"}>
            {data => <ExamplesList examples={data.examples} {...params} />}
        </WithCollapse> */}

    </Box >
}