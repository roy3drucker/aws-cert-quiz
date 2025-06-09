import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which AWS service is used for object storage?",
    options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "Amazon FSx"],
    correctAnswer: 1,
    explanation: "Amazon S3 (Simple Storage Service) is AWS's object storage service that offers industry-leading scalability, data availability, security, and performance.",
    category: "Storage"
  },
  {
    id: 2,
    question: "What is the maximum execution time for an AWS Lambda function?",
    options: ["5 minutes", "10 minutes", "15 minutes", "30 minutes"],
    correctAnswer: 2,
    explanation: "AWS Lambda functions can run for a maximum of 15 minutes (900 seconds). This limit was increased from 5 minutes in 2018.",
    category: "Compute"
  },
  {
    id: 3,
    question: "Which AWS service provides a managed NoSQL database?",
    options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Redshift", "Amazon Aurora"],
    correctAnswer: 1,
    explanation: "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.",
    category: "Database"
  },
  {
    id: 4,
    question: "What does VPC stand for in AWS?",
    options: ["Virtual Private Cloud", "Virtual Public Cloud", "Virtual Private Container", "Virtual Processing Center"],
    correctAnswer: 0,
    explanation: "VPC stands for Virtual Private Cloud. It's a virtual network dedicated to your AWS account, isolated from other virtual networks in the AWS Cloud.",
    category: "Networking"
  },
  {
    id: 5,
    question: "Which AWS service is used for content delivery and caching?",
    options: ["Amazon Route 53", "Amazon CloudFront", "Amazon ELB", "Amazon API Gateway"],
    correctAnswer: 1,
    explanation: "Amazon CloudFront is a web service that speeds up distribution of your static and dynamic web content through a worldwide network of data centers called edge locations.",
    category: "Networking"
  },
  {
    id: 6,
    question: "What is the default storage class for Amazon S3?",
    options: ["S3 Standard", "S3 Glacier", "S3 Standard-IA", "S3 One Zone-IA"],
    correctAnswer: 0,
    explanation: "S3 Standard is the default storage class for Amazon S3, designed for frequently accessed data with high durability, availability, and performance.",
    category: "Storage"
  },
  {
    id: 7,
    question: "Which AWS service provides DNS web service?",
    options: ["Amazon CloudFront", "Amazon Route 53", "Amazon VPC", "Amazon Direct Connect"],
    correctAnswer: 1,
    explanation: "Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service designed to route end users to Internet applications.",
    category: "Networking"
  },
  {
    id: 8,
    question: "What is the minimum charge duration for AWS Lambda?",
    options: ["1ms", "100ms", "1 second", "1 minute"],
    correctAnswer: 1,
    explanation: "AWS Lambda bills in 1ms increments, but has a minimum charge duration of 100ms for each invocation.",
    category: "Compute"
  },
  {
    id: 9,
    question: "Which AWS service is used for monitoring and observability?",
    options: ["Amazon CloudWatch", "Amazon CloudTrail", "Amazon Inspector", "Amazon GuardDuty"],
    correctAnswer: 0,
    explanation: "Amazon CloudWatch is a monitoring and observability service built for DevOps engineers, developers, site reliability engineers (SREs), and IT managers.",
    category: "Monitoring"
  },
  {
    id: 10,
    question: "What is the maximum size of an object in Amazon S3?",
    options: ["5 GB", "5 TB", "100 GB", "1 TB"],
    correctAnswer: 1,
    explanation: "The maximum size of an object in Amazon S3 is 5 TB (terabytes). Objects larger than 100 MB should be uploaded using the multipart upload capability.",
    category: "Storage"
  }
];

export default function AWSCertQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = selectedAnswer;
      setSelectedAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(selectedAnswers[currentQuestion + 1] ?? null);
      } else {
        setQuizCompleted(true);
        setShowResults(true);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(selectedAnswers[currentQuestion - 1] ?? null);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
    setSelectedAnswer(null);
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-blue-600">
                {score}/{questions.length}
              </div>
              <div className="text-xl text-gray-600">
                {percentage}% Correct
              </div>
              <Progress value={percentage} className="w-full h-4" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Question Review:</h3>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="space-y-2 flex-1">
                          <p className="font-medium">{question.question}</p>
                          <p className="text-sm text-gray-600">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.options[userAnswer]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button onClick={resetQuiz} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl text-blue-600">
            AWS Certification Quiz
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{questions[currentQuestion].category}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <RadioGroup
              value={selectedAnswer?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}