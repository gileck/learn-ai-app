import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import { getColor, colors } from './utils';
import { LoadMoreListItemButton } from './LoadMoreListItemButton'; // Added missing import
import { Cancel, Delete, Remove } from '@mui/icons-material';

export function SubjectList({ onSubjectClicked, mainColor, subjects, onLoadMoreClicked, shouldShowXButton, onDeleteSubjectClicked }) {
    const [subjectList, setSubjectList] = React.useState(subjects);


    useEffect(() => {
        setSubjectList(subjects);
    }, [subjects]);

    return (
        <Box sx={{}}>
            <List sx={{}} >
                {(subjectList || []).map((subject, index) => (
                    <ListItem
                        key={subject.name}

                        sx={{ bgcolor: getColor({ mainColor, index }), mb: 1, borderRadius: 1 }}>
                        <ListItemText
                            onClick={() => onSubjectClicked(subject, colors.filter(c => c !== mainColor)[index])}
                            primary={subject.name}
                            secondary={subject.description}

                        />
                    </ListItem>
                ))}
                <LoadMoreListItemButton
                    type="subjects"
                    excludeItems={subjectList.map(item => item.name)}
                    setState={result => setSubjectList(prev => prev ? [...prev, ...result.subjects] : result.subjects)}
                    onLoadMoreClicked={onLoadMoreClicked}
                />
            </List>
        </Box>
    );
}