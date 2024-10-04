import React from 'react'; // Import React
import { Box, List, ListItem, ListItemText, IconButton, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup } from '@mui/material'; // Import MUI components
import Clear from '@mui/icons-material/Clear'; // Import Clear icon
import { localStorageAPI } from '../localStorageAPI'; // Import localStorageAPI
import { colors } from './utils'; // Import colors



export function Settings({ setRoutes }) {
    const config = localStorageAPI().getData('learn-ai-config') || {}
    const [state, setState] = React.useState(config);
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
    </Box >
}