import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Camera,
  Mic,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Eye,
  Volume2,
  Minimize2
} from 'lucide-react';
import { ExamResult } from '../../types';

const ExamInterface: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { tests, updateExamSession, setLatestExamResult, addResult } = useApp();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [test] = useState(() => tests.find(t => t.id === testId));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(test?.duration ? test.duration * 60 : 5400); // seconds
  const [violations, setViolations] = useState<any[]>([]);
  const [proctoringStatus, setProctoringStatus] = useState({
    faceDetected: true,
    multipleFaces: false,
    tabSwitched: false,
    voiceDetected: false
  });
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  // Mock questions for demo
  const mockQuestions = [
    {
      id: '1',
      type: 'mcq' as const,
      question: 'What is the time complexity of binary search algorithm?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 1, // O(log n)
      difficulty: 'medium' as const,
      topic: 'Algorithms',
      marks: 2
    },
    {
      id: '2',
      type: 'mcq' as const,
      question: 'Which data structure is used to implement recursion?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1, // Stack
      difficulty: 'easy' as const,
      topic: 'Data Structures',
      marks: 2
    },
    {
      id: '3',
      type: 'mcq' as const,
      question: 'What is the primary benefit of using a Virtual DOM in React?',
      options: [
        'It makes direct DOM manipulation faster.',
        'It minimizes performance-heavy direct manipulations of the real DOM.',
        'It is required for server-side rendering.',
        'It enables the use of CSS-in-JS libraries.'
      ],
      correctAnswer: 1,
      difficulty: 'medium' as const,
      topic: 'Web Development',
      marks: 5
    }
  ];

  const questions = test?.questions.length ? test.questions : mockQuestions;

  useEffect(() => {
    // Initialize webcam
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 }, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        addViolation('camera-error', 'Failed to access camera');
      }
    };

    initCamera();

    // Timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Mock proctoring simulation
    const proctoringInterval = setInterval(() => {
      // Simulate random violations for demo
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        const violationTypes = ['face-not-detected', 'tab-switch', 'voice-detected', 'multiple-faces'];
        const randomViolation = violationTypes[Math.floor(Math.random() * violationTypes.length)];
        simulateViolation(randomViolation);
      }
    }, 3000);

    // Prevent tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('tab-switch', 'Student switched tabs during exam');
        setProctoringStatus(prev => ({ ...prev, tabSwitched: true }));
        setTimeout(() => {
          setProctoringStatus(prev => ({ ...prev, tabSwitched: false }));
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      clearInterval(proctoringInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const simulateViolation = (type: string) => {
    const descriptions = {
      'face-not-detected': 'Face not visible in camera',
      'tab-switch': 'Tab switching detected',
      'voice-detected': 'Voice detected during exam',
      'multiple-faces': 'Multiple faces detected'
    };

    addViolation(type, descriptions[type as keyof typeof descriptions]);

    // Update status
    setProctoringStatus(prev => ({
      ...prev,
      faceDetected: type !== 'face-not-detected',
      multipleFaces: type === 'multiple-faces',
      voiceDetected: type === 'voice-detected'
    }));

    // Reset status after 2 seconds
    setTimeout(() => {
      setProctoringStatus(prev => ({
        ...prev,
        faceDetected: true,
        multipleFaces: false,
        voiceDetected: false
      }));
    }, 2000);
  };

  const addViolation = (type: string, description: string) => {
    const violation = {
      id: `violation_${Date.now()}`,
      type,
      timestamp: new Date(),
      severity: 'medium' as const,
      description
    };
    setViolations(prev => [...prev, violation]);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleSubmitExam = async () => {
    if (questions.some(q => !q.question)) {
      alert('Please fill out all question fields.');
      return;
    }

    // Calculate score (for MCQ only, demo logic)
    let score = 0;
    let totalMarks = 0;
    if (questions && questions.length) {
      questions.forEach((q) => {
        totalMarks += q.marks;
        if (q.type === 'mcq' && answers[q.id] !== undefined && q.correctAnswer !== undefined) {
          if (answers[q.id] === q.correctAnswer) {
            score += q.marks;
          }
        }
      });
    }
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const status = percentage >= 40 && violations.length < 3 ? 'pass' : 'fail';
    const examResult: Omit<ExamResult, 'id' | 'generatedAt'> = {
      examSessionId: `session_${Date.now()}`,
      studentId: user!.id,
      testId: testId!,
      score,
      totalMarks,
      percentage,
      timeTaken: test ? test.duration : 0,
      violations,
      cheatingProbability: 0,
      status: status,
      questions: questions,
      answers: answers,
    };
    
    // Set as the latest for immediate feedback on the results page
    setLatestExamResult({ ...examResult, id: '', generatedAt: new Date() });

    // Add result to the global list and save to DB
    await addResult(examResult);

    navigate('/exam-results');
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Test not found</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-600">{test.companyName}</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span className={`font-mono text-lg font-bold ${
                  timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {violations.length > 0 && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">{violations.length} Violation{violations.length !== 1 ? 's' : ''}</span>
                </div>
              )}

              <button
                onClick={handleSubmitExam}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </header>

        {/* Question Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {currentQ.marks} marks
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                </div>
                <button
                  onClick={toggleFlag}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  <span>Flag</span>
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {currentQ.question}
                </h2>

                {currentQ.type === 'mcq' && currentQ.options && (
                  <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={`question_${currentQ.id}`}
                          value={index}
                          checked={answers[currentQ.id] === index}
                          onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQ.type === 'subjective' && (
                  <textarea
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Enter your answer here..."
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </div>

                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proctoring Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">AI Proctoring</h3>
        </div>

        {/* Webcam Feed */}
        <div className="p-4 border-b border-gray-200">
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-40 object-cover"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${proctoringStatus.faceDetected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-600">Face Detection</span>
            </div>
            <div className="flex items-center space-x-1">
              <Camera className="w-4 h-4 text-gray-400" />
              <Mic className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">System Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Face Detected</span>
              <div className={`w-2 h-2 rounded-full ${proctoringStatus.faceDetected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Multiple Faces</span>
              <div className={`w-2 h-2 rounded-full ${proctoringStatus.multipleFaces ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Tab Activity</span>
              <div className={`w-2 h-2 rounded-full ${proctoringStatus.tabSwitched ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Audio Monitor</span>
              <div className={`w-2 h-2 rounded-full ${proctoringStatus.voiceDetected ? 'bg-yellow-500' : 'bg-green-500'}`} />
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="p-4 flex-1">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Question Navigator</h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors relative ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
                {flaggedQuestions.has(index) && (
                  <Flag className="w-2 h-2 text-red-500 absolute -top-1 -right-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Violations Alert */}
        {violations.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-red-50">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">
                {violations.length} Violation{violations.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-red-700">
              Recent: {violations[violations.length - 1]?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamInterface;