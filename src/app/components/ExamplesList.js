import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { getColor } from './utils';
import { WithCollapse } from './WithCollapse';
import { TextBox } from './TextBox';
import { LoadMoreListItemButton } from './LoadMoreListItemButton';
import { Box, Divider } from '@mui/material';
import { colors } from './utils';


export function ExamplesList({ examples, mainColor, setRoute, onLoadMoreClicked, loadExample }) {
    const [examplesList, setExamplesList] = React.useState(examples);
    return (
        <Box>
            <List sx={{}}>
                {(examplesList || []).map((example, index) => (
                    <ListItem
                        key={example}
                        sx={{
                            bgcolor: colors.filter(c => c !== mainColor)[index],
                            mb: 1,
                            borderRadius: 1,
                            p: 0
                        }}
                    >
                        <WithCollapse
                            type="example"
                            title={example.title}
                            mainColor={getColor({ mainColor, index })}
                            loadData={example.text ? () => Promise.resolve({ result: example }) : loadExample}
                        >

                            {
                                data => <>
                                    <Divider sx={{
                                        marginBottom: 1
                                    }} />
                                    <Box
                                        sx={{
                                            p: 1
                                        }}
                                    >
                                        <TextBox text={data.text} title={example.title} setRoute={setRoute} />
                                    </Box>


                                </>
                            }
                        </WithCollapse>

                    </ListItem>
                ))}
                <LoadMoreListItemButton
                    type="examples"
                    excludeItems={examplesList}
                    setState={result => setExamplesList(prev => [...prev, ...result.examples])}
                    onLoadMoreClicked={onLoadMoreClicked}
                />
            </List>
        </Box>
    )
}