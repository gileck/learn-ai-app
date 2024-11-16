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
            <TabContext value={value}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    {data.map((item, index) => (
                        <Tab key={item.title} label={item.title} value={index + 1} />
                    ))}
                </TabList>
                {data.map((item, index) => (
                    <TabPanel key={item.title} value={index + 1} sx={{ p: 1 }}>
                        {item.content}
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    )
}
