import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, Box } from '@mui/material';
import { getColor, colors } from './utils';
import { LoadMoreListItemButton } from './LoadMoreListItemButton'; // Added missing import

export function SubjectList({ onSubjectClicked, mainColor, subjects, onLoadMoreClicked }) {
    const [subjectList, setSubjectList] = React.useState(subjects);

    console.log({ subjectList });

    useEffect(() => {
        setSubjectList(subjects);
    }, [subjects]);

    return (
        <Box sx={{
        }}>
            <List sx={{
            }} >
                {(subjectList || []).map((subject, index) => (
                    <ListItem
                        key={subject}
                        onClick={() => onSubjectClicked(subject, colors.filter(c => c !== mainColor)[index])}
                        sx={{ bgcolor: getColor({ mainColor, index }), mb: 1, borderRadius: 1 }}>
                        <ListItemText primary={subject} />
                    </ListItem>
                ))}
                <LoadMoreListItemButton
                    type="subjects"
                    excludeItems={subjectList}
                    setState={result => setSubjectList(prev => prev ? [...prev, ...result.subjects] : result.subjects)}
                    onLoadMoreClicked={onLoadMoreClicked}
                />
            </List>
        </Box>
    );
}