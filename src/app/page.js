'use client'
import React, { useEffect } from 'react';
import { useFetch } from "./useFetch";
import { Box, Collapse, Divider, IconButton, LinearProgress, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { ArrowBack, ArrowDropDown, ArrowDropUp, ArrowUpward, Send, SendRounded } from '@mui/icons-material';

const staticSubjects = [
  "Astrobiology",
  "Quantum Computing",
  "Cognitive Behavioral Therapy",
  "Renewable Energy Technologies",
  "Cultural Anthropology"
]
const colors = [
  "#fec8c8",  // Light Gray
  "#f5f59a",  // Ivory
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

export default function Home() {
  const [route, setRouteInternal] = React.useState([]);
  const [mainColor, setColor] = React.useState('');
  const [mainInput, setMainInput] = React.useState('');

  console.log({ route });
  const setRoute = (route) => {
    setRouteInternal(prevRoute => [...prevRoute, route]);
  }
  const setBackRoute = () => {
    setRouteInternal(prevRoute => prevRoute.slice(0, -1));
  }


  const { data, loading } = useFetch('/api/subjects', { query: { route }, shouldUsecache: true });
  const { result, apiPrice } = data || {};
  const { subjects, description, questions } = result || {}
  const shouldShowHeader = route.length > 0;
  const singleSubject = route.length !== 0;

  const mainSubject = route[route.length - 1];

  console.log({ subjects, description, questions });
  // const subjects = staticSubjects
  // console.log({ subjects, apiPrice });

  function onSubjectClicked(subjectName, selectedColor) {
    setRoute(subjectName);
    setColor(selectedColor)

  }

  async function onQuestionClicked(question, setAnswer) {
    console.log({ question });
    const response = await fetch('/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, mainSubject })
    }).then(res => res.json())
    console.log({ response });

    setAnswer(response.result)


  }

  const params = {
    mainSubject,
    subjects,
    description,
    questions,
    mainColor,
    route,
    setBackRoute,
    onSubjectClicked,
    onQuestionClicked,
    setRoute
  }
  return (
    <Box
      sx={{
        height: '100vh',
        p: 1,


      }}
    >

      {shouldShowHeader ? <Box
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
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            visibility: loading ? 'hidden' : 'visible',
          }}
        >
          <Typography variant="h10" sx={{
            fontFamily: 'arial',

          }}>
            {description}
          </Typography>
        </Box>
      </Box > : <TextInputWithSend
        onSubmit={(subject) => onSubjectClicked(subject, colors[0])}
        placeHolder="Enter a subject..."
      />
      }






      {loading ? <LinearProgress /> : ''}
      {!loading && singleSubject ? <MainList {...params} /> : ''}
      {!loading && !singleSubject ? <SubjectList {...params} /> : ''}

    </Box >



  );
}

function TextInputWithSend({ onSubmit, placeHolder }) {
  const [input, setInput] = React.useState('');
  useEffect(() => {
    const callback = (e) => {
      if (e.key === 'Enter') {
        console.log({ input });
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
        width: '90%'
      }}
    />
    <Box
      sx={{
        borderRadius: '15px',
        marginTop: '6px',
        borderColor: !input ? 'lightgray' : 'gray',
        bgcolor: '#46ab46'

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
  return <Box>
    <WithCollapse title="Questions" mainColor={"lightblue"}>
      <QuestionsList {...params} />
    </WithCollapse>
    <WithCollapse title="Subjects" mainColor={"lightgreen"}>
      <SubjectList {...params} />
    </WithCollapse>
  </Box >
}

function WithCollapse({ children, title, mainColor }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Box
      sx={{
        bgcolor: 'white',
        p: 1,
        borderRadius: 1,
        mb: 1,
        border: '1px solid lightgray',
      }}
    >
      <Box
        onClick={() => setOpen(!open)}
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
          {title}
        </Typography>
        {
          open ? <ArrowDropUp /> : <ArrowDropDown />
        }
      </Box>
      <Collapse in={open}>
        <Box
          sx={{
            bgcolor: 'white',
          }}
        >
          {children}
        </Box>

      </Collapse>
    </Box>
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
  return <Box
    sx={{ bgcolor: colors.filter(c => c !== mainColor)[index], mb: 1, borderRadius: 1 }}
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
          p: 2,
        }}
      >
        {answer?.answer}


        <Box
          sx={{
            marginTop: 1,
          }}

        >
          Read more about <span
            onClick={() => setRoute(answer?.subject)}
            style={{ color: 'blue' }}>{answer?.subject}</span>
        </Box>
      </Box>
    </Collapse>
  </Box>
}

function AskQuestion({ onQuestionAsked }) {
  const [input, setInput] = React.useState('');
  useEffect(() => {
    const callback = (e) => {
      if (e.key === 'Enter') {
        onQuestionAsked(input)
      }
    }
    window.addEventListener('keydown', callback)
    return () => {
      window.removeEventListener('keydown', callback)
    }
  }, [input])
  return (
    <Box
      sx={{
        // bgcolor: mainColor,
        borderRadius: 1,
        mb: 1,
      }}
    >
      <TextField
        fullWidth
        label="Ask a question..."
        variant="outlined"
        margin="none"
        sx={{
          padding: 0
        }}
        onSubmit={(e) => console.log(e)}
        onInput={(e) => setInput(e.target.value)}
      />
    </Box>
  )
}

function QuestionsList({ mainSubject, questions, mainColor, onQuestionClicked, setRoute }) {

  const [askedQuestions, setAskedQuestions] = React.useState([]);
  console.log({ askedQuestions });
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
      <List sx={{}}>
        {(questions || []).map((question, index) => (
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
            subject={subject}
            setRoute={setRoute}
            question={question}
            mainColor={mainColor}
            index={index}
            onQuestionClicked={onQuestionClicked}
            isAddedQuestion={true}
          />
        ))}
        <TextInputWithSend
          onSubmit={onQuestionAsked}
          placeHolder="Ask a question..."
        />
      </List>
    </Box>
  )
}

function SubjectList({ subjects, onSubjectClicked, mainColor }) {

  return (
    <Box sx={{
    }}>
      <List sx={{
      }} >
        {(subjects || []).map((subject, index) => (
          <ListItem
            key={subject}
            onClick={() => onSubjectClicked(subject, colors.filter(c => c !== mainColor)[index])}

            sx={{ bgcolor: colors.filter(c => c !== mainColor)[index], mb: 1, borderRadius: 1 }}>
            <ListItemText primary={subject} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

