import React from "react";
import { Box, Divider, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache, useFetch } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { ItemsList } from "./ItemsList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";
import { TextBox } from "./TextBox";
import { Check, CheckBoxRounded, CheckCircleRounded, CheckRounded } from "@mui/icons-material";


export function Topic({ currentCourseIndex, courses, correntTopicIndex, setSubTopic }) {
    const topic = courses[currentCourseIndex].topics[correntTopicIndex]
    return (
        <Box>
            <TopicData data={topic} onCourseClicked={(subTopic, index) => setSubTopic({
                subTopic,
                subTopicIndex: index,
                topicIndex: correntTopicIndex,
                courseIndex: currentCourseIndex,
                courses,
                topic: topic.title
            })} />
        </Box>
    )
}

function TopicData({ data, onCourseClicked }) {
    const { description, subTopics } = data
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    bgcolor: getColor({ index: 3 }),
                    p: 1,
                    paddingLeft: 2,
                    lineHeight: "24px",

                }}
            >
                {description}
            </Box>
            <Box>

                <TopicList items={subTopics} title='Topics' onCourseClicked={onCourseClicked} />

            </Box>

        </Box>
    )
}

function TopicList({ items, title, onCourseClicked }) {
    return (
        <Box>
            <Box sx={{}}>
                <List sx={{
                    width: '100%',
                }}>
                    {(items || []).map((subject, index) => (
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