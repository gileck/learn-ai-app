
import React, { useEffect } from 'react';
import { Box, Typography, Collapse, LinearProgress } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

export function WithCollapse({ description, mainSubject, children, type, mainColor, loadData, title, showArrow }) {
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
                    if (!data && loadData) {
                        setLoading(true)
                        loadData({ type, title }).then((response) => {
                            // console.log(response.result);
                            setData(response.result)
                            setLoading(false)
                        })
                    } else {
                        setData(null)
                    }
                }}
                sx={{
                    p: 2,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    bgcolor: mainColor,
                    width: '100%',
                }}
            >

                <Box>
                    <Typography> {_title}</Typography>
                    <Typography

                        sx={{
                            color: 'gray'
                        }}>{description}

                    </Typography>
                </Box>



                {
                    showArrow ? (open ? <ArrowDropUp /> : <ArrowDropDown />) : ''
                }
            </Box>
            {loading ? <LinearProgress /> : ''}

            <Collapse in={open && ((loadData && data) || !loadData)} >
                <Box>
                    {loadData && data && children(data)}
                    {!loadData && children}
                </Box>

            </Collapse>
        </Box >
    )
}