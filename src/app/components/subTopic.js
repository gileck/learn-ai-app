import React, { useEffect } from "react";
import { Box, Button, Divider, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache, useFetch } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { ItemsList } from "./ItemsList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";
import { TextBox } from "./TextBox";
import { Tabs } from "./Tabs";
import { QuestionsList } from "./QuestionsList";



export function SubTopic({
    currentCourseIndex,
    courses,
    correntTopicIndex,
    currentSubTopicIndex,
    markSuptopicAsCompleted,
    degree,
    setLoading,
    goToPreviousSubTopic,
    resetData
}) {
    const subTopicData = courses[currentCourseIndex].topics[correntTopicIndex].subTopics[currentSubTopicIndex].data
    const course = courses[currentCourseIndex].title
    const topic = courses[currentCourseIndex].topics[correntTopicIndex].title
    const subTopic = courses[currentCourseIndex].topics[correntTopicIndex].subTopics[currentSubTopicIndex].title


    // const [data, setData] = React.useState(null);

    // const { data, loading } = useFetch('/api/subTopic', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         degree,
    //         course,
    //         topic,
    //         subTopic
    //     }),
    //     disableFetchInBackground: true,
    //     // shouldUseCache: false
    // })

    // const subTopicData = data?.result

    console.log({ subTopicData });


    // useEffect(() => {
    //     setLoading(loading)
    // }, [loading])

    return (
        <Box >
            {subTopicData && <SubTopicData
                data={subTopicData}
                markSuptopicAsCompleted={markSuptopicAsCompleted}
                goToPreviousSubTopic={goToPreviousSubTopic}
                currentSubTopicIndex={currentSubTopicIndex}
                subTopics={courses[currentCourseIndex].topics[correntTopicIndex].subTopics}
                resetData={resetData}
            />}
        </Box >
    )
}

function TopicQuestionsList({ data, course, degree, topic, subTopic }) {

    async function onQuestionClicked(question, setAnswer) {
        console.log(question);
        const response = await fetchWithCache('/api/topicQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question,
                course,
                degree,
                topic,
                subTopic
            }),
            disableFetchInBackground: true,
            // shouldUsecache: false

        })
        console.log(response.result);
        setAnswer(response.result)
    }
    return <Box>
        <QuestionsList
            mainSubject={''}
            questions={data.map(({ description }) => description)}
            mainColor={getColor({ index: 3 })}
            onQuestionClicked={onQuestionClicked}
            setRoute={() => { }}
            onLoadMoreClicked={() => { }}
        />
    </Box>
}

function MainConceptsList({ data, course, degree, topic, subTopic, }) {
    if (!data) {
        return <Box></Box>
    }
    return <Box>
        {
            <List>
                {data.map(({ title, description }, index) => (
                    <ListItem key={index}>
                        <WithCollapse
                            type="concepts"
                            title={title}
                            mainColor={getColor({ index })}
                        >
                            <Divider />
                            <Box
                                sx={{
                                    p: 1,
                                    backgroundColor: getColor({ index }),

                                }}
                            >
                                <TextBox text={description} />
                            </Box>

                        </WithCollapse>

                    </ListItem>
                ))}
            </List>
        }
    </Box>
}

function SubTopicData({ data, course, degree, topic, subTopic, markSuptopicAsCompleted, goToPreviousSubTopic, currentSubTopicIndex, subTopics, resetData }) {
    console.log({ data });
    return (
        <>

            <Box
                sx={{
                    bgcolor: getColor({ index: 3 }),

                }}

            >

                <Tabs
                    data={[
                        {
                            title: 'Intro',
                            content: <TextBox text={data.introduction} />
                        },
                        {
                            title: 'Concepts',
                            content: <MainConceptsList
                                course={course}
                                degree={degree}
                                topic={topic}
                                subTopic={subTopic}
                                data={data.concepts} />
                        },
                        {
                            title: 'questions',
                            content: <TopicQuestionsList
                                course={course}
                                degree={degree}
                                topic={topic}
                                subTopic={subTopic}
                                data={data.questions} />
                        },
                        {
                            title: 'Examples',
                            content: <MainConceptsList
                                course={course}
                                degree={degree}
                                topic={topic}
                                subTopic={subTopic}
                                data={data.examples} />
                        }

                    ]}
                />

                <Box
                    sx={{
                        display: 'flex',
                        p: 1,
                        justifyContent: 'space-between',

                    }}
                >
                    <Button
                        disabled={currentSubTopicIndex === 0}
                        onClick={() => goToPreviousSubTopic({ course, degree, topic, subTopic })}
                        variant='contained'
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        // disabled={currentSubTopicIndex === subTopics.length - 1}
                        onClick={() => markSuptopicAsCompleted({ course, degree, topic, subTopic })}
                        variant='contained'
                    >
                        next
                    </Button>

                </Box>

            </Box>
            <Button
                onClick={() => resetData({ course, degree, topic, subTopic })}
                variant='outlined'
            >RESET DATA</Button>
        </>


    )
}