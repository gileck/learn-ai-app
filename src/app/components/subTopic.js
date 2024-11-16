import React from "react";
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



export function SubTopic({ currentCourseIndex, courses, correntTopicIndex, currentSubTopicIndex, markSuptopicAsCompleted }) {
    console.log({ currentCourseIndex, courses, correntTopicIndex, currentSubTopicIndex });
    const subTopicData = courses[currentCourseIndex].topics[correntTopicIndex].subTopics[currentSubTopicIndex].data
    console.log({ subTopicData });


    return (
        <Box >
            <SubTopicData
                data={subTopicData}
                markSuptopicAsCompleted={markSuptopicAsCompleted}
            />
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

function SubTopicData({ data, course, degree, topic, subTopic, markSuptopicAsCompleted }) {
    console.log({ data });
    return (
        <Box
            sx={{
                bgcolor: getColor({ index: 3 }),

            }}

        >

            <Tabs
                data={[
                    {
                        title: 'Introduction',
                        content: <TextBox text={data.introduction} />
                    },
                    {
                        title: 'Main Concepts',
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

                ]}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 1,
                }}
            >
                <Button
                    onClick={() => markSuptopicAsCompleted({ course, degree, topic, subTopic })}
                    variant='contained'
                >
                    next
                </Button>

            </Box>
        </Box>

    )
}