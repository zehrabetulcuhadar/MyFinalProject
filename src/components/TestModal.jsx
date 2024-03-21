import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './../firebaseConfig';
import "./../assets/styles/TestModal.css";

const TestModal = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useUserContext();
    const userId = currentUser?.uid;

    useEffect(() => {
        // Kullanıcının bugün testi çözüp çözmediğini kontrol et
        const checkIfTestTaken = async () => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
      
          const q = query(
            collection(db, "user_answers"),
            where("userId", "==", userId),
            where("date", "==", today)
          );
      
          const querySnapshot = await getDocs(q);
          return !querySnapshot.empty;
        };
      
        // Firestore'dan rastgele soruları çek
        const fetchQuestions = async () => {
          if (await checkIfTestTaken()) {
            // Kullanıcı bugün testi çözdüyse, bir şey yapma
            return;
          }
      
          // Firestore'dan tüm soruları çek
          const questionsRef = collection(db, "questions");
          const questionsSnapshot = await getDocs(questionsRef);
      
          // Tüm sorulardan rastgele 10 tanesini seç
          const allQuestions = questionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Rastgele 10 soruyu seç
          const shuffled = allQuestions.sort(() => 0.5 - Math.random());
          const selectedQuestions = shuffled.slice(0, 10);
      
          setQuestions(selectedQuestions);
        };
      
        fetchQuestions();
      }, [db, userId]);

    const handleNext = () => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    };

    const handleSubmit = async () => {
        // Kullanıcının cevaplarını Firestore'a kaydet
        const userAnswersRef = collection(db, "user_answers");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        await addDoc(userAnswersRef, {
            userId: userId,
            date: today,
            answers: answers,
        });
    
        // Kullanıcıyı kendi dashboard sayfasına yönlendir
        navigate(`/dashboard/${userId}`); // Kullanıcının ID'sini URL'ye ekleyin
    };

    const handleAnswer = (option) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = option;
        setAnswers(newAnswers);
    };

    return (
            <div className="modal-overlay">
                <div className="test-box">
                {questions.length > 0 ? (
                    <>
                    <div className="question-section">
                        <div className="question-text">
                        {questions[currentQuestionIndex].text} {/* Soru metnini burada göster */}
                        </div>
                    </div>
                    <div className="answer-section">
                        {questions[currentQuestionIndex].choices.map((choice, index) => (
                        <div key={index} className="answer-option">
                            <input
                            type="radio"
                            id={`choice-${index}`}
                            name="answer"
                            value={choice}
                            onChange={() => handleAnswer(choice)}
                            checked={answers[currentQuestionIndex] === choice}
                            />
                            <label htmlFor={`choice-${index}`}>{choice}</label>
                        </div>
                        ))}
                    </div>
                    </>
                ) : (
                    <div className="loading-text">Sorular yükleniyor...</div>
                )}
                <div className="navigation-buttons">
                    <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Geri</button>
                    <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>İleri</button>
                    {currentQuestionIndex === questions.length - 1 && (
                        <button onClick={handleSubmit}>Kaydet</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TestModal