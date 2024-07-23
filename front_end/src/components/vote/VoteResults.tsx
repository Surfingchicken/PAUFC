import React from 'react';

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
}

interface VoteResponse {
  responses: string[];
}

interface VoteResultsProps {
  vote: Vote;
  responses: VoteResponse[];
}

const VoteResults: React.FC<VoteResultsProps> = ({ vote, responses }) => {
  const countResponses = (questionIndex: number, optionText: string) => {
    return responses.reduce((count, response) => {
      return count + (response.responses[questionIndex] === optionText ? 1 : 0);
    }, 0);
  };

  return (
    <div>
       
      {vote.comment && <p>Commentaire: {vote.comment}</p>}
      {vote.questions.map((question, qIndex) => (
        <div key={qIndex}>
          <ul>
            {question.options.map((option) => (
              <li key={option.id}>
                {option.text}: {countResponses(qIndex, option.text)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default VoteResults;
