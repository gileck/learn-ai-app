'use client'
import React, { useEffect } from 'react';
import { fetchWithCache, useFetch } from "./useFetch";
import { Box, Button, Collapse, Divider, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import { ArrowBack, ArrowDownward, ArrowDownwardSharp, ArrowDropDown, ArrowDropUp, ArrowUpward, Refresh, Send, SendRounded } from '@mui/icons-material';
import { localStorageAPI } from './localStorageAPI';

const staticSubjects = [
  "Astrobiology",
  "Quantum Computing",
  "Cognitive Behavioral Therapy",
  "Renewable Energy Technologies",
  "Cultural Anthropology"
]
const colors = [
  "#f5f59a",  // Ivory
  "#fec8c8",  // Light Gray
  "#cbccfa",  // Alice Blue
  "#e6e6fa",  // Lavender
  "#b9ffdc",  // Mint Cream
  "#abeeee",  // Light Cyan
  "#fafad2",  // Pale Goldenrod
  "#ffe4e1",  // Misty Rose
  "#ffdab9",  // Peach Puff
  "#ffb6c1",  // Light Pink
  "#fffacd",  // Lemon Chiffon
  "#ffffe0",  // Light Yellow
  "#afeeee"   // Pale Turquoise
];

function speak(text) {

  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(text);
  if (synth.speaking) {
    synth.cancel();
  } else {
    synth.speak(utterThis);
  }
}

function setRouteInUrl(route) {
  if (typeof window === 'undefined') return;
  const searchParams = new URLSearchParams(location.search);
  searchParams.set('route', route.join('_'));
  window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
}

function getRouteFromUrl() {
  if (typeof window === 'undefined') return [];
  const searchParams = new URLSearchParams(location.search);
  const route = searchParams.get('route');
  return route ? route.split('_') : [];
}

function RandomSubjectList({ onDataFetched, setRoute }) {
  const { data, loading } = useFetch('/api/randomSubjects', {
    shouldUsecache: false,
    overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
    disableFetchInBackground: true,
    onSuccess: onDataFetched
  });

  async function onLoadMoreClicked(type, exclude, cb) {
    const data = await fetchWithCache('/api/randomSubjects', {
      shouldUsecache: true,
      overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
      disableFetchInBackground: true,
      body: JSON.stringify({ exclude }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

    })
    cb(data.result)

  }

  const subjects = data?.result?.subjects;
  return <>
    <TextInputWithSend
      onSubmit={(subject) => onSubjectClicked(subject, colors[0])}
      placeHolder="Enter a subject..."
    />
    {loading && <LinearProgress />}

    {!loading && <SubjectList subjects={subjects} onSubjectClicked={subject => setRoute(subject)} onLoadMoreClicked={onLoadMoreClicked} />}
  </>
}
function MainSubject({
  route,
  setRoute,
  setBackRoute,
  onDataFetched

}) {

  const [mainColor, setColor] = React.useState(colors[0]);

  const { data, loading } = useFetch('/api/subject', {
    query: { route },
    shouldUsecache: true,
    overrideStaleTime: 1000 * 60 * 60 * 24 * 7 * 3, // 3 week
    disableFetchInBackground: true,
    onSuccess: onDataFetched
  });
  const { result, apiPrice } = data || {};
  // console.log({ result, apiPrice });
  const { description } = result || {}
  const shouldShowHeader = route.length > 0;
  const singleSubject = route.length !== 0;

  const mainSubject = route[route.length - 1];

  function onSubjectClicked(subjectName, selectedColor) {
    setRoute(subjectName);
    setColor(selectedColor)

  }

  async function onQuestionClicked(question, setAnswer) {
    // console.log({ question });
    const response = await fetchWithCache('/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, mainSubject }),
      onSuccess: onDataFetched,
      disableFetchInBackground: true,

    })
    // console.log({ response });

    setAnswer(response.result)

  }

  async function onLoadMoreClicked(type, exclude, onLoaded) {
    const response = await fetchWithCache('/api/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, mainSubject, exclude }),
      onSuccess: onDataFetched,
      disableFetchInBackground: true,

    })
    // console.log({ response });
    onLoaded(response.result)
  }

  function loadExample({ title }) {
    return fetchWithCache('/api/example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, mainSubject }),
      onSuccess: onDataFetched,
      disableFetchInBackground: true,
    })
  }

  function loadData({ type, params }) {
    return fetchWithCache('/api/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, mainSubject, params }),
      onSuccess: onDataFetched,
      disableFetchInBackground: true,
    })
  }


  const params = {

    description,
    mainColor,
    route,
    setRoute,
    setBackRoute,
    onSubjectClicked,
    onQuestionClicked,
    onLoadMoreClicked,
    loadData,
    loadExample
  }

  return <>
    <Box
      sx={{
        p: 1,
        bgcolor: mainColor,
        borderRadius: 1,
        mb: 1,

      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <ArrowBack onClick={() => setBackRoute()} />
        <Typography variant="h6" sx={{
          margin: 1,

        }}>
          {mainSubject}
        </Typography>
      </Box >

      <Box sx={{
        padding: 1,

      }} >
        <Typography variant="h12" sx={{
          color: 'gray'
        }}>

          {route.join(' > ')}
        </Typography>
      </Box>
      <Divider />
      {loading ? <LinearProgress /> : ''}

      <Box
        sx={{
          borderRadius: 1,
          visibility: loading ? 'hidden' : 'visible',
        }}
      >
        <TextBox text={description} />
      </Box>
    </Box >
    <MainList {...params} />

  </>
}

export default function Home() {
  const routeFromUrl = getRouteFromUrl();
  const [route, setRouteInternal] = React.useState(routeFromUrl || []);

  function addToHistory(item) {
    const history = localStorageAPI().getData('history') || [];
    localStorageAPI().saveData('history', [...history, item])
  }

  const setRoute = (_route) => {
    addToHistory({
      subject: _route,
      route: [...route, _route],
      date: new Date().getTime()
    })
    setRouteInternal(prevRoute => [...prevRoute, _route]);
    setRouteInUrl([...route, _route]);
  }
  const setBackRoute = () => {
    const newArray = route.slice(0, -1)
    setRouteInternal(prevRoute => prevRoute.slice(0, -1));
    setRouteInUrl(newArray);
  }

  function onDataFetched(data) {
    const apiPrice = data?.apiPrice;
    if (apiPrice > 0) {
      console.log({ apiPrice });
      const dataFetched = localStorageAPI().getData('dataFetched') || [];
      localStorageAPI().saveData('dataFetched', [...dataFetched, { apiPrice: apiPrice, date: new Date().getTime() }]);
    }
  }






  const params = {
    route,
    setRoute,
    setBackRoute,
    onDataFetched

  }

  const Comp = route.length > 0 ? MainSubject : RandomSubjectList
  return (
    <Box
      sx={{

      }}
    >

      <Comp {...params} />




    </Box >



  );
}

function TextInputWithSend({ onSubmit, placeHolder }) {
  const [input, setInput] = React.useState('');
  useEffect(() => {
    const callback = (e) => {
      if (e.key === 'Enter') {
        onSubmit(input)
        setInput('')
      }
    }
    window.addEventListener('keydown', callback)
    return () => {
      window.removeEventListener('keydown', callback)
    }
  }, [input])
  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

    }}
  >
    <TextField

      label={placeHolder}
      variant="outlined"
      margin="normal"
      onInput={(e) => setInput(e.target.value)}
      sx={{
        width: '85%',
        mt: '1px',
      }}
    />
    <Box
      sx={{
        borderRadius: '15px',
        marginBottom: '8px',
        borderColor: !input ? 'lightgray' : 'gray',
        bgcolor: '#46ab46',
        marginRight: '16px',

      }}
    >
      <IconButton
        disabled={!input}
        onClick={() => {
          console.log({ input });
          onSubmit(input)
          setInput('')
        }}>

        <SendRounded
          sx={{
            color: 'black'
          }}
        />
      </IconButton>
    </Box>
  </Box>
}

function MainList(params) {
  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      overflow: 'auto',
      height: '100%'
    }}
  >
    <WithCollapse type='subjects' {...params} mainColor={"lightgreen"} >
      {data => <SubjectList subjects={data.subjects} {...params} />}
    </WithCollapse>
    <WithCollapse type='questions' {...params} mainColor={"lightblue"}>
      {data => < QuestionsList questions={data.questions} {...params} />}
    </WithCollapse >
    <WithCollapse type='examples' {...params} mainColor={"orange"}>
      {data => <ExamplesList examples={data.examples} {...params} />}
    </WithCollapse>

  </Box >
}

function WithCollapse({ children, type, mainColor, loadData, title, showArrow }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const _title = title || type.charAt(0).toUpperCase() + type.slice(1);

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
              console.log(response.result);
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

function Question({ mainSubject, question, mainColor, index, onQuestionClicked, setRoute, isAddedQuestion }) {
  const [answer, setAnswer] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if (isAddedQuestion) {
      onClick()
    }
  }, [isAddedQuestion])
  function onClick() {
    if (!answer) {
      setLoading(true)
      onQuestionClicked(question, (response) => {
        setAnswer(response)
        setLoading(false)
      })
    }
    setOpen(!open)
  }
  const bgcolor = colors.filter(c => c !== mainColor)[index % colors.length]
  return <Box
    sx={{ bgcolor, mb: 1, borderRadius: 1 }}
  >

    <ListItem
      key={question}
      onClick={onClick}
    >
      <ListItemText
        primary={question}
      />

    </ListItem>
    {loading ? <LinearProgress /> : ''}

    <Collapse in={open && answer}>
      <Divider />
      <Box
        onDoubleClick={() => speak(answer?.answer)}
        sx={{
          p: 1,
        }}
      >
        <TextBox text={answer?.answer} title={answer?.subject} />
      </Box>
    </Collapse>
  </Box>
}


function ExamplesList({ examples, mainColor, setRoute, onLoadMoreClicked, loadExample }) {
  const [examplesList, setExamplesList] = React.useState(examples);
  return (
    <Box>
      <List sx={{}}>
        {(examplesList || []).map((example, index) => (
          <ListItem
            key={example}
            sx={{
              bgcolor: colors.filter(c => c !== mainColor)[index],
              mb: 1,
              borderRadius: 1,
              p: 0
            }}
          >
            <WithCollapse
              type="example"
              title={example.title}
              mainColor={getColor({ mainColor, index })}
              loadData={example.text ? () => Promise.resolve({ result: example }) : loadExample}
            >

              {
                data => <>
                  <Divider sx={{
                    marginBottom: 1
                  }} />
                  <Box
                    sx={{
                      p: 1
                    }}
                  >
                    <TextBox text={data.text} title={example.title} setRoute={setRoute} />
                  </Box>


                </>
              }
            </WithCollapse>

          </ListItem>
        ))}
        <LoadMoreListItemButton
          type="examples"
          excludeItems={examplesList}
          setState={result => setExamplesList(prev => [...prev, ...result.examples])}
          onLoadMoreClicked={onLoadMoreClicked}
        />
      </List>
    </Box>
  )
}
function QuestionsList({ mainSubject, questions, mainColor, onQuestionClicked, setRoute, onLoadMoreClicked }) {

  const [questionsList, setQuestionsList] = React.useState(questions);
  const [askedQuestions, setAskedQuestions] = React.useState([]);

  const addQuestion = (question) => {
    setAskedQuestions(prevQuestions => [...prevQuestions, question])
  }
  function onQuestionAsked(question) {
    addQuestion(question)
  }

  if (!questions) {
    return null;
  }

  return (
    <Box>
      <List sx={{
        overflow: 'visible'
      }}>
        {(questionsList || []).map((question, index) => (
          <Question
            setRoute={setRoute}
            question={question}
            mainColor={mainColor}
            index={index}
            onQuestionClicked={onQuestionClicked}
            mainSubject={mainSubject}
          />
        ))}
        {(askedQuestions || []).map((question, index) => (
          <Question
            subject={mainSubject}
            setRoute={setRoute}
            question={question}
            mainColor={mainColor}
            index={index}
            onQuestionClicked={onQuestionClicked}
            isAddedQuestion={true}
          />
        ))}


        <LoadMoreListItemButton
          type="questions"
          excludeItems={questionsList}
          setState={result => setQuestionsList(prev => [...prev, ...result.questions])}
          onLoadMoreClicked={onLoadMoreClicked}
        />

      </List>

      <TextInputWithSend
        onSubmit={onQuestionAsked}
        placeHolder="Ask a question..."
      />
      <Divider />
    </Box>
  )
}

function LoadMoreListItemButton({ type, excludeItems, setState, onLoadMoreClicked }) {
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
function getColor({ mainColor, index }) {
  return colors.filter(c => c !== mainColor)[index % colors.length]
}
function SubjectList({ onSubjectClicked, mainColor, subjects, onLoadMoreClicked }) {
  const [subjectList, setSubjectList] = React.useState(subjects);

  useEffect(() => {
    setSubjectList(subjects)
  }, [subjects])




  return (
    <Box sx={{
    }}>
      <List sx={{
      }} >
        {(subjectList || []).map((subject, index) => (
          <ListItem
            key={subject}
            onClick={() => onSubjectClicked(subject, colors.filter(c => c !== mainColor)[index])}

            sx={{ bgcolor: getColor({ mainColor, index }), mb: 1, borderRadius: 1 }}>
            <ListItemText primary={subject} />
          </ListItem>
        ))}
        <LoadMoreListItemButton
          type="subjects"
          excludeItems={subjectList}
          setState={result => setSubjectList(prev => prev ? [...prev, ...result.subjects] : result.subjects)}
          onLoadMoreClicked={onLoadMoreClicked}
        />
      </List>
    </Box>
  );
}


function TextBox({ text, title, setRoute }) {
  return <Box
    sx={{
      lineHeight: "24px",
      p: 1
    }}
  >
    <Typography>
      {text}
      <div>
        Read more about <span onClick={() => setRoute(title)} style={{ color: 'blue' }}>{title}</span>
      </div>
    </Typography>
  </Box>
}