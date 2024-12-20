import React from "react";
import { Box, Button, Divider, Icon, IconButton, LinearProgress, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { TextInputWithSend } from "./TextInputWithSend";
import { fetchWithCache } from "../useFetch";
import { SubjectList } from "./SubjectList";
import { getColor } from "./utils";
import { WithCollapse } from "./WithCollapse";
import { Degree } from "./Degree";
import { calculateOverrideValues } from "next/dist/server/font-utils";
import { Delete } from "@mui/icons-material";
import { localStorageAPI } from "../localStorageAPI";
const localStorage = localStorageAPI()
function getStateFromLocalStorage() {
    return localStorage.getData('appState')
}
function calculateCourseCompleted(degree) {
    const { courses } = degree
    return `${courses.filter(c => c.completed).length}/${courses.length}`
}
export function Education({ setPage }) {
    const activeDegrees = getStateFromLocalStorage() || []


    return (
        <Box>
            <List>
                {
                    Object.entries(activeDegrees).map(([name, value], index) => {
                        return <ListItem
                            onClick={() => {
                                localStorage.saveData('currentDegree', { name })
                                setPage('degree', { degree: name })
                            }}
                            sx={{
                                bgcolor: getColor({ index }),
                                p: 1,
                                paddingLeft: 2,
                                mb: 1,
                                borderRadius: 1,
                            }}
                        >
                            <ListItemText
                                primary={name}
                                secondary={calculateCourseCompleted(value)}

                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => {
                                        const shouldDelete = confirm('Are you sure you want to delete this degree?')
                                        if (!shouldDelete) return
                                        const newState = { ...activeDegrees }
                                        delete newState[name]
                                        localStorage.saveData('appState', newState)
                                        window.location.reload()
                                    }}
                                    edge="end" aria-label="delete">
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    })
                }
            </List>
            <Button
                onClick={() => setPage('searchDegree')}
            >
                Add Degree
            </Button>
        </Box>
    )

}
