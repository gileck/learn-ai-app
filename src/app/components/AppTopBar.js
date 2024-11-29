import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Menu } from './Menu';
import { localStorageAPI } from '../localStorageAPI';

function TotalDailyPrice({ dataFetched }) {



    const requestsToday = dataFetched
        .filter(item => item.apiPrice)
        .filter(item => new Date() - new Date(item.date) < 24 * 60 * 60 * 1000)

    const requestsThisWeek = dataFetched
        .filter(item => item.apiPrice)
        .filter(item => new Date() - new Date(item.date) < 7 * 24 * 60 * 60 * 1000)

    const priceToday = requestsToday
        .reduce((acc, item) => acc + item.apiPrice, 0)
        .toFixed(4)


    const priceThisWeek = requestsThisWeek
        .reduce((acc, item) => acc + item.apiPrice, 0)
        .toFixed(2)


    return <Typography
        sx={{
            color: 'white',
            fontSize: '14px'
        }}
    >
        {/* {priceToday} ({requestsToday.length}) / {priceThisWeek} ({requestsThisWeek.length}) */}
        {priceToday} / {priceThisWeek}
    </Typography>
}

export function AppTopBar({
    setPage,
    dataFetched

}) {
    return <AppBar position="static">
        <Toolbar
            sx={{
                width: '100%'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '95%'
                }}
            >


                <Typography variant="h6" onClick={() => setPage('randomSubjects')}>Learn AI</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'center'
                    }}
                >
                    <TotalDailyPrice dataFetched={dataFetched} />
                    <Menu setPage={setPage} />
                </Box>

            </Box>
        </Toolbar>
    </AppBar>
}