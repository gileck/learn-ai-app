import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export function Tabs({ data }) {
    const [value, setValue] = React.useState(1);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {data.map((item, index) => (
                        <Tab
                            onClick={(e) => handleChange(e, index + 1)}
                            key={item.title}
                            label={item.title}
                            selected={value === index + 1}
                            sx={{
                                color: value === index + 1 ? 'primary.main' : 'black',
                                borderBottom: value === index + 1 ? '2px solid' : 'none',
                            }}
                        />
                    ))}
                </Box>
                {data.map((item, index) => (
                    value === index + 1 ?
                        <Box key={item.title} sx={{ p: 1 }}>
                            {item.content}
                        </Box> : null
                ))}
            </Box>
        </Box>
    )
}


