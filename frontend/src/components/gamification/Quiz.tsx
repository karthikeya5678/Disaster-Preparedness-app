import React, { useState, useEffect } from 'react';
import styles from './Quiz.module.css';
import client from '../../api/client';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface Question {
    q: string;
    options: string[];
    answer: string;
}

interface QuizProps {
    questions: Question[];
    moduleId: string;
    lessonId: number;
}

const Quiz: React.FC<QuizProps> = ({ questions, moduleId, lessonId }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    const handleAnswerSelect = (option: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = option;
        setUserAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            calculateResults();
            setShowResults(true);
        }
    };

    const calculateResults = () => {
        let currentScore = 0;
        questions.forEach((question, index) => {
            if (question.answer === userAnswers[index]) {
                currentScore++;
            }
        });
        setScore(currentScore);
    };
    
    useEffect(() => {
        if (showResults) {
            const saveResults = async () => {
                try {
                    const token = await auth.currentUser?.getIdToken();
                    await client.post('/api/progress/quiz', {
                        moduleId,
                        lessonId,
                        score,
                        totalQuestions: questions.length
                    }, { headers: { Authorization: `Bearer ${token}` } });
                } catch (error) {
                    console.error("Failed to save quiz results", error);
                }
            };
            saveResults();
        }
    }, [showResults, score, moduleId, lessonId, questions.length]);


    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        return (
            <div className={styles.resultsScreen}>
                <h2 className={styles.resultsTitle}>Quiz Completed!</h2>
                <p className={styles.resultsText}>
                    You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
                </p>
                <div className={styles.reviewContainer}>
                    <h3 className={styles.reviewHeader}>Review Your Answers</h3>
                    {questions.map((question, index) => (
                        <div key={index} className={styles.reviewQuestion}>
                            <p><strong>{index + 1}. {question.q}</strong></p>
                            <p className={userAnswers[index] === question.answer ? styles.correct : styles.incorrect}>
                                Your Answer: {userAnswers[index]}
                            </p>
                            {userAnswers[index] !== question.answer && (
                                <p className={styles.correct}>Correct Answer: {question.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.resultsActions}>
                    <button onClick={resetQuiz} className={styles.resetButton}>Retake Quiz</button>
                    <button onClick={() => navigate('/dashboard')} className={styles.dashboardButton}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = userAnswers[currentQuestionIndex];

    return (
        <div className={styles.quizContainer}>
            <div className={styles.questionHeader}>
                <h3 className={styles.questionText}>{currentQuestion.q}</h3>
                <span className={styles.questionCounter}>
                    Question {currentQuestionIndex + 1}/{questions.length}
                </span>
            </div>
            <div className={styles.optionsGrid}>
                {currentQuestion.options.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        className={`${styles.optionButton} ${selectedAnswer === option ? styles.selected : ''}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <button 
                onClick={handleNextQuestion} 
                className={styles.nextButton}
                disabled={!selectedAnswer}
            >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </button>
        </div>
    );
};

export default Quiz;