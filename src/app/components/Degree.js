import React, { useEffect } from "react";
import { Alert, Box, Button, Divider, Fab, IconButton, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { deleteCache, fetchWithCache, useFetch } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";
import { Course } from "./Course";
import { Topic } from "./Topic";
import { SubTopic } from "./subTopic";
import { ArrowBackIosNew, ArrowForwardIos, Close, QuestionAnswer } from "@mui/icons-material";
import { localStorageAPI } from "../localStorageAPI";
import { MoreInfoAlertText, MoreInfoBox, MoreInfoDialog } from "./MoreInfo";
const localStorage = localStorageAPI()

const Views = {
    degree: DegreeView,
    course: Course,
    topic: Topic,
    subTopic: SubTopic
}

function getTitle(state) {
    const { courses, currentCourseIndex, correntTopicIndex, currentSubTopicIndex } = state
    const course = courses?.[currentCourseIndex]
    const topic = course?.topics?.[correntTopicIndex]
    const subTopic = topic?.subTopics?.[currentSubTopicIndex]


    return {
        course: course?.title,
        topic: topic?.title,
        subTopic: subTopic?.title
    }
}

function DegreeView({ setCourse, courses, }) {
    return <Box>
        {courses && <ProcessList processArray={courses} onCourseClicked={(course, courseIndex) => setCourse({ course, courseIndex })} />}
    </Box>
}

function getStateFromLocalStorage(degree) {

    const currentState = localStorage.getData('appState') || {}
    if (!currentState[degree]) {
        return null
    } else {
        return currentState[degree]
    }
}

function saveStateInLocalStorage(degree, state) {
    state.loading = false
    const currentState = localStorage.getData('appState') || {}
    currentState[degree] = state
    localStorage.saveData('appState', currentState)
    // console.log('saved', currentState);
}



export function Degree({ setPage, params: { degree }, onDataFetched }) {
    const stateFromLocalStorage = getStateFromLocalStorage(degree)
    const [state, _setState] = React.useState(stateFromLocalStorage || {
        view: 'degree',
        currentCourseIndex: null,
        loading: false,
        currentCourseIndex: null,
        correntTopicIndex: null,
        currentSubTopicIndex: null
    })

    const [selectedText, setSelectedText] = React.useState(null)
    const [moreInfoTextArray, setMoreInfoTextArray] = React.useState([])
    const [isMoreInfoClicked, setMoreInfoClicked] = React.useState(null)
    const [isQuestionBoxOpen, setQuestionBoxOpen] = React.useState(false)
    const moreInfoText = moreInfoTextArray[0]
    function closeMoreInfoTextDialog() {
        setMoreInfoClicked(false)
        setMoreInfoTextArray([])

    }
    function popMoreInfoTextArray(text) {
        if (moreInfoTextArray.length === 1) {
            setMoreInfoClicked(false)
            setMoreInfoTextArray([])
            return
        }
        setMoreInfoTextArray(moreInfoTextArray.slice(1))
    }
    function onMoreInfoClicked(text) {
        setMoreInfoTextArray([
            text,
            ...moreInfoTextArray
        ])
        // setMoreInfoText(text)
        // setSelectedText(null)
        setMoreInfoClicked(true)
        setQuestionBoxOpen(false)
    }

    console.log({ state });
    useEffect(() => {
        saveStateInLocalStorage(degree, state)

        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();

            if (selection) {
                const node = selection.anchorNode;
                const isDescendantOfTextBox = (child) => {
                    let node = child;
                    while (node !== null) {
                        if (node.id === 'text-box-id') {
                            return true;
                        }
                        node = node.parentNode;
                    }
                    return false;
                }
                if (node && isDescendantOfTextBox(node)) {
                    // console.log('User selected text:', selectedText);
                    const selectedText = selection.toString(); // Get the selected text
                    if (selectedText) {
                        // console.log('User selected text:', selectedText);
                        setSelectedText(selectedText)
                        setQuestionBoxOpen(true)

                        // You can trigger your custom event or perform any action here
                    }
                }

            } else {
                setSelectedText(null)
            }
        });


    }, [state])

    function getParams(type, params) {
        return [
            '/api/' + type,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
                disableFetchInBackground: true,
                onSuccess: onDataFetched
            }
        ]
    }

    function getData(type, params) {
        return fetchWithCache(...getParams(type, params))
    }

    function preloadNextItem(view) {
        if (!state.courses) {
            return
        }
        if (view === 'degree') {
            const { courses } = state
            const nextCourseIndexWithoutData = courses.findIndex(c => !c.completed)
            if (nextCourseIndexWithoutData === -1) {
                return
            }
            const course = courses[nextCourseIndexWithoutData]
            // console.log({ course });
            if (!course.topics) {
                // setCourseTopics({ course: course.title, courseIndex: nextCourseIndexWithoutData })
                getData('course', { degree, course: course.title })
            }
        }
        if (view === 'course') {
            const { courses } = state
            const { topics } = courses[state.currentCourseIndex]
            const nextTopicIndexWithoutData = topics.findIndex(t => !t.completed)
            if (nextTopicIndexWithoutData === -1) {
                return
            }
            const topic = topics[nextTopicIndexWithoutData]
            // console.log({ topic });
            if (!topic.subTopics) {
                // setTopic({ topic: topic.title, topicIndex: nextTopicIndexWithoutData, courseIndex: state.currentCourseIndex })
                getData('topic', { degree, course: courses[state.currentCourseIndex].title, topic: topic.title })
            }
        }
        if (view === 'topic') {
            const { courses } = state
            const { subTopics } = courses[state.currentCourseIndex].topics[state.correntTopicIndex]
            const nextSubTopicIndexWithoutData = subTopics.findIndex(s => !s.completed)
            if (nextSubTopicIndexWithoutData === -1) {
                return
            }
            const subTopic = subTopics[nextSubTopicIndexWithoutData]
            // console.log({ subTopic });
            if (!subTopic.data) {
                // setSubTopic({ courses, topic: courses[state.currentCourseIndex].topics[state.correntTopicIndex].title, topicIndex: state.correntTopicIndex, courseIndex: state.currentCourseIndex, subTopicIndex: nextSubTopicIndexWithoutData, subTopic: subTopic.title })
                getData('subTopic', {
                    degree,
                    course: courses[state.currentCourseIndex].title,
                    topic: courses[state.currentCourseIndex].topics[state.correntTopicIndex].title,
                    subTopic: subTopic.title
                })
            }
        }
    }
    useEffect(() => {
        preloadNextItem(view)
    })

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

    function setSubTopicDataState({ courses: _courses, subTopic, topicIndex, subTopicIndex, courseIndex }) {
        const courses = _courses.map((c, index) => {
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
        })
    }
    function setTopicsState({ courseIndex, topics }) {
        if (!state.courses[courseIndex].topics) {
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
            })
        } else {
            setState({
                currentCourseIndex: courseIndex,
                loading: false,
            })
        }

    }

    function goToPreviousSubTopic() {
        setState({
            currentSubTopicIndex: state.currentSubTopicIndex - 1
        })
    }

    function markDegreeAsCompleted({ courses }) {
        setState({
            completed: true
        })
    }

    function markCourseAsCompleted({ courses }) {
        courses.map((c, index) => {
            if (index === state.currentCourseIndex) {
                return {
                    ...c,
                    completed: true
                }
            }
            return c
        })
        if (state.currentCourseIndex === state.courses.length - 1) {
            markDegreeAsCompleted({ courses })
        } else {
            setState({
                courses,
                currentSubTopicIndex: null,
                correntTopicIndex: null,
                currentCourseIndex: state.currentCourseIndex + 1,
                view: 'course'
            })
        }
    }

    function markTopicAsCompleted({ courses: _courses }) {
        const courses = _courses.map((c, index) => {
            if (index === state.currentCourseIndex) {
                return {
                    ...c,
                    topics: c.topics.map((t, tIndex) => {
                        if (tIndex === state.correntTopicIndex) {
                            return {
                                ...t,
                                completed: true
                            }
                        }
                        return t
                    })
                }
            }
            return c
        })
        if (state.correntTopicIndex === state.courses[state.currentCourseIndex].topics.length - 1) {
            markCourseAsCompleted({ courses })
        } else {
            setState({
                courses,
                currentSubTopicIndex: null,
                correntTopicIndex: null,
                view: 'course'
            })
        }
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
        if (state.currentSubTopicIndex === state.courses[state.currentCourseIndex].topics[state.correntTopicIndex].subTopics.length - 1) {
            markTopicAsCompleted({ courses })
        } else {
            setSubTopic({
                courses,
                topic: courses[state.currentCourseIndex].topics[state.correntTopicIndex].title,
                topicIndex: state.correntTopicIndex,
                courseIndex: state.currentCourseIndex,
                subTopicIndex: state.currentSubTopicIndex + 1,
                subTopic: courses[state.currentCourseIndex].topics[state.correntTopicIndex].subTopics[state.currentSubTopicIndex + 1].title
            })
        }
    }

    const { courses, view, loading } = state

    useEffect(() => {
        async function getDegreeData() {
            if (state.courses) {
                return
            }
            setLoading(true)
            const data = await getData('degree', { degree })
            const courses = data?.result?.courses
            setState({
                courses,
                loading: false
            })
        }
        getDegreeData()

    }, [degree])


    async function setCourseTopics({ course, courseIndex }) {
        setLoading(true)
        const data = await getData('course', {
            degree, course
        })
        const topics = data?.result?.topics
        setTopicsState({
            courseIndex,
            topics,
        })
    }
    async function setCourse({ course, courseIndex }) {
        if (courses[courseIndex].topics) {
            setState({
                currentCourseIndex: courseIndex,
                view: 'course',
            })
        } else {
            await setCourseTopics({ course, courseIndex })
            setState({
                view: 'course',
            })
        }
    }

    async function setTopic({ topic, topicIndex, courseIndex }) {
        if (courses[courseIndex].topics[topicIndex].subTopics) {
            setState({
                correntTopicIndex: topicIndex,
                view: 'topic',
            })
        } else {
            setLoading(true)
            const data = await getData('topic', {
                degree,
                course: courses[state.currentCourseIndex].title,
                topic
            })
            const subTopics = data?.result?.subTopics
            setSubTopicsState({
                subTopics,
                topicIndex,
                courseIndex
            })
            setState({
                view: 'topic'
            })
        }
    }

    async function setSubTopic({ courses, topic, topicIndex, courseIndex, subTopicIndex, subTopic }) {
        if (courses[courseIndex].topics[topicIndex].subTopics[subTopicIndex].data) {
            setState({
                currentSubTopicIndex: subTopicIndex,
                view: 'subTopic',
                courses
            })

        } else {
            setLoading(true)
            const data = await getData('subTopic', {
                degree,
                course: courses[state.currentCourseIndex].title,
                topic,
                subTopic
            })
            setSubTopicDataState({
                courses,
                subTopic: data?.result,
                topicIndex,
                courseIndex,
                subTopicIndex
            })
            setState({
                view: 'subTopic'
            })
        }
        const subTopics = courses[courseIndex].topics[topicIndex].subTopics
        const nextSubtopic = subTopics[subTopicIndex + 1]
        if (nextSubtopic) {
            getData('subTopic', {
                degree,
                course: courses[state.currentCourseIndex].title,
                topic,
                subTopic: nextSubtopic.title
            })
        }
    }

    function HeaderTitle() {

        const { course, topic, subTopic } = getTitle(state)
        const treeTitle = ((view !== 'degree') ? degree : '') + (course ? ` / ${course}` : '') + (topic ? ` / ${topic}` : '') + (subTopic ? ` / ${subTopic}` : '')

        const viewTitle = {
            degree: "Degree",
            course: "Course",
            topic: "Lecture",
            subTopic: "Sub Topic",
        }

        const viewTitleValue = {
            degree,
            course,
            topic,
            subTopic
        }

        const indexesByView = {
            course: {
                index: () => state.currentCourseIndex + 1,
                length: () => state.courses.length
            },
            topic: {
                index: () => state.correntTopicIndex + 1,
                length: () => state.courses[state.currentCourseIndex]?.topics?.length
            },
            subTopic: {
                index: () => state.currentSubTopicIndex + 1,
                length: () => state.courses[state.currentCourseIndex]?.topics[state.correntTopicIndex]?.subTopics?.length
            }
        }


        return <Box sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <IconButton onClick={() => goBack()} disabled={view === 'degree'}>
                    <ArrowBackIosNew />
                </IconButton>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant='h4'>{viewTitleValue[view]}</Typography>
                    {view !== 'degree' && <Typography variant='h6' sx={{ color: 'gray' }}> {viewTitle[view]} {indexesByView[view].index()} / {indexesByView[view].length()} </Typography>}
                    {view === 'degree' && <Typography variant='h6' sx={{ color: 'gray' }}> Degree </Typography>}
                </Box>


                <div></div>
                {/* <IconButton onClick={() => next()} disabled={view === 'degree'}>
                    <ArrowForwardIos />
                </IconButton> */}
            </Box>
            {/* <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <Typography variant='h4'>{subTopic || topic || course || degree}</Typography>

            </Box> */}


            {/* <Typography variant='h8' color={'gray'}>
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
            </Typography> : ''} */}
        </Box>
    }

    function resetData({ }) {
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
                                            data: null,
                                            completed: false
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
            view: 'topic'
        })
        deleteCache('/api/subTopic', {
            body: JSON.stringify({
                degree,
                course: courses[state.currentCourseIndex].title,
                topic: courses[state.currentCourseIndex].topics[state.correntTopicIndex].title,
                subTopic: courses[state.currentCourseIndex].topics[state.correntTopicIndex].subTopics[state.currentSubTopicIndex].title
            }),
            // shouldUseCache: false
        })
    }


    const params = {
        ...state,
        courses,
        setCourse,
        setTopic,
        setSubTopic,
        markSuptopicAsCompleted,
        setLoading,
        goToPreviousSubTopic,
        resetData
    }



    return (
        <Box>

            {!isQuestionBoxOpen && <Fab
                sx={{
                    position: 'fixed',
                    bottom: 10,
                    right: 10,
                    zIndex: 100000,
                }}
                onClick={() => setQuestionBoxOpen(true)}
            >
                <QuestionAnswer />

            </Fab>}

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
                {view === 'subTopic' && <SubTopic {...params} />}
                {view !== 'subTopic' && Views[view](params)}
            </Box>
            {isQuestionBoxOpen && <MoreInfoAlertText
                selectedText={selectedText}
                onMoreInfoClicked={onMoreInfoClicked}
                closeMoreInfoBox={() => setQuestionBoxOpen(false)}

            />}

            <MoreInfoDialog
                key={`${open}-${moreInfoText}`}
                open={isMoreInfoClicked}
                text={moreInfoText}
                onBackClicked={() => popMoreInfoTextArray()}
                onClose={() => closeMoreInfoTextDialog()}
                getData={getData}
                context={{
                    degree,
                    course: getTitle(state).course,
                    topic: getTitle(state).topic,
                    subTopic: getTitle(state).subTopic
                }}
            />
        </Box>
    )
}



function ProcessList({ processArray, title, onCourseClicked }) {
    return (
        <Box>
            <Box sx={{}}>
                <List sx={{
                    width: '100%',
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
                                width: '100%',
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

