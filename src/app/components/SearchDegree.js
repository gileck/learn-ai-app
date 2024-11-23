import React from "react";
import { Box, Button, Divider, Icon, IconButton, LinearProgress, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache } from "../useFetch";
import { getColor } from "./utils";

export function SearchDegree({ setPage }) {

    const [degrees, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [mainSubject, setMainSubject] = React.useState(null);
    async function onSubmit(text) {
        setLoading(true)
        console.log(text);
        const { result, apiPrice } = await fetchWithCache('/api/searchDegree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mainSubject: text
            }),
            disableFetchInBackground: true,
            shouldUsecache: false

        })

        console.log(result);
        setData(result.degrees)
        setMainSubject(text)
        setLoading(false)
    }
    function onClick(degree) {
        setPage('degree', { degree: degree })
    }




    return (
        <Box>


            <Box
                sx={{
                    mt: 2,
                }}
            >
                <TextInputWithSend
                    value={'Biology'}
                    onSubmit={onSubmit}
                    placeHolder='Enter a process'
                />
            </Box>
            {loading && <LinearProgress />}
            {degrees && <ProcessList processArray={degrees} title={mainSubject} onClick={onClick} />}
        </Box>
    )
}

function ProcessList({ processArray, title, onClick }) {
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
                            onClick={() => onClick(subject.title)}

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