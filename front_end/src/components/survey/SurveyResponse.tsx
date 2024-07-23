import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';

interface SurveyQuestion {
  questionText: string;
  options?: string[];
  type: 'radio' | 'text';
}

interface Survey {
  id: number;
  title: string;
  questions: SurveyQuestion[];
  deadline: string;
}

interface SurveyResponseProps {
  survey: Survey;
  onSubmit: (responses: string[]) => void;
}

const SurveyResponse: React.FC<SurveyResponseProps> = ({ survey, onSubmit }) => {
  const [responses, setResponses] = useState<string[]>(Array(survey.questions.length).fill(''));
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    const now = new Date();
    const deadline = new Date(survey.deadline);
    setIsDeadlinePassed(now > deadline);
  }, [survey.deadline]);

  const handleResponseChange = (qIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[qIndex] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    if (!isDeadlinePassed) {
      const token = localStorage.getItem('token');
      const surveyId = survey.id;
      const responsePayload = {
        surveyId: surveyId,
        responses: responses,
      };
  
      try {
        const response = await axios.post(
          'http://localhost:3000/survey-responses',
          responsePayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
  
        if (response.status === 201) {
          onSubmit(responses);
          setResponses(Array(survey.questions.length).fill(''));
          alert("Réponse prise en compte")
        } else {
          const errorMessage = response.data?.error || 'Erreur lors de la soumission des réponses';
          alert(errorMessage);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error || 'Erreur lors de la soumission des réponses';
          alert(errorMessage);
        } else {
          alert('Une erreur inconnue est survenue');
        }
      }
    } else {
      alert('Le délai pour répondre à ce sondage est dépassé.');
    }
  };
  

  return (
    <div>
      <h2>{survey.title}</h2>
      {isDeadlinePassed ? ( 
        <p>Le délai pour répondre à ce sondage est dépassé.</p>
      ) : (
        <>
          {survey.questions.map((question, qIndex) => (
            <div key={qIndex}>
              <p>{question.questionText}</p>
              {question.type === 'radio' ? (
                question.options!.map((option, oIndex) => (
                  <label key={oIndex}>
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={option}
                      onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                    />
                    {option}
                  </label>
                ))
              ) : (
                <textarea
                  value={responses[qIndex]}
                  onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                  placeholder="Votre réponse"
                  rows={4}
                  style={{ width: '100%', padding: '10px' }}
                />
              )}
            </div>
          ))}
          <button onClick={handleSubmit}>Soumettre les réponses</button>
        </>
      )}
    </div>
  );
};

export default SurveyResponse;
