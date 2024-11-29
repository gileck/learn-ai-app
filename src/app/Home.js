'use client'
import { Alert, AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import { localStorageAPI } from './localStorageAPI';
// Add the following imports
import { getRouteFromUrl, setRouteInUrl, getPageFromUrl } from './components/utils';
import { getColor, speak } from './components/utils';

import { History } from './components/History';
import { MainSubject } from './components/MainSubject';
import { RandomSubjectList } from './components/RandomSubjectList';
import { addToHistory, onDataFetched } from './components/utils';
import { Menu } from './components/Menu';
import { AppTopBar } from './components/AppTopBar';
import { Settings } from './components/Settings';
import { Process } from './components/Process';
import { Education } from './components/Education';
import { SearchDegree } from './components/SearchDegree';
import { Course } from './components/Course';
import { Topic } from './components/Topic';
import { SubTopic } from './components/subTopic';
import { AppContext } from './AppContext';
import { Degree } from './components/Degree';
import { Check } from '@mui/icons-material';


const staticSubjects = [
  "Astrobiology",
  "Quantum Computing",
  "Cognitive Behavioral Therapy",
  "Renewable Energy Technologies",
  "Cultural Anthropology"
]




export default function Home() {


  const routeFromUrl = getRouteFromUrl();
  const [route, setRouteInternal] = React.useState(routeFromUrl || []);
  const [page, setPageInternal] = React.useState(getPageFromUrl() || 'randomSubjects');
  const [dataFetched, setDataFetched] = React.useState(localStorageAPI().getData('dataFetched') || []);
  const [alert, setAlert] = React.useState(null);
  function openAlert(message) {
    setAlert(message)
    setTimeout(() => {
      setAlert(null)
    }, 10000)
  }

  useEffect(() => {
    window.addEventListener('popstate', (event) => {
      // console.log('User navigated back or forward', event);
      setPageInternal(getPageFromUrl());
      setRouteInternal(getRouteFromUrl());
      // Perform your logic here
    });
  }, []);

  function getParamsFromURL() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const paramsObj = {};
    for (const [key, value] of params) {
      paramsObj[key] = value;
    }
    return paramsObj;
  }


  function onDataFetched(data) {
    const apiPrice = data?.apiPrice;

    if (apiPrice > 0) {
      // console.log({ apiPrice });
      const dataFetched = localStorageAPI().getData('dataFetched') || [];
      const newData = [...dataFetched, { apiPrice: apiPrice, date: new Date().getTime() }]
      localStorageAPI().saveData('dataFetched', newData);
      setDataFetched(newData)
    }
    if (apiPrice > 0.01) {
      openAlert(`This query costed you ${apiPrice} credits (HIGH)`)
    }

    const dailyCost = dataFetched.filter(item => new Date() - new Date(item.date) < 24 * 60 * 60 * 1000)
      .reduce((acc, item) => acc + item.apiPrice, 0)
    if (dailyCost > 0.1) {
      openAlert(`You have spent ${dailyCost.toFixed(2)} NIS today`)
    }
  }

  const setPage = (page, params = {}) => {
    // console.log({ page });
    const paramsString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    console.log({ paramsString, params });
    window.history.pushState({}, '', `${window.location.pathname}?page=${page}&${paramsString}`);
    setPageInternal(page);
    setRouteInternal([]);
    window.scrollTo(0, 0);

    // if (page === 'mainSubject') {
    //   setRoute(params.route)
    // }
  }

  const setRoutes = (routes) => {
    setPage('mainSubject')
    setRouteInternal(routes);
    setRouteInUrl(routes);
  }

  const setRoute = (_route, description) => {

    if (page !== 'mainSubject') {
      setPage('mainSubject')
    }

    addToHistory({
      subject: _route,
      route: [...route, _route],
      date: new Date().getTime(),
      description

    })
    setRouteInternal(prevRoute => [...prevRoute, _route]);
    setRouteInUrl([...route, _route]);
  }
  const setBackRoute = () => {
    const newArray = route.slice(0, -1)
    setRouteInternal(prevRoute => prevRoute.slice(0, -1));
    setRouteInUrl(newArray);
    if (newArray.length === 0) {
      setPage('randomSubjects')
    }
  }



  const params = {
    route,
    setRoute,
    setRoutes,
    setPage,
    setBackRoute,
    onDataFetched,
    params: getParamsFromURL()
  }

  const Comps = {
    mainSubject: MainSubject,
    randomSubjects: RandomSubjectList,
    history: History,
    settings: Settings,
    process: Process,
    education: Education,
    degree: Degree,
    searchDegree: SearchDegree,

  }
  const Comp = Comps[page] || RandomSubjectList;


  return (

    <>
      <AppContext>
        <AppTopBar
          setPage={setPage}
          dataFetched={dataFetched}
        />
        <Box sx={{}}>
          <Comp {...params} />
        </Box>

        {alert && <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            margin: 2,
            zIndex: 999
          }}
        >
          <Alert icon={<Check fontSize="inherit" />} severity="warning">
            {alert}
          </Alert>
        </Box>}
      </AppContext>
    </>
  );
}


















