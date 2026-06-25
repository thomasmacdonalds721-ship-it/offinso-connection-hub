/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Phone
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INITIAL_CLASS_OFFERINGS } from '../data';
import WorkplaceSafetyCourse from './WorkplaceSafetyCourse';

interface Course {
  id: string;
  title: string;
  twiTitle: string;
  description: string;
  duration: string;
  schedule: string;
  age: string;
}

interface SyllabusLesson {
  title: string;
  twiTitle: string;
  content: string;
  points: string[];
}

// Course-specific lessons
const SYLLABUS_DATA: Record<string, SyllabusLesson[]> = {
  basic_reading: [
    {
      title: 'Phonetics & Twi Alphabet',
      twiTitle: 'Kyerɛwfoɔ ne Nkyekyɛmu',
      content: 'Learn the primary phonetic elements of the Ashanti Twi language. This lesson covers vowels like "ɛ" and "ɔ", which differ from typical English sounds.',
      points: [
        'Pronounce the "ɛ" vowel sound as in "met" or "egg".',
        'Pronounce the "ɔ" vowel sound as in "law" or "ought".',
        'Practice vowels combining with standard consonants to form basic syllables like "ba", "ka", "sa".'
      ]
    },
    {
      title: 'Traditional Conversational Greetings',
      twiTitle: 'Akanfoɔ Nkyea',
      content: 'Greetings form the bedrock of social respect in the Offinso Municipality. Learn context-specific time-of-day greetings.',
      points: [
        '"Maakye" - Good morning (Sunrise until noon). Sent to family and seniors.',
        '"Maaha" - Good afternoon (Noon until dusk). Sent to laborers in fields.',
        '"Anwummere" - Good evening (Dusk onwards). Used around fires and town centers.'
      ]
    },
    {
      title: 'Foundational Numeracy & Math',
      twiTitle: 'Atontaabuo fapem',
      content: 'Core counting skills required for agricultural market negotiations, cocoa bag weighing, and ledger updates.',
      points: [
        'Baako (1), Mmienu (2), Mmiɛnsa (3), Nan (4), Num (5).',
        'Nson (7) and Nson (7) make Dunan (14).',
        'Learn how to translate counting structures for financial calculations in Cedis.'
      ]
    }
  ]
};

// Course-specific mini-quizzes
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  basic_reading: [
    {
      question: 'Which vowel is pronounced like "o" in the word "law"?',
      options: ['ɛ', 'ɔ', 'a', 'i'],
      correctIndex: 1,
      explanation: 'The Twi character "ɔ" represents the open-mid back rounded vowel sound, similar to "o" in law or cod.'
    },
    {
      question: 'What is the correct greeting for a senior neighbor in the morning hours?',
      options: ['Maaha', 'Anwummere', 'Maakye', 'Akwaaba'],
      correctIndex: 2,
      explanation: '"Maakye" is the morning greeting in Asante Twi (sunrise to noon).'
    },
    {
      question: 'What is the Twi word for the number five (5)?',
      options: ['Baako', 'Mmienu', 'Num', 'Nan'],
      correctIndex: 2,
      explanation: '"Num" means five. "Baako" is one, "Mmienu" is two, and "Nan" is four.'
    }
  ]
};

export default function LiteracySection() {
  const { t, language } = useLanguage();

  // Active view: 'list' (all courses) or 'classroom' (focused on a registered/selected course)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // Registration and study flow states
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [isRegistered, setIsRegistered] = useState<Record<string, boolean>>({});
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isQAnswered, setIsQAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Certificate State
  const [certGenerated, setCertGenerated] = useState(false);

  const courses: Course[] = INITIAL_CLASS_OFFERINGS;
  const activeCourse = courses.find(c => c.id === selectedCourseId);
  const activeLessons = selectedCourseId ? SYLLABUS_DATA[selectedCourseId] : [];
  const activeQuiz = selectedCourseId ? QUIZ_DATA[selectedCourseId] : [];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;
    if (selectedCourseId) {
      setIsRegistered(prev => ({ ...prev, [selectedCourseId]: true }));
      setActiveLessonIndex(0);
      setQuizStarted(false);
      setQuizFinished(false);
      setCertGenerated(false);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < activeLessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
    } else {
      // Start Quiz!
      setQuizStarted(true);
      setCurrentQIndex(0);
      setSelectedAnswer(null);
      setIsQAnswered(false);
      setQuizScore(0);
      setQuizFinished(false);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(prev => prev - 1);
    }
  };

  const handleSelectAnswer = (idx: number) => {
    if (isQAnswered) return;
    setSelectedAnswer(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || isQAnswered) return;
    setIsQAnswered(true);
    if (selectedAnswer === activeQuiz[currentQIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsQAnswered(false);
    if (currentQIndex < activeQuiz.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartStudy = () => {
    setActiveLessonIndex(0);
    setQuizStarted(false);
    setQuizFinished(false);
    setCertGenerated(false);
  };

  return (
    <div id="offinso-courses-learning-hub" className="space-y-8 py-4">
      
      {/* Top Header Banner */}
      <div className="border-b border-zinc-200 pb-5">
        <span className="text-xs text-offinso-gold font-bold uppercase tracking-widest font-mono">
          {language === 'tw' ? 'MUNICIPAL ADADESUA NKABOM' : 'MUNICIPAL ACADEMY & TRAINING'}
        </span>
        <h2 className="font-serif text-3xl font-bold text-offinso-green-900 mt-1">
          {language === 'tw' ? 'Offinso Mpɔtam Nkyerɛkyerɛ Hub' : 'Offinso Academy & Courses Hub'}
        </h2>
        <p className="text-zinc-550 text-xs mt-1.5 max-w-4xl leading-relaxed">
          {language === 'tw' 
            ? 'Ma wo mfididwuma ne weba suahu mfa nkɔanim. Kyerɛw wo din gu nnwuma nkyerɛkyerɛ mu, sua nnɔbae ne ayaresa kwan pa, twa nkyerɛkyerɛ nsɔhwɛ mfeɛ na nya Krataa foforɔ.'
            : 'Step up your professional development and local skill sets. Register for educational campaigns, complete training modules, practice real-time interactive challenges, and claim your municipal certificate of completion.'
          }
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: All Available Courses */}
        {!selectedCourseId ? (
          <motion.div
            key="course-list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 font-sans"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-zinc-900 flex items-center gap-2">
                <BookOpen className="w-5.5 h-5.5 text-offinso-green-800" />
                {language === 'tw' ? 'Nkyerɛkyerɛ a Ɛwɔ Hɔ' : 'Available Academic Courses'}
              </h3>
              <span className="text-xs text-zinc-500 font-mono">
                {courses.length} {language === 'tw' ? 'Nkyerɛkyerɛ adwuma' : 'Program(s) open for admissions'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => {
                const isUserEnrolled = isRegistered[course.id];
                return (
                  <div 
                    key={course.id}
                    className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    {/* Header bar */}
                    <div className="p-6 flex-1 space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] bg-offinso-green-50 text-offinso-green-850 px-2.5 py-0.5 rounded-full font-bold font-mono uppercase inline-block">
                          {course.duration} {language === 'tw' ? 'Dapɛn' : 'Course'}
                        </span>
                        
                        <h4 className="font-serif font-bold text-zinc-900 text-lg sm:text-xl leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-zinc-400 font-medium text-xs font-serif italic">
                          Twi: {course.twiTitle}
                        </p>
                      </div>

                      <p className="text-zinc-600 text-xs leading-relaxed">
                        {course.description}
                      </p>

                      {/* Details specs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-100 text-xs text-zinc-650">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-offinso-gold shrink-0" />
                          <span className="truncate">{course.schedule}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-offinso-gold shrink-0" />
                          <span className="truncate">{course.age}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom active action */}
                    <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        {isUserEnrolled ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">{language === 'tw' ? 'Woama din' : 'Active Student'}</span>
                          </>
                        ) : (
                          <span className="font-mono text-[10px] text-zinc-400">VERIFIED MUNICIPAL CLASS</span>
                        )}
                      </span>

                      <button
                        onClick={() => {
                          setSelectedCourseId(course.id);
                        }}
                        className={`font-bold text-xs px-4 py-2 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                          isUserEnrolled 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-offinso-green-800 hover:bg-offinso-green-900 text-white'
                        }`}
                      >
                        {isUserEnrolled 
                          ? (language === 'tw' ? 'Wura Classroom' : 'Go to Classroom') 
                          : (language === 'tw' ? 'Sua Nnwuma' : 'Enroll & Study')
                        }
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Assistance notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-xs text-amber-850 mt-4">
              <Phone className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">
                  {language === 'tw' ? 'Wo hia mmoa wɔ nkyerɛkyerɛ din hyɛ mu anaa afasɔ mu?' : 'Do you need assistance with admissions or online training?'}
                </p>
                <p className="mt-0.5">
                  {language === 'tw' 
                    ? 'Sɛ wo hia mmoa wɔ afasɔ mu a, wobɛtumi abɔ fon nɔma, a ɛne 0249560120 mmerɛ biara.' 
                    : 'If you need help applying, we can contact their phone number, which is 0249560120.'
                  }
                </p>
              </div>
            </div>

          </motion.div>
        ) : (
          /* VIEW 2: Classroom Interface for Selected Course */
          <motion.div
            key="classroom-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 font-sans"
          >
            {/* Back to courses navigation */}
            <button
              onClick={() => setSelectedCourseId(null)}
              className="text-xs font-semibold text-offinso-green-900 hover:text-offinso-green-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'tw' ? 'Kɔ Nkyerɛkyerɛ List mu' : 'Back to Available Courses'}
            </button>

            {/* Course Title Board */}
            <div className="bg-zinc-900 text-white p-6 sm:p-8 rounded-xl border border-zinc-800 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-1/4">
                <GraduationCap className="w-64 h-64" />
              </div>

              <span className="text-[10px] text-offinso-gold font-bold uppercase tracking-widest font-mono">
                {activeCourse?.duration} OFFICIAL PROGRAM
              </span>
              
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#efbf12] leading-tight mt-1">
                {activeCourse?.title}
              </h3>
              <p className="text-zinc-400 font-medium text-sm italic font-serif mt-0.5">
                Twi: {activeCourse?.twiTitle}
              </p>

              <p className="text-xs text-zinc-350 max-w-2xl mt-3 leading-relaxed">
                {activeCourse?.description}
              </p>
            </div>

            {/* Core Interactive Frame */}
            {!isRegistered[selectedCourseId] ? (
              /* Sub-Flow A: Registration Form (if not enrolled yet) */
              <div className="max-w-xl mx-auto bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-offinso-green-50 flex items-center justify-center mx-auto text-offinso-green-800 mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-zinc-900">
                    {language === 'tw' ? 'Kyerɛw din ma saa adadesua' : 'Student Registry & Enrollment'}
                  </h4>
                  <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                    {language === 'tw'
                      ? 'Gu wo din ne fon nɔma nea ɛbɛyɛ a yɛbɛtumi ayɛ wo Krataa mmerɛ ko a wowie nkyerɛkyerɛ.'
                      : 'Please provide your full legal name and phone contact below to register and open the classroom modules.'
                    }
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-650 block">
                      {language === 'tw' ? 'Wo din korɔ (Full Name)' : 'Student Legal Name'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kwame Mensah"
                      required
                      className="w-full bg-zinc-50 border border-zinc-300 rounded p-2.5 focus:outline-none focus:border-offinso-green-700 text-zinc-950 font-medium"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-650 block">
                      {language === 'tw' ? 'Fon Nɔma (Phone Number)' : 'Contact Phone Number'}
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0249560120"
                      required
                      className="w-full bg-zinc-50 border border-zinc-300 rounded p-2.5 focus:outline-none focus:border-offinso-green-700 text-zinc-950 font-medium font-mono"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs py-3 rounded-md transition uppercase tracking-wider cursor-pointer"
                  >
                    {language === 'tw' ? 'Hyɛ Mfiase Nkyerɛkyerɛ' : 'Submit Registration & Start Course'}
                  </button>
                </form>

                {/* Local helpline detail */}
                <p className="text-[10px] text-zinc-400 text-center font-mono italic">
                  Admissions Helpline Support: 0249560120
                </p>
              </div>
            ) : selectedCourseId === 'health_safety_workplace' ? (
              <WorkplaceSafetyCourse studentName={studentName} studentPhone={studentPhone} />
            ) : (
              /* Sub-Flow B: Classroom Content (Syllabus lessons & quiz) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side Navigation: Lesson Tracker */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <span className="text-[10px] text-zinc-400 font-mono font-bold tracking-widest block uppercase">
                      SYLLABUS PROGRESSION
                    </span>

                    <div className="space-y-1.5 text-xs font-sans">
                      {activeLessons.map((lesson, idx) => {
                        const isCompleted = activeLessonIndex > idx || quizFinished;
                        const isActive = activeLessonIndex === idx && !quizStarted;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setQuizStarted(false);
                              setActiveLessonIndex(idx);
                            }}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition font-medium cursor-pointer ${
                              isActive 
                                ? 'bg-offinso-green-900 text-white shadow-2xs font-bold' 
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-750'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCompleted 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : isActive ? 'bg-offinso-gold text-zinc-950' : 'bg-zinc-200 text-zinc-600'
                            }`}>
                              {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                            </span>
                            <div className="truncate flex-1 text-left">
                              <p className="truncate font-semibold">{lesson.title}</p>
                              <p className={`text-[9.5px] truncate ${isActive ? 'text-zinc-200' : 'text-zinc-400'}`}>Twi: {lesson.twiTitle}</p>
                            </div>
                          </button>
                        );
                      })}

                      {/* Course Quiz index */}
                      <button
                        onClick={() => {
                          if (!quizFinished) {
                            setQuizStarted(true);
                            setCurrentQIndex(0);
                            setSelectedAnswer(null);
                            setIsQAnswered(false);
                            setQuizScore(0);
                          }
                        }}
                        disabled={activeLessonIndex < activeLessons.length - 1 && !quizFinished}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition font-medium cursor-pointer ${
                          activeLessonIndex < activeLessons.length - 1 && !quizFinished ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                          quizStarted || quizFinished 
                            ? 'bg-offinso-gold text-zinc-950 font-bold' 
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-750'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          quizFinished 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-zinc-200 text-zinc-600'
                        }`}>
                          {quizFinished ? <Check className="w-3 h-3" /> : '?'}
                        </span>
                        <div className="truncate flex-1 text-left">
                          <p className="font-semibold">{language === 'tw' ? 'Nkyerɛkyerɛ Nsɔhwɛ' : 'Final Course Quiz'}</p>
                          <p className="text-[9.5px] text-zinc-400">{activeQuiz.length} {language === 'tw' ? 'Nsɛm' : 'Interactive Questions'}</p>
                        </div>
                      </button>
                    </div>

                    <div className="border-t pt-3 text-[10.5px] text-zinc-400 space-y-1">
                      <p><strong>Registered Student:</strong> {studentName}</p>
                      <p><strong>Mobile Hotline:</strong> {studentPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side Navigation: Active Workspace */}
                <div className="lg:col-span-8">
                  
                  {!quizStarted && !quizFinished ? (
                    /* Lesson Workspace Card */
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
                      
                      {/* Active Lesson Header */}
                      <div className="border-b pb-3.5 flex justify-between items-baseline">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-bold tracking-widest text-offinso-gold uppercase">
                            LESSON {activeLessonIndex + 1} OF {activeLessons.length}
                          </span>
                          <h4 className="font-serif font-extrabold text-zinc-900 text-xl">
                            {activeLessons[activeLessonIndex].title}
                          </h4>
                          <p className="text-zinc-400 font-medium text-xs italic font-serif">
                            Twi dialect: {activeLessons[activeLessonIndex].twiTitle}
                          </p>
                        </div>
                      </div>

                      {/* Content Narrative */}
                      <div className="space-y-5 text-sm font-sans">
                        <p className="text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-150 p-4 rounded-lg italic">
                          "{activeLessons[activeLessonIndex].content}"
                        </p>

                        <div className="space-y-3">
                          <h5 className="font-serif font-bold text-zinc-900 text-sm tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-offinso-gold shrink-0" />
                            {language === 'tw' ? 'Nnwuma Nketewa Pa' : 'Key Lesson Highlights'}
                          </h5>

                          <ul className="space-y-2 text-zinc-650 text-xs">
                            {activeLessons[activeLessonIndex].points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex gap-2.5 items-start">
                                <span className="w-4.5 h-4.5 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 font-bold" />
                                </span>
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Lesson Workspace Bottom navigation */}
                      <div className="flex justify-between items-center pt-4 border-t border-zinc-150 text-xs">
                        <button
                          onClick={handlePrevLesson}
                          disabled={activeLessonIndex === 0}
                          className="bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 text-zinc-700 font-bold px-4 py-2 rounded-md transition uppercase tracking-wider disabled:cursor-not-allowed cursor-pointer"
                        >
                          Previous Lesson
                        </button>
                        <button
                          onClick={handleNextLesson}
                          className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold px-5 py-2 rounded-md transition flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                        >
                          {activeLessonIndex === activeLessons.length - 1 
                            ? (language === 'tw' ? 'Hyɛ Nsɔhwɛ Mfiase' : 'Start Course Quiz') 
                            : 'Next Lesson'
                          }
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ) : quizStarted && !quizFinished ? (
                    /* Interactive Quiz Component */
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
                      
                      <div className="flex justify-between items-baseline border-b pb-3">
                        <h4 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-1.5">
                          <GraduationCap className="w-5.5 h-5.5 text-offinso-gold" />
                          {language === 'tw' ? 'Nkyerɛkyerɛ Nsɔhwɛ Adwuma' : 'Bilingual Comprehension Challenge'}
                        </h4>
                        <span className="text-xs text-zinc-400 font-mono">
                          Question {currentQIndex + 1} of {activeQuiz.length}
                        </span>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-4">
                        <p className="font-serif text-base sm:text-lg font-bold text-zinc-900">
                          {activeQuiz[currentQIndex].question}
                        </p>

                        <div className="grid grid-cols-1 gap-2 text-xs">
                          {activeQuiz[currentQIndex].options.map((option, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrectAns = idx === activeQuiz[currentQIndex].correctIndex;
                            let optionStyle = "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800";
                            
                            if (isSelected) {
                              optionStyle = "bg-offinso-green-50 border-offinso-green-700 text-offinso-green-950 font-bold";
                            }
                            if (isQAnswered) {
                              if (isCorrectAns) {
                                optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                              } else if (isSelected) {
                                optionStyle = "bg-red-50 border-red-300 text-red-900 font-semibold";
                              } else {
                                optionStyle = "bg-zinc-50 opacity-60 border-zinc-200 text-zinc-400";
                              }
                            }

                            return (
                              <button
                                key={idx}
                                disabled={isQAnswered}
                                onClick={() => handleSelectAnswer(idx)}
                                className={`w-full text-left p-3.5 border rounded-lg transition-all flex items-center justify-between ${optionStyle} ${!isQAnswered ? 'cursor-pointer' : ''}`}
                              >
                                <span>{option}</span>
                                {isQAnswered && isCorrectAns && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation block once answered */}
                        {isQAnswered && (
                          <motion.div
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs leading-relaxed text-zinc-600"
                          >
                            <p className="font-bold text-zinc-800 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-offinso-gold" /> Explanation:
                            </p>
                            <p className="mt-0.5">{activeQuiz[currentQIndex].explanation}</p>
                          </motion.div>
                        )}
                      </div>

                      {/* Workspace Controls */}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-semibold font-mono text-zinc-500">
                          Score: {quizScore} / {activeQuiz.length}
                        </span>

                        {!isQAnswered ? (
                          <button
                            onClick={handleConfirmAnswer}
                            disabled={selectedAnswer === null}
                            className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white disabled:opacity-50 font-bold text-xs px-5 py-2 rounded transition uppercase tracking-wider disabled:cursor-not-allowed cursor-pointer"
                          >
                            Verify Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-5 py-2 rounded transition uppercase tracking-wider cursor-pointer"
                          >
                            {currentQIndex === activeQuiz.length - 1 ? 'Finish Challenge' : 'Next Question'}
                          </button>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* Final Completed Workspace Card & Digital Certificate generator */
                    <div className="space-y-6">
                      
                      {/* Completion stats banner */}
                      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs text-center space-y-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl">
                          🎉
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-serif font-extrabold text-xl text-zinc-900">
                            Course Challenge Completed!
                          </h4>
                          <p className="text-zinc-500 text-xs max-w-md mx-auto">
                            Congratulations! You have completed all course curriculum modules and successfully finished the comprehension test.
                          </p>
                        </div>

                        <div className="bg-zinc-50 border border-zinc-200 max-w-xs mx-auto p-4 rounded-lg flex justify-around text-center">
                          <div>
                            <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-wider">Final Score</p>
                            <p className="text-lg font-serif font-extrabold text-offinso-green-900">{quizScore} / {activeQuiz.length}</p>
                          </div>
                          <div className="border-r border-zinc-200"></div>
                          <div>
                            <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-wider">Passing Mark</p>
                            <p className="text-lg font-serif font-extrabold text-emerald-700">100% Pass</p>
                          </div>
                        </div>

                        {quizScore >= 2 ? (
                          <div className="pt-2">
                            <button
                              onClick={() => setCertGenerated(true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded transition uppercase tracking-wider cursor-pointer flex items-center gap-1.5 mx-auto"
                            >
                              <Award className="w-4 h-4 text-offinso-gold fill-offinso-gold" />
                              View Digital Certificate
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-red-700 font-semibold">
                              You scored {quizScore}/{activeQuiz.length}. Please retry the challenge to achieve a higher score and earn your certificate!
                            </p>
                            <button
                              onClick={handleRestartStudy}
                              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs px-4 py-2 rounded transition uppercase tracking-wider cursor-pointer"
                            >
                              Retry Quiz
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Display Certificate segment if triggered */}
                      {certGenerated && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-8 border-double border-offinso-green-800 p-8 rounded-xl bg-zinc-50 text-center space-y-4 relative overflow-hidden"
                          id="academy-course-certificate"
                        >
                          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-1/4">
                            <GraduationCap className="w-80 h-80" />
                          </div>

                          <span className="text-[10px] font-mono font-bold tracking-widest text-offinso-gold block uppercase">
                            OFFINSO MUNICIPAL ACADEMY REGISTRY
                          </span>
                          
                          <h4 className="font-serif text-2xl sm:text-3xl font-extrabold text-offinso-green-900 leading-none">
                            Certificate of Completion
                          </h4>

                          <p className="text-xs text-zinc-500 italic">This is officially certified to confirm that</p>
                          
                          <h5 className="text-2xl font-bold font-serif text-zinc-900 tracking-wide border-b max-w-sm mx-auto pb-1.5">
                            {studentName}
                          </h5>

                          <p className="text-xs text-zinc-650 max-w-md mx-auto leading-relaxed">
                            has diligently completed all required lecture modules, practical exercises, and syllabus training sessions for:
                          </p>
                          
                          <p className="font-serif font-bold text-zinc-900 text-base py-1 border-y border-dashed border-zinc-200 max-w-md mx-auto">
                            {activeCourse?.title}
                          </p>

                          <p className="text-[11px] text-zinc-550 leading-relaxed">
                            Awarded upon passing the validated course-end test. Student profile contact telephone recorded under verified registry identifier <strong className="font-mono text-offinso-green-850 font-bold">{studentPhone}</strong>.
                          </p>

                          <div className="pt-6 grid grid-cols-2 gap-4 text-[10px] font-mono text-zinc-400 border-t max-w-md mx-auto">
                            <div>
                              <p className="font-bold border-b pb-1 border-dashed max-w-xs mx-auto text-zinc-600">Municipal Registrar Clerk</p>
                              <p className="mt-1">Offinso private connection hub</p>
                            </div>
                            <div>
                              <p className="font-bold border-b pb-1 border-dashed max-w-xs mx-auto text-zinc-600">Verification Registry ID</p>
                              <p className="mt-1 font-semibold text-zinc-600">ID: OFS-ACAD-{selectedCourseId?.toUpperCase().replace('_', '-')}</p>
                            </div>
                          </div>

                        </motion.div>
                      )}

                      {/* Restart Study / Reset option */}
                      <div className="text-center">
                        <button
                          onClick={handleRestartStudy}
                          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition cursor-pointer"
                        >
                          Review Syllabus Lessons Again
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
