import React from "react";
import { Box, Divider, LinearProgress, List, ListItem, ListItemText } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache, useFetch } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { ItemsList } from "./ItemsList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";
import { TextBox } from "./TextBox";


export function Topic({ setPage, params }) {
    const course = params.course
    const degree = params.degree
    const topic = params.topic
    console.log({
        course,
        degree,
        topic
    });
    const { data, loading } = useFetch('/api/topic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            course,
            degree,
            topic
        }),
        disableFetchInBackground: false,

    })
    console.log({ data });
    const subTopics = data?.result?.subTopics
    const overview = data?.result?.overview
    // const [subjects, setData] = React.useState(null);
    // const [loading, setLoading] = React.useState(false);
    // const [mainSubject, setMainSubject] = React.useState(null);
    // async function onSubmit(text) {
    //     setLoading(true)
    //     console.log(text);
    //     const { result, apiPrice } = await fetchWithCache('/api/course', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             mainSubject: text
    //         }),
    //         disableFetchInBackground: true,
    //         // shouldUsecache: false

    //     })

    //     console.log(result);
    //     setData(result.subjects)
    //     setMainSubject(text)
    //     setLoading(false)
    // }
    function onCourseClicked(topic) {
        console.log({ topic });
        setPage('topic', { topic, course, degree })

    }
    return (
        <Box>

            {loading && <LinearProgress />}
            <h1>{topic}</h1>

            <Box
                sx={{
                    bgcolor: getColor({ index: 1 }),
                    p: 1,
                    paddingLeft: 2,
                    mb: 1,
                    borderRadius: 1,
                    width: '500px',
                    lineHeight: "24px",
                    whiteSpace: "pre-line",
                    p: 1,
                }}
            >

                {overview}

            </Box>
            {subTopics && <ProcessList processArray={subTopics} title={topic} onCourseClicked={onCourseClicked} />}
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
                            onClick={() => onCourseClicked(subject.title)}

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