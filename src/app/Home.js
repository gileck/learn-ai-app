'use client'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
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
import { Course } from './components/Course';
import { Topic } from './components/Topic';


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
  }

  const setPage = (page, params = {}) => {
    // console.log({ page });
    const paramsString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    console.log({ paramsString, params });
    window.history.pushState({}, '', `${window.location.pathname}?page=${page}&${paramsString}`);
    setPageInternal(page);
    setRouteInternal([]);
    window.scrollTo(0, 0);
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
    course: Course,
    topic: Topic

  }
  const Comp = Comps[page] || RandomSubjectList;


  return (
    <>
      <AppTopBar
        setPage={setPage}
        dataFetched={dataFetched}
      />
      <Box sx={{}}>
        <Comp {...params} />
      </Box>
    </>
  );
}


















