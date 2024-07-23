import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface VoteQuestion {
  questionText: string;
  options: { id: number, text: string }[];
}

interface Vote {
  id: number;
  title: string;
  questions: VoteQuestion[];
  mode: string;
  comment?: string;
  deadline: string;
  majority: string;
}

interface VoteResponseProps {
  vote: Vote;
  onSubmit: (responses: string[]) => void;
}

const VoteResponse: React.FC<VoteResponseProps> = ({ vote, onSubmit }) => {
  const [responses, setResponses] = useState<string[]>(Array(vote.questions.length).fill(''));
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    const now = new Date();
    const deadline = new Date(vote.deadline);
    setIsDeadlinePassed(now > deadline);
  }, [vote.deadline]);

  const handleResponseChange = (qIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[qIndex] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    if (!isDeadlinePassed) {
      const token = localStorage.getItem('token');
      const voteId = vote.id;
      const responsePayload = {
        voteId: voteId,
        responses: responses,
      };

      try {
        const response = await axios.post(
          'http://localhost:3000/vote-responses',
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
          setResponses(Array(vote.questions.length).fill(''));
          alert("Vote pris en compte !");
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
      alert('Le délai pour voter est dépassé.');
    }
  };

  return (
    <div>
      <h2>{vote.title}</h2>
      <p>Modalité de vote : {vote.mode} à {vote.majority}</p> 
      {isDeadlinePassed ? (
        <p>Le délai pour voter est dépassé.</p>
      ) : (
        <>
          {vote.questions.map((question, qIndex) => (
            <div key={qIndex}>
              <p>{question.questionText}</p>
              {question.options.map((option, oIndex) => (
                <label key={oIndex}>
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={option.text}
                    onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Soumettre les réponses</button>
        </>
      )}
    </div>
  );
};

export default VoteResponse;
