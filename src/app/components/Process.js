import React from "react";
import { Box, Divider, LinearProgress, List, ListItem, ListItemText } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { ItemsList } from "./ItemsList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";


export function Process() {
    const [processArray, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    async function onSubmit(text) {
        setLoading(true)
        console.log(text);
        const { result, apiPrice } = await fetchWithCache('/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mainSubject: text
            }),
            disableFetchInBackground: true,
            // shouldUsecache: false

        })

        console.log(result);
        setData(result.process)
        setLoading(false)
    }
    console.log({ processArray });
    return (
        <Box>


            <Box
                sx={{
                    mt: 2,
                }}
            >
                <TextInputWithSend
                    onSubmit={onSubmit}
                    placeHolder='Enter a process'

                />
            </Box>
            {loading && <LinearProgress />}
            {processArray && <ProcessList processArray={processArray} />}
        </Box>
    )
}

function ProcessList({ processArray }) {
    return (
        <Box>
            <Box sx={{}}>
                <List sx={{
                    width: '500px',
                }}>
                    {(processArray || []).map((subject, index) => (
                        <ListItem

                            key={subject.name}

                            sx={{
                                bgcolor: getColor({ index }),
                                p: 0,
                                mb: 1,
                                borderRadius: 1,
                                width: '500px',
                            }}>

                            <WithCollapse
                                type="process"
                                title={subject.title}
                                description={subject.description}
                                mainColor={getColor({ index })}

                            >
                                <Box
                                    sx={{
                                        p: 2
                                    }}
                                >
                                    <div>
                                        Expand
                                    </div>
                                    <div>
                                        Process
                                    </div>



                                </Box>
                            </WithCollapse>



                            {/* <ListItemText
                                // onClick={() => onClick(subject, colors.filter(c => c !== mainColor)[index])}
                                primary={subject.title}
                                secondary={subject.description}

                            /> */}

                        </ListItem>
                    ))}

                </List>
            </Box>


        </Box>
    )
}