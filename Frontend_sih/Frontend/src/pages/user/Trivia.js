import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CoinAnimation from '../../components/CoinAnimation';
import './Trivia.css';
import { useLocale } from '../../contexts/LocaleContext';

const questionPool = [
  { question: "Which monastery is known as the 'Hermit's Cell' and is considered the oldest in Sikkim?", options: ["Rumtek", "Dubdi", "Tashiding", "Enchey"], answer: "Dubdi", explanation: "Dubdi Monastery, established in 1701, is considered the oldest in Sikkim. Its name translates to 'the Hermit's Cell'." },
  { question: "The towering 135-foot statue at Samdruptse Hill depicts which important figure?", options: ["Gautama Buddha", "The 14th Dalai Lama", "Guru Padmasambhava", "Milarepa"], answer: "Guru Padmasambhava", explanation: "The statue at Samdruptse Hill is of Guru Padmasambhava (Guru Rinpoche), the patron saint of Sikkim." },
  { question: "The Bhumchu festival, involving a sacred pot of water, is primarily held at which monastery?", options: ["Pemayangtse", "Ralang", "Tashiding", "Phodong"], answer: "Tashiding", explanation: "The Bhumchu festival is a unique and sacred event held at Tashiding Monastery to predict the fortunes of the coming year." },
  { question: "What does the name 'Pemayangtse' mean in the Tibetan language?", options: ["Perfect Sublime Lotus", "Hill of the Lamas", "Sacred Place", "Eastern Gate"], answer: "Perfect Sublime Lotus", explanation: "'Pemayangtse' translates to 'Perfect Sublime Lotus', reflecting its serene and sacred nature." },
  { question: "The vibrant 'Chaam' or mask dance is a famous ritual performed during which festival?", options: ["Saga Dawa", "Losar", "Diwali", "Dasain"], answer: "Losar", explanation: "The Chaam (mask dance) is a significant part of the Losar (Tibetan New Year) festival, depicting the triumph of good over evil." },
  { question: "Which monastery is the main seat of the Karma Kagyu lineage, replicating the original in Tibet?", options: ["Enchey", "Kartok", "Phodong", "Rumtek"], answer: "Rumtek", explanation: "Rumtek Monastery is the largest in Sikkim and serves as the main seat of the Karma Kagyu lineage outside of Tibet." },
  { question: "The 'Pang Lhabsol' festival is unique to Sikkim and venerates what as a guardian deity?", options: ["The Teesta River", "Mount Kanchenjunga", "Yeti", "The Red Panda"], answer: "Mount Kanchenjunga", explanation: "Pang Lhabsol is a festival that worships Mount Kanchenjunga as the guardian deity of Sikkim." },
  { question: "What is the name of the seven-tiered wooden sculpture inside Pemayangtse Monastery?", options: ["Mandala of Heaven", "The Golden Stupa", "Zangdok Palri", "The Dharma Wheel"], answer: "Zangdok Palri", explanation: "The Zangdok Palri is an extraordinary wooden masterpiece inside Pemayangtse, depicting the heavenly abode of Guru Rinpoche." },
  { question: "Yuksom, the first capital of Sikkim, is the base for treks towards which famous mountain?", options: ["Mount Everest", "Nanda Devi", "Annapurna", "Mount Kanchenjunga"], answer: "Mount Kanchenjunga", explanation: "Yuksom serves as the starting point for the popular trek to the base camp of Mount Kanchenjunga, the third highest mountain in the world." },
  { question: "The mural of the 'Four Harmonious Friends' is a famous Buddhist fable often depicted in monasteries. What does it represent?", options: ["The four seasons", "Respect and cooperation", "The four noble truths", "The four elements"], answer: "Respect and cooperation", explanation: "The fable of the Four Harmonious Friends (an elephant, a monkey, a rabbit, and a bird) is a symbol of harmony, cooperation, and respect for seniority." },
  { question: "Which monastery's name translates to 'the solitary temple'?", options: ["Tashiding", "Dubdi", "Lingdum", "Enchey"], answer: "Enchey", explanation: "Enchey Monastery, located in Gangtok, means 'the solitary temple,' and was blessed by the tantric master Lama Druptob Karpo." },
  { question: "Saga Dawa is a major Buddhist festival celebrating what three events in Buddha's life?", options: ["His first sermon, his first disciple, his first miracle", "His birth, enlightenment, and passing (nirvana)", "His journey, his teachings, and his relics", "His mother, his wife, and his son"], answer: "His birth, enlightenment, and passing (nirvana)", explanation: "Saga Dawa is the most sacred Buddhist festival, commemorating the three most important events of Buddha's life: his birth, enlightenment, and mahaparinirvana." },
  { question: "Which monastery is a relatively modern architectural marvel, known for its vast courtyard and as a training center for young monks?", options: ["Rumtek", "Lingdum (Ranka)", "Pemayangtse", "Ralang"], answer: "Lingdum (Ranka)", explanation: "Lingdum (Ranka) Monastery is a newer construction but is vast and architecturally impressive, serving as a prominent seat of the Zurmang Kagyu lineage." },
  { question: "A 'Thangka' is a central part of Tibetan Buddhist art found in all monasteries. What is it?", options: ["A type of prayer bell", "A ritual dagger", "A scroll painting on cotton or silk", "A form of incense"], answer: "A scroll painting on cotton or silk", explanation: "A Thangka is a traditional Tibetan Buddhist painting on a cotton or silk appliqué, often depicting deities, mandalas, or spiritual scenes." },
  { question: "The Nathu La Pass, a historic part of the Silk Route, connects Sikkim with which country?", options: ["Nepal", "Bhutan", "China (Tibet)", "Myanmar"], answer: "China (Tibet)", explanation: "The Nathu La Pass is a mountain pass in the Himalayas that connects the Indian state of Sikkim with China's Tibet Autonomous Region." },
  { question: "What is a 'stupa' or 'chorten' in the context of a monastery?", options: ["A residential quarter for monks", "A main prayer hall", "A mound-like structure containing Buddhist relics", "A type of prayer flag"], answer: "A mound-like structure containing Buddhist relics", explanation: "A stupa (or chorten in Tibetan) is a dome-shaped structure that contains sacred relics and serves as a place of meditation and veneration." },
  { question: "Which monastery is located in the high-altitude Gnathang Valley?", options: ["Rumtek", "Gnathang Valley Monastery", "Samdruptse", "Enchey"], answer: "Gnathang Valley Monastery", explanation: "The Gnathang Valley Monastery is a humble but spiritually significant gompa located at over 13,000 feet in the remote Gnathang Valley." },
  { question: "The 'vajra' and 'bell' are common ritual objects in Tibetan Buddhism. What do they represent?", options: ["Good and evil", "Sun and moon", "Compassion and wisdom", "Earth and sky"], answer: "Compassion and wisdom", explanation: "In Vajrayana Buddhism, the vajra (dorje) represents compassion and method, while the bell (ghanta) represents wisdom and emptiness. Their union signifies enlightenment." },
  { question: "What is the name of the traditional Sikkimese folk dance, often performed during festivals?", options: ["Bhangra", "Garba", "Maruni", "Kathak"], answer: "Maruni", explanation: "Maruni is a traditional and one of the oldest folk dances of the Nepalese community in Sikkim, usually performed during festivals like Tihar." },
  { question: "The first Chogyal (king) of Sikkim was consecrated at which historic location?", options: ["Gangtok", "Pelling", "Namchi", "Yuksom"], answer: "Yuksom", explanation: "Yuksom was the first capital of Sikkim, and it was here that the first Chogyal, Phuntsog Namgyal, was consecrated in 1642." }
];
const getQuizQuestions = () => {
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
};

// Helper function to get today's date as a string (e.g., "2025-09-23")
const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

const Trivia = () => {
  const [quizState, setQuizState] = useState('loading'); // loading, start, playing, finished, completed_today
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  
  const { addCoins } = useAuth();
  const { t } = useLocale();

  useEffect(() => {
    const lastCompletionDate = localStorage.getItem('lastQuizCompletionDate');
    const today = getTodayDateString();

    if (lastCompletionDate === today) {
        setQuizState('completed_today');
    } else {
        const savedStreak = parseInt(localStorage.getItem('dailyStreak') || '0');
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        // If the last completion was not yesterday, reset the streak
        if (lastCompletionDate && lastCompletionDate !== yesterdayString) {
            setDailyStreak(0);
            localStorage.setItem('dailyStreak', '0');
        } else {
            setDailyStreak(savedStreak);
        }
        setQuizState('start');
    }
  }, []);


  const handleStartQuiz = () => {
    setQuestions(getQuizQuestions());
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowAnimation(false);
    setQuizState('playing');
  };

  const handleAnswerSelect = (option) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);
    setShowExplanation(true);
    if (option === questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 10);
    }
  };

  const handleFinishQuiz = () => {
      addCoins(score);
      
      const newStreak = dailyStreak + 1;
      setDailyStreak(newStreak);
      
      // Save progress to localStorage
      localStorage.setItem('dailyStreak', newStreak.toString());
      localStorage.setItem('lastQuizCompletionDate', getTodayDateString());

      setQuizState('finished');
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleFinishQuiz();
    }
  };

  useEffect(() => {
    if (quizState === 'finished') {
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [quizState]);

  if (quizState === 'loading') {
      return <div className="trivia-container">Loading...</div>
  }
  
  if (quizState === 'completed_today') {
    return (
        <div className="trivia-container trivia-start-screen">
            <h2>{t('trivia.alreadyCompleted')}</h2>
            <p>{t('trivia.comeTomorrow')}</p>
            <div className="daily-streak">
                {t('trivia.yourStreak')} 🔥 {localStorage.getItem('dailyStreak') || '0'}
            </div>
        </div>
    );
  }

  if (quizState === 'start') {
    return (
        <div className="trivia-container trivia-start-screen">
            <h2>{t('trivia.startTitle')}</h2>
            <p>{t('trivia.startDesc')}</p>
            <div className="daily-streak">
                {t('trivia.yourStreak')} 🔥 {dailyStreak}
            </div>
            <button onClick={handleStartQuiz} className="start-quiz-btn">{t('trivia.startButton')}</button>
        </div>
    );
  }

  if (quizState === 'finished') {
      return (
        <>
            {showAnimation && <CoinAnimation />}
            <div className="trivia-container trivia-results">
                <h2>{t('trivia.completeTitle')}</h2>
                <p className="score-earned">{t('trivia.earned')} {score} {t('trivia.coins')}</p>
                <p>{t('trivia.streakNow')} {dailyStreak}! {t('trivia.continueTomorrow')}</p>
            </div>
        </>
      );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="trivia-container">
      <h2>{t('trivia.quizTitle')}</h2>
      <div className="trivia-question">
        <p>{currentQuestionIndex + 1}/{questions.length}: {currentQuestion.question}</p>
      </div>
      <div className="trivia-options">
        {currentQuestion.options.map(option => {
          let className = "option-btn";
          if (selectedAnswer) {
            if (option === currentQuestion.answer) {
              className += " correct";
            } else if (option === selectedAnswer) {
              className += " incorrect";
            }
          }
          return (
            <button key={option} onClick={() => handleAnswerSelect(option)} className={className} disabled={!!selectedAnswer}>
              {option}
            </button>
          );
        })}
      </div>
      
      {showExplanation && (
          <div className="explanation-box">
              <p><strong>{t('trivia.explanation')}</strong> {currentQuestion.explanation}</p>
              <button onClick={handleNextQuestion} className="next-btn">
                {currentQuestionIndex < questions.length - 1 ? t('trivia.next') : t('trivia.finish')}
              </button>
          </div>
      )}
    </div>
  );
};

export default Trivia;