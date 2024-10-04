import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { getColor } from './utils';
import { WithCollapse } from './WithCollapse';
import { TextBox } from './TextBox';
import { LoadMoreListItemButton } from './LoadMoreListItemButton';
import { Box, Divider } from '@mui/material';
import { colors } from './utils';


export function ItemsList({ type, items, mainColor, setRoute, onLoadMoreClicked, loadItem }) {
    console.log({ items });
    const [itemsList, setItemsList] = React.useState(items);
    console.log({ itemsList });

    return (
        <Box>
            <List sx={{}}>
                {(itemsList || []).map((item, index) => (
                    <ListItem
                        key={item.title}
                        sx={{
                            bgcolor: colors.filter(c => c !== mainColor)[index],
                            mb: 1,
                            borderRadius: 1,
                            p: 0
                        }}
                    >
                        <WithCollapse
                            type={type}
                            title={item.title}
                            mainColor={getColor({ mainColor, index })}
                            loadData={item.text ? () => Promise.resolve({ result: item }) : loadItem}
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
                                        <TextBox text={data.text} title={item.title} setRoute={setRoute} />
                                    </Box>


                                </>
                            }
                        </WithCollapse>

                    </ListItem>
                ))}
                <LoadMoreListItemButton
                    type={type}
                    excludeItems={itemsList}
                    setState={result => setItemsList(prev => [...prev, ...result[type]])}
                    onLoadMoreClicked={onLoadMoreClicked}
                />
            </List>
        </Box>
    )
}