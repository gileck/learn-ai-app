
import React, { useEffect } from 'react';
import { Box, Typography, Collapse, LinearProgress } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

export function WithCollapse({ mainSubject, children, type, mainColor, loadData, title, showArrow }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(null);
    const _title = title || type.charAt(0).toUpperCase() + type.slice(1);

    useEffect(() => {
        setData(null)
        setOpen(false)
    }, [mainSubject, type])

    return (
        <Box
            sx={{
                borderRadius: 1,
            }}
        >
            <Box
                onClick={() => {
                    setOpen(!open)
                    if (!data) {
                        setLoading(true)
                        loadData({ type, title }).then((response) => {
                            // console.log(response.result);
                            setData(response.result)
                            setLoading(false)
                        })
                    }
                }}
                sx={{
                    p: 2,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    bgcolor: mainColor,
                }}
            >
                <Typography>
                    {_title}
                </Typography>
                {
                    showArrow ? (open ? <ArrowDropUp /> : <ArrowDropDown />) : ''
                }
            </Box>
            {loading ? <LinearProgress /> : ''}

            <Collapse in={open && data}>
                <Box>
                    {data && children(data)}
                </Box>

            </Collapse>
        </Box >
    )
}