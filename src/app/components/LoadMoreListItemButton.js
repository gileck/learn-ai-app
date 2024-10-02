import React from 'react';
import { ListItem, ListItemText, Button, LinearProgress } from '@mui/material';

export function LoadMoreListItemButton({ type, excludeItems, setState, onLoadMoreClicked }) {
    const [loading, setLoading] = React.useState(false);

    return <>
        <ListItem
            sx={{
                p: 0
            }}
        >
            <Button
                disabled={loading}
                fullWidth
                onClick={() => {
                    setLoading(true)
                    onLoadMoreClicked(type, excludeItems, (result) => {
                        setState(result)
                        setLoading(false)
                    })
                }}
                sx={{
                    p: 0
                }}
            >
                Load more {type}
            </Button>

        </ListItem>
        {loading ? <LinearProgress /> : ''}
    </>
}