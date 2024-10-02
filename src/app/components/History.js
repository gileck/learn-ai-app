import React from 'react'; // Import React
import { Box, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material'; // Import MUI components
import Clear from '@mui/icons-material/Clear'; // Import Clear icon
import { localStorageAPI } from '../localStorageAPI'; // Import localStorageAPI
import { colors } from './utils'; // Import colors



export function History({ setRoutes }) {
    const history = localStorageAPI().getData('history') || [];
    const [historyList, setHistoryList] = React.useState(history);
    console.log({ history });
    return <Box>
        <List>
            {historyList
                .sort((a, b) => b.date - a.date)
                .map((item, index) => (
                    <ListItem

                        key={item.subject + item.date}
                        sx={{
                            bgcolor: colors[index % colors.length],
                            mb: 1,
                            borderRadius: 1,
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box
                            onClick={() => setRoutes(item.route)}
                        >
                            <ListItemText

                                primary={item.subject}
                                secondary={<>
                                    <div>
                                        {item.route.join(' > ')}
                                    </div>
                                    <div>
                                        {new Date(item.date).toLocaleString()}
                                    </div>
                                </>}
                            />
                        </Box>

                        <IconButton
                            edge="end"
                            onClick={() => {
                                const newHistory = history.filter((_, i) => i !== index);
                                localStorageAPI().saveData('history', newHistory);
                                setHistoryList(newHistory)
                            }}
                        >
                            <Clear />
                        </IconButton>
                    </ListItem>
                ))}
        </List>
    </Box>
}