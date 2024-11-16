import React, { useEffect } from "react";
import { Box, Divider, IconButton, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache, useFetch } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";
import { Course } from "./Course";
import { Topic } from "./Topic";
import { SubTopic } from "./subTopic";
import { ArrowBackIosNew } from "@mui/icons-material";

const Views = {
    degree: DegreeView,
    course: Course,
    topic: Topic,
    subTopic: SubTopic
}

function getTitle(state) {
    const { courses, currentCourseIndex, correntTopicIndex, currentSubTopicIndex } = state
    const course = courses[currentCourseIndex]
    const topic = course?.topics?.[correntTopicIndex]
    const subTopic = topic?.subTopics?.[currentSubTopicIndex]


    return {
        course: course?.title,
        topic: topic?.title,
        subTopic: subTopic?.title
    }
}

function DegreeView({ setCourse, courses }) {
    return <Box>
        {courses && <ProcessList processArray={courses} onCourseClicked={(course, courseIndex) => setCourse({ course, courseIndex })} />}
    </Box>
}



export function Degree({ setPage, params: { degree } }) {

    const [state, _setState] = React.useState({
        view: 'degree',
        courses: [],
        currentCourseIndex: null,
        loading: false,
        currentCourseIndex: null,
        correntTopicIndex: null,
        currentSubTopicIndex: null
    })
    console.log({ state });
    function setState(newState) {
        _setState(oldState => ({ ...oldState, ...newState }))
    }
    const setLoading = (loading) => {
        setState({ loading: !!loading })
    }
    function goBack() {
        const { view } = state
        if (view === 'subTopic') {
            setState({
                view: 'topic',
                currentSubTopicIndex: null
            })
        } else if (view === 'topic') {
            setState({
                view: 'course',
                correntTopicIndex: null
            })
        } else if (view === 'course') {
            setState({
                view: 'degree',
                currentCourseIndex: null
            })
        }
    }
    function setSubTopicDataState({ subTopic, topicIndex, subTopicIndex, courseIndex }) {
        const courses = state.courses.map((c, index) => {
            if (index === courseIndex) {
                return {
                    ...c,
                    topics: c.topics.map((t, tIndex) => {
                        if (tIndex === topicIndex) {
                            return {
                                ...t,
                                subTopics: t.subTopics.map((s, sIndex) => {
                                    if (sIndex === subTopicIndex) {
                                        return {
                                            ...s,
                                            data: subTopic
                                        }
                                    }
                                    return s
                                })
                            }
                        }
                        return t
                    })
                }
            }
            return c
        })
        setState({
            courses,
            currentSubTopicIndex: subTopicIndex,
            loading: false,
            view: 'subTopic'
        })
    }
    function setSubTopicsState({ subTopics, topicIndex, courseIndex }) {
        const courses = state.courses.map((c, index) => {
            if (index === courseIndex) {
                return {
                    ...c,
                    topics: c.topics.map((t, tIndex) => {
                        if (tIndex === topicIndex) {
                            return {
                                ...t,
                                subTopics
                            }
                        }
                        return t
                    })
                }
            }
            return c
        })
        setState({
            courses,
            currentCourseIndex: courseIndex,
            correntTopicIndex: topicIndex,
            loading: false,
            view: 'topic'
        })
    }
    function setTopicsState({ courseIndex, topics }) {
        const courses = state.courses.map((c, index) => {
            if (index === courseIndex) {
                return {
                    ...c,
                    topics
                }
            }
            return c
        })
        setState({
            courses,
            currentCourseIndex: courseIndex,
            course: courses[courseIndex].title,
            loading: false,
            view: 'course'
        })
    }

    function markSuptopicAsCompleted() {
        const courses = state.courses.map((c, index) => {
            if (index === state.currentCourseIndex) {
                return {
                    ...c,
                    topics: c.topics.map((t, tIndex) => {
                        if (tIndex === state.correntTopicIndex) {
                            return {
                                ...t,
                                subTopics: t.subTopics.map((s, sIndex) => {
                                    if (sIndex === state.currentSubTopicIndex) {
                                        return {
                                            ...s,
                                            completed: true
                                        }
                                    }
                                    return s
                                })
                            }
                        }
                        return t
                    })
                }
            }
            return c
        })
        setState({
            courses,
            currentSubTopicIndex: state.currentSubTopicIndex + 1,
        })
    }

    const { courses, view, loading } = state

    useEffect(() => {
        async function getData() {
            const data = await fetchWithCache('/api/degree', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    degree,
                }),
                disableFetchInBackground: true,
                shouldUseCache: false
            })
            const courses = data?.result?.courses
            setState({
                courses,
                loading
            })
        }
        getData()

    }, [degree])


    async function setCourse({ course, courseIndex }) {
        setLoading(true)
        const data = await fetchWithCache('/api/course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                degree,
                course
            }),
            disableFetchInBackground: true,
            // shouldUseCache: false
        })
        const topics = data?.result?.topics
        setTopicsState({
            courseIndex,
            topics
        })

    }

    async function setTopic({ topic, topicIndex, courseIndex }) {
        setLoading(true)
        const data = await fetchWithCache('/api/topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                degree,
                course: courses[state.currentCourseIndex].title,
                topic
            }),
            disableFetchInBackground: true,
            // shouldUseCache: false
        })
        const subTopics = data?.result?.subTopics
        setSubTopicsState({
            subTopics,
            topicIndex,
            courseIndex
        })
    }

    async function setSubTopic({ topic, topicIndex, courseIndex, subTopicIndex, subTopic }) {
        setLoading(true)
        const data = await fetchWithCache('/api/subTopic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                degree,
                course: courses[state.currentCourseIndex].title,
                topic,
                subTopic
            }),
            disableFetchInBackground: true,
            // shouldUseCache: false
        })
        setSubTopicDataState({
            subTopic: data?.result,
            topicIndex,
            courseIndex,
            subTopicIndex
        })
    }

    function HeaderTitle() {

        const { course, topic, subTopic } = getTitle(state)
        const treeTitle = ((view !== 'degree') ? degree : '') + (course ? ` / ${course}` : '') + (topic ? ` / ${topic}` : '') + (subTopic ? ` / ${subTopic}` : '')

        const viewTitle = {
            degree: "Degree",
            course: "Course",
            topic: "Topic",
            subTopic: "Sub Topic",
        }


        return <Box sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <IconButton onClick={() => goBack()} disabled={view === 'degree'}>
                    <ArrowBackIosNew />
                </IconButton>
                <Typography variant='h4'>{subTopic || topic || course || degree}</Typography>
            </Box>


            <Typography variant='h8' color={'gray'}>
                Degree: {degree}

            </Typography>
            {state.currentCourseIndex !== null ? <Typography variant='h8' color={'gray'}>
                Course #{state.currentCourseIndex + 1}: {course}
            </Typography> : ''}
            {state.correntTopicIndex !== null ? <Typography variant='h8' color={'gray'}>
                Lecture #{state.correntTopicIndex + 1}: {topic}
            </Typography> : ''}
            {state.currentSubTopicIndex !== null ? <Typography variant='h8' color={'gray'}>
                Topic #{state.currentSubTopicIndex + 1}: {subTopic}
            </Typography> : ''}
        </Box>
    }

    return (
        <Box>

            {loading && <LinearProgress />}
            <Box
                sx={{
                    p: 1,
                    paddingLeft: 2,
                    mt: 2,
                }}
            >

                <HeaderTitle />
            </Box>
            <Box>
                {Views[view]({ courses, setCourse, setTopic, setSubTopic, ...state, markSuptopicAsCompleted })}
            </Box>



        </Box>
    )
}

function ProcessList({ processArray, title, onCourseClicked }) {
    return (
        <Box>
            <Box sx={{}}>
                <List sx={{
                    width: '500px',
                }}>
                    {(processArray || []).map((subject, index) => (
                        <ListItem

                            key={subject.name}
                            onClick={() => onCourseClicked(subject.title, index)}

                            sx={{
                                bgcolor: getColor({ index }),
                                p: 1,
                                paddingLeft: 2,
                                mb: 1,
                                borderRadius: 1,
                                width: '500px',
                            }}>



                            <ListItemText
                                // onClick={() => onClick(subject, colors.filter(c => c !== mainColor)[index])}
                                primary={subject.title}
                                secondary={subject.description}


                            />

                        </ListItem>
                    ))}

                </List>
            </Box>


        </Box>
    )
}