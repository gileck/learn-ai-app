import React from 'react'; // Import React
import { Box, List, ListItem, ListItemText, IconButton, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, Button } from '@mui/material'; // Import MUI components
import Clear from '@mui/icons-material/Clear'; // Import Clear icon
import { localStorageAPI } from '../localStorageAPI'; // Import localStorageAPI
import { colors } from './utils'; // Import colors
import { ContentPaste, CopyAll, Delete, Print } from '@mui/icons-material';



export function Settings({ setRoutes }) {
    const config = localStorageAPI().getData('learn-ai-config') || {}
    const [state, setState] = React.useState(config);
    const [selectedCacheKey, setSelectedCacheKey] = React.useState(null);
    const { language, 'response-length': responseLength } = state;


    function onChange(key) {
        return (e) => {
            const config = localStorageAPI().getData('learn-ai-config') || {}
            config[key] = e.target.value;
            console.log(config);
            localStorageAPI().saveData('learn-ai-config', config);
            setState(config);
        }
    }

    return <Box>
        <FormGroup>
            {/* Language Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                    onChange={onChange('language')}
                    id="language-select"
                    label="Language"
                    value={language}
                >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Hebrew">Hebrew</MenuItem>
                </Select>
            </FormControl>

            {/* Length Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="length-label">Length</InputLabel>
                <Select
                    onChange={onChange('response-length')}
                    id="length-select"
                    label="Length"
                    value={responseLength}>
                    <MenuItem value="Short">Short</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Long">Long</MenuItem>
                </Select>
            </FormControl>

            {/* Type Selection */}
            {/* <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                    onChange={onChange('response-type')}
                    id="type-select"
                    label="Type"
                    value={responseType}>
                    <MenuItem value="Bullet points">Bullet points</MenuItem>
                    <MenuItem value="Paragraph">Paragraph</MenuItem>
                </Select>
            </FormControl> */}


        </FormGroup>

        <Box
            sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',




            }}
        >

            <Select
                onChange={e => {
                    const key = e.target.value;
                    console.log({ key });
                    setSelectedCacheKey(key);
                }}
            >
                {
                    localStorageAPI().getKeys().map((key, index) => {
                        return <MenuItem
                            value={key}
                            selected={key === selectedCacheKey}
                        >
                            {key}
                        </MenuItem>
                    })
                }
            </Select>


            <Button
                variant='contained'
                startIcon={<CopyAll />}
                onClick={() => {
                    if (!selectedCacheKey) {
                        alert('Please select a cache key');
                        return;
                    }
                    // localStorageAPI().cleanData('learn-ai-config');
                    // localStorageAPI().cleanData('learn-ai-deletedSubjects');
                    // localStorageAPI().cleanData('history');
                    const data = localStorageAPI().getData(selectedCacheKey);
                    console.log({ data });
                    // copy
                    navigator.clipboard.writeText(JSON.stringify(data));
                }}
            >
                Copy Cache
            </Button>
            {/* //upload cache */}
            <Button
                variant='contained'
                startIcon={<ContentPaste />}
                onClick={() => {
                    if (!selectedCacheKey) {
                        alert('Please select a cache key');
                        return;
                    }
                    navigator.clipboard.readText().then(text => {
                        try {
                            console.log({ text });
                            const obj = JSON.parse(text);
                            const currentCacheObject = localStorageAPI().getData(selectedCacheKey) || {};
                            const newCacheObject = { ...obj, ...currentCacheObject };
                            console.log({ newCacheObject });
                            localStorageAPI().saveData(selectedCacheKey, newCacheObject);
                            alert('Cache uploaded');
                        }
                        catch (e) {
                            console.error('Error uploading cache', e.message);
                            alert('Error uploading cache');
                        }
                    });
                }}
            >
                Upload Cache
            </Button>

            <Button
                variant='contained'
                startIcon={<Print />}
                onClick={() => {
                    if (!selectedCacheKey) {
                        alert('Please select a cache key');
                        return;
                    }
                    const data = localStorageAPI().getData(selectedCacheKey);
                    // console.log({ fetchCache });

                    if (document.getElementById('cache_print').innerText.length > 0) {
                        document.getElementById('cache_print').innerText = '';
                    } else {
                        document.getElementById('cache_print').innerText = JSON.stringify(data);
                    }

                }}
            >
                Print Cache
            </Button>

            <Button
                variant='contained'
                color='error'
                startIcon={<Delete />}
                onClick={() => {
                    if (!selectedCacheKey) {
                        alert('Please select a cache key');
                        return;
                    }
                    // localStorageAPI().cleanData('learn-ai-config');
                    // localStorageAPI().cleanData('learn-ai-deletedSubjects');
                    // localStorageAPI().cleanData('history');
                    // localStorageAPI().cleanData('fetchCache');
                    // localStorageAPI().cleanData('appState');
                    localStorageAPI().saveData(selectedCacheKey, {});


                    setState({});
                    console.log('Cache cleared');
                }}
            >
                Clear Cache
            </Button>


        </Box>
        <div id="cache_print"></div>


    </Box >



}