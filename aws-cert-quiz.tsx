import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, BookOpen, Trophy, CheckCircle, XCircle, Zap, Target, Award, Sparkles, Cpu, Database } from 'lucide-react';

const AWS_TOPICS = [
  'AWS Identity & Access Management (IAM)',
  'Amazon EC2 - Basics',
  'Amazon EC2 - Advanced',
  'Amazon EC2 - Instance Storage',
  'High Availability & Scalability',
  'Amazon RDS, Aurora & ElastiCache',
  'Amazon S3 - Basics',
  'Amazon S3 - Advanced',
  'Amazon S3 - Security',
  'CloudFront & Global Accelerator',
  'AWS Storage Extras',
  'AWS Integration & Messaging',
  'Containers on AWS',
  'Serverless Overview',
  'Serverless Architectures',
  'Databases in AWS',
  'Data & Analytics',
  'Machine Learning',
  'AWS Monitoring & Performance',
  'Advanced Identity in AWS',
  'AWS Security & Encryption',
  'Amazon VPC',
  'Disaster Recovery & Migrations'
];

const QUESTIONS_DB = {
  'AWS Identity & Access Management (IAM)': [
    {
      question: "What is the AWS service that allows you to securely control access to AWS services and resources?",
      options: ["AWS Config", "AWS IAM", "AWS CloudTrail", "AWS Organizations"],
      correct: 1,
      explanation: "AWS IAM (Identity and Access Management) is the service that enables you to manage access to AWS services and resources securely."
    },
    {
      question: "Which IAM entity represents a collection of permissions that can be attached to users, groups, or roles?",
      options: ["IAM User", "IAM Policy", "IAM Group", "IAM Role"],
      correct: 1,
      explanation: "An IAM Policy is a document that defines permissions and can be attached to users, groups, or roles."
    },
    {
      question: "What is the principle of least privilege in IAM?",
      options: ["Give users maximum permissions", "Give users only the permissions they need", "Give users read-only access", "Give users admin access"],
      correct: 1,
      explanation: "The principle of least privilege means granting users only the minimum permissions necessary to perform their job functions."
    }
  ],
  'Amazon EC2 - Basics': [
    {
      question: "What does EC2 stand for?",
      options: ["Elastic Container Cloud", "Elastic Compute Cloud", "Elastic Control Cloud", "Elastic Connect Cloud"],
      correct: 1,
      explanation: "EC2 stands for Elastic Compute Cloud - AWS's scalable computing service."
    }
  ]};

export default function AWSCertQuiz() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleFinishQuiz();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = (topic) => {
    const questions = QUESTIONS_DB[topic] || [];
    setSelectedTopic(topic);
    setCurrentQuestions(questions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizStarted(true);
    setTimeLeft(questions.length * 60); // 1 minute per question
    setTimerActive(true);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);

      if (currentQuestionIndex + 1 < currentQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        handleFinishQuiz();
      }
    }
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setQuizStarted(false);
    setTimerActive(false);
    setTimeLeft(0);
    setCurrentQuestions([]);
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === currentQuestions[index]?.correct ? 1 : 0);
    }, 0);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTopicIcon = (topic) => {
    if (topic.includes('EC2') || topic.includes('Compute')) return <Cpu className="w-6 h-6" />;
    if (topic.includes('Database') || topic.includes('RDS') || topic.includes('DynamoDB')) return <Database className="w-6 h-6" />;
    if (topic.includes('Security') || topic.includes('IAM')) return <Award className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  // Topic Selection Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">AWS Certification Quiz</h1>
            </div>
            <p className="text-xl text-gray-600">Choose a topic to test your knowledge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AWS_TOPICS.map((topic, index) => (
              <div
                key={index}
                onClick={() => startQuiz(topic)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border-l-4 border-blue-500 hover:border-blue-600"
              >
                <div className="flex items-center gap-3 mb-3">
                  {getTopicIcon(topic)}
                  <h3 className="text-lg font-semibold text-gray-800">{topic}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {QUESTIONS_DB[topic]?.length || 0} questions
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>{(QUESTIONS_DB[topic]?.length || 0)} minutes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / currentQuestions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                {score}/{currentQuestions.length}
              </div>
              <div className={`text-2xl ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
            </div>

            <div className="space-y-6">
              {currentQuestions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correct;
                
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            Your answer: {question.options[userAnswer] || 'Not answered'}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-600">
                              Correct answer: {question.options[question.correct]}
                            </div>
                          )}
                          <div className="text-gray-600 bg-gray-50 p-2 rounded mt-2">
                            {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Another Topic
              </button>
              <button
                onClick={() => startQuiz(selectedTopic)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Target className="w-4 h-4" />
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedTopic}</h2>
              <div className="flex items-center gap-2 text-blue-100">
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Question {currentQuestionIndex + 1} of {currentQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-blue-500 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion?.question}
            </h3>

            <div className="space-y-3 mb-8">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIndex === currentQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}