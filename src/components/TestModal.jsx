import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { collection, query, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './../firebaseConfig';
import "./../assets/styles/TestModal.css";
import { motion } from 'framer-motion';
import "react-step-progress-bar/styles.css";
import CopyrightBar from '../components/CopyrightBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import { ProgressBar, Step } from "react-step-progress-bar";

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
}

function determineMood(score) {
    if (score >= 8 && score <= 10) return { color: '#FFFF00', emotion: 'Mutluluk' };
    if (score >= 5 && score <= 7) return { color: '#ADD8E6', emotion: 'Sakinlik' };
    if (score >= 3 && score <= 4) return { color: '#FFA500', emotion: 'Enerji' };
    if (score >= 1 && score <= 2) return { color: '#800080', emotion: 'Güven' };
    if (score >= -1 && score < 0) return { color: '#000000', emotion: 'Korku' };
    if (score >= -3 && score <= -2) return { color: '#FFC0CB', emotion: 'Aşk' };
    if (score >= -5 && score <= -4) return { color: '#0000FF', emotion: 'Hüzün' };
    if (score >= -8 && score <= -7) return { color: '#FF0000', emotion: 'Öfke' };
    return { color: '#FFFFFF', emotion: 'Nötr' };
}

const ScoreModal = ({ show, onHide, score, color, emotion }) => {
    const indicatorPosition = (score / 20) * 100 + 50; // -10 ile 10 arasında bir skor için hesaplama

    const playlists = {
        'Korku': "https://open.spotify.com/embed/playlist/7r7FQxGN7un3piDkMtsmDD?utm_source=generator&theme=0",
        'Aşk': "https://open.spotify.com/embed/playlist/1RTJNabNxoT9VoqOxXG997?utm_source=generator&theme=0",
        'Güven': "https://open.spotify.com/embed/playlist/2DX2ttpmJKDQnMUaYJbmks?utm_source=generator&theme=0",
        'Enerji': "https://open.spotify.com/embed/playlist/2gUDTAXLQA49gw5sn9JwUs?utm_source=generator&theme=0",
        'Sakinlik': "https://open.spotify.com/embed/playlist/4G4PemyNo5sW0tbuGLIBbs?utm_source=generator&theme=0",
        'Hüzün': "https://open.spotify.com/embed/playlist/5bwegxPSjauU1jCjYVDmpE?utm_source=generator&theme=0",
        'Öfke': "https://open.spotify.com/embed/playlist/3tiYjyOK73N6wRLJL6XsUv?utm_source=generator&theme=0",
        'Mutluluk': "https://open.spotify.com/embed/playlist/6rz5LAp6L40OXbF0yxb4kK?utm_source=generator&theme=0",
        'Nötr': "https://open.spotify.com/embed/playlist/3R4uFfJcQl7qxFxlqWT61I?utm_source=generator"
    };

    const playlistUrl = playlists[emotion] || playlists['Nötr'];

    return (
        <Modal show={show} onHide={onHide} className="score-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title>Test Sonucunuz</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="score-line-container">
                    <div className="score-line">
                        <div className="score-indicator" style={{ left: `${indicatorPosition}%` }} />
                    </div>
                    <div className="score-labels">
                        <span className="score-label">-10</span>
                        <span className="score-label">10</span>
                    </div>
                </div>
                <div className="score-info">
                    <p className="score-value">Puanınız: {score}</p>
                    <p className="emotion-label">Duygu Renginiz:</p>
                    <div className="emotion-color-indicator" style={{ backgroundColor: color }} />
                    <p className="emotion-text" style={{ color: color }}>{emotion}</p>
                </div>
                <iframe src={playlistUrl} className="spotify-iframe" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Kapat</Button>
            </Modal.Footer>
        </Modal>
    );
};

const TestModal = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useUserContext();
    const userId = currentUser?.uid;
    const [userScore, setUserScore] = useState(0);
    const [userColor, setUserColor] = useState('#FFFFFF');
    const [userEmotion, setUserEmotion] = useState('Nötr'); 
    const [showModal, setShowModal] = useState(false); 
    const answeredCount = answers.filter(answer => answer !== undefined).length;  

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const fetchQuestions = async () => {
            const questionsRef = collection(db, "questions");
            const snapshot = await getDocs(questionsRef);
            const fetchedQuestions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const selectedQuestions = fetchedQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
            setQuestions(selectedQuestions);
        };

        fetchQuestions();
    }, [userId, navigate]);

    const handleAnswer = (choiceIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = choiceIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (answers.length < questions.length || answers.includes(undefined)) {
            toast.error('Lütfen tüm soruları cevaplayın.');
            return;
        }

        const formattedAnswers = answers.map((answerIndex, i) => ({
            questionId: questions[i].id,
            answerIndex,
            coefficient: questions[i].choiceCoefficient[answerIndex] 
        }));

        const totalScore = formattedAnswers.reduce((acc, answer) => acc + answer.coefficient, 0);
        const moodData = determineMood(totalScore);

        setUserScore(totalScore);
        setUserColor(moodData.color);
        setUserEmotion(moodData.emotion);
    
        const today = formatDate(new Date());
        const dateDocRef = doc(db, `users/${userId}/dates/${today}`);
        const resultsColRef = collection(dateDocRef, "results");

        try {
            await setDoc(dateDocRef, {
              date: today
            });

            await addDoc(resultsColRef, {
                score: totalScore,
                emotion: moodData.emotion,
                color: moodData.color
            });

            const answersColRef = collection(dateDocRef, "answers");
            await Promise.all(formattedAnswers.map(answer => addDoc(answersColRef, answer)));
            console.log("Answers added to Firestore.");

            toast.success('Test sonuçları kaydedildi!', {
                onClose: () => {
                    setShowModal(true);
                }
            });
        } catch (error) {
            toast.error('Test kaydedilirken bir hata oluştu.');
            console.error("Cevaplar kaydedilirken bir hata oluştu: ", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate(`/dashboard/${userId}`); 
    };

    return (
        <div className="modal-overlay">
            <div className='content-container'>
                <div className="progress-container">
                    <ProgressBar
                        percent={answeredCount / questions.length * 100}
                        filledBackground="linear-gradient(270deg, #edb17a, #f7c672, #fbe687)"
                        unfilledBackground="rgba(178,126,142,0.5)"
                        width="100%"
                    >
                        {questions.map((_, index) => (
                            <Step key={index} transition="scale">
                                {({ accomplished }) => (
                                    <div
                                        className={`indexedStep ${answers[index] !== undefined ? "completed" : ""}`}
                                        onClick={() => {
                                            if (answers[index] !== undefined) {
                                                setCurrentQuestionIndex(index);
                                            }
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                )}
                            </Step>
                        ))}
                    </ProgressBar>
                </div>
                <div className="test-box">
                    {questions.length > 0 ? (
                        <>
                            <div className="question-section">
                                <div className="question-text">
                                    {questions[currentQuestionIndex].text}
                                </div>
                            </div>
                            <div className="answer-section">
                                {questions[currentQuestionIndex].choices.map((choice, index) => (
                                    <motion.button 
                                        key={index}
                                        className={`answer-button ${answers[currentQuestionIndex] === index ? 'selected' : ''}`}
                                        onClick={() => handleAnswer(index)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {choice}
                                    </motion.button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="loading-text">Sorular yükleniyor...</div>
                    )}
                </div>
                <div className="navigation-buttons">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="navigation-button previous-button"
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                    >
                        Geri
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="navigation-button next-button"
                        onClick={() => {
                            if (currentQuestionIndex < questions.length - 1 && answers[currentQuestionIndex] !== undefined) {
                                setCurrentQuestionIndex(currentQuestionIndex + 1);
                            }
                        }}
                        disabled={currentQuestionIndex === questions.length - 1 || answers[currentQuestionIndex] === undefined}
                    >
                        İleri
                    </motion.button>
                </div>
                <div className='save-button-container'>
                    {currentQuestionIndex === questions.length - 1 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="navigation-button save-button"
                            onClick={handleSubmit}
                        >
                            Testi Bitir
                        </motion.button>
                    )}
                </div>
            </div>
            <CopyrightBar />
            <ScoreModal show={showModal} onHide={handleCloseModal} score={userScore} color={userColor} emotion={userEmotion} />
            <ToastContainer />
        </div>
    );
};

export default TestModal;