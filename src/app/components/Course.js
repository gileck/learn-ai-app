import React from "react";
import { Box, Divider, LinearProgress, List, ListItem, ListItemText } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache, useFetch } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { ItemsList } from "./ItemsList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";


export function Course({ setPage, params }) {
    const course = params.course
    const degree = params.degree
    console.log({
        course,
        degree
    });
    const { data, loading } = useFetch('/api/course', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            course,
            degree,
        }),
        disableFetchInBackground: true,

    })
    console.log({ data });
    const topics = data?.result?.topics
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
            {topics && <ProcessList processArray={topics} title={course} onCourseClicked={onCourseClicked} />}
        </Box>
    )
}

function ProcessList({ processArray, title, onCourseClicked }) {
    return (
        <Box>
            <Box sx={{}}>
                <h1>{title}</h1>
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