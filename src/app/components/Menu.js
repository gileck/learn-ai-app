
import React from 'react'; // Import React
import { Box, IconButton, Menu as MenuComp, MenuItem } from '@mui/material'; // Import MUI components
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon

export function Menu({ setPage }) {
    const [anchorEl, setAnchorEl] = React.useState(null); // State for menu anchor

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const onHistoryClicked = () => {
        setPage('history')
        handleMenuClose()
    }
    return <Box>
        <IconButton color="inherit" onClick={handleMenuClick}>
            <MenuIcon />
        </IconButton>
        <MenuComp
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => onHistoryClicked()}>History</MenuItem>
        </MenuComp>
    </Box>
}