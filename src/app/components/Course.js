import React from "react";
import { Box, Divider, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache, useFetch } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";
import { CheckCircleRounded } from "@mui/icons-material";


export function Course({ currentCourseIndex, courses, setTopic }) {
    const course = courses[currentCourseIndex]
    return (
        <Box>
            <ProcessList processArray={course.topics} onTopicClicked={(topic, index) => setTopic({
                topic,
                topicIndex: index,
                courseIndex: currentCourseIndex
            })} />
        </Box>
    )
}

function ProcessList({ processArray, title, onTopicClicked }) {
    return (
        <Box>
            <Box sx={{}}>
                <List sx={{
                    width: '100%',
                }}>
                    {(processArray || []).map((subject, index) => (
                        <ListItem

                            key={subject.name}
                            onClick={() => onTopicClicked(subject.title, index)}

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
                                primary={<Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                    }}
                                >

                                    {subject.title}
                                    {subject.completed && <CheckCircleRounded sx={{ color: 'green' }} />}
                                </Box>}
                                secondary={subject.description}


                            />

                        </ListItem>
                    ))}

                </List>
            </Box>


        </Box>
    )
}