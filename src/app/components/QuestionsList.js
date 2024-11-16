import React from 'react';
import { useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider, Button } from '@mui/material'; // Added Button
import { getColor } from './utils';
import { Question } from './Question'; // Added Question import
import { LoadMoreListItemButton } from './LoadMoreListItemButton'; // Added LoadMoreListItemButton import
import { TextInputWithSend } from './TextInputWithSend'; // Added TextInputWithSend import

export function QuestionsList({ mainSubject, questions, mainColor, onQuestionClicked, setRoute, onLoadMoreClicked }) {

    // console.log({ mainSubject, questions });



    const [questionsList, setQuestionsList] = React.useState(questions);
    const [askedQuestions, setAskedQuestions] = React.useState([]);

    useEffect(() => {
        setQuestionsList(questions)
        setAskedQuestions([])
    }, [mainSubject])

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