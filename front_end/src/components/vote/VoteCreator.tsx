import React, { useState } from 'react';
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
  majority: string;
  comment?: string;
  deadline: string;
}

interface VoteCreatorProps {
  onAddVote: (vote: Vote) => void;
}

const VoteCreator: React.FC<VoteCreatorProps> = ({ onAddVote }) => {
  const [voteTitle, setVoteTitle] = useState('');
  const [questions, setQuestions] = useState<VoteQuestion[]>([{ questionText: '', options: [{ id: 0, text: '' }, { id: 1, text: '' }] }]);
  const [mode, setMode] = useState<string | null>(null);
  const [majority, setMajority] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoteTitle(e.target.value);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: [{ id: 0, text: '' }, { id: 1, text: '' }] }]);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ id: newQuestions[qIndex].options.length, text: '' });
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!voteTitle.trim()) {
      setError('Le titre du vote ne peut pas être vide.');
      return;
    }
    if (!mode) {
      setError('Vous devez choisir un type de vote.');
      return;
    }
    if (!majority) {
      setError('Vous devez choisir une majorité.');
      return;
    }
    for (const question of questions) {
      if (!question.questionText.trim()) {
        setError('Toutes les questions doivent avoir un texte.');
        return;
      }
      if (question.options.length < 2) {
        setError('Toutes les questions de type radio doivent avoir au moins deux options.');
        return;
      }
      for (const option of question.options) {
        if (!option.text.trim()) {
          setError('Toutes les options doivent avoir un texte.');
          return;
        }
      }
    }
    setError(null);
    const vote = { id: Date.now(), title: voteTitle, questions, mode, majority, comment, deadline };
    onAddVote(vote);

     
  };

  return (
    <div>
      <h2>Créer un vote</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" value={voteTitle} onChange={handleTitleChange} placeholder="Titre du vote" />
      {questions.map((question, qIndex) => (
        <div key={qIndex}>
          <input
            type="text"
            value={question.questionText}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            placeholder={`Question ${qIndex + 1}`}
          />
          {question.options.map((option, oIndex) => (
            <input
              key={oIndex}
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
              placeholder={`Option ${oIndex + 1}`}
            />
          ))}
          <h3>Commentaire</h3>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajouter un commentaire (ex: le 2eme tour aura lieu en date du 2 juin)"
          />
          <br/>
          <button onClick={() => addOption(qIndex)}>Ajouter une option</button>
        </div>
      ))}
      <button onClick={addQuestion}>Ajouter une question</button>
      

      <div>
        <h3>Modalité de Vote</h3>
        <label>
          <input
            type="radio"
            value="vote à un tour"
            checked={mode === 'vote à un tour'}
            onChange={() => setMode('vote à un tour')}
          />
          Vote à un tour
        </label>
        <label>
          <input
            type="radio"
            value="vote à deux tours"
            checked={mode === 'vote à deux tours'}
            onChange={() => setMode('vote à deux tours')}
          />
          Vote à deux tours
        </label>
      </div>

      <div>
        <h3>Type de Majorité</h3>
        <label>
          <input
            type="radio"
            value="majorité absolue"
            checked={majority === 'majorité absolue'}
            onChange={() => setMajority('majorité absolue')}
          />
          Majorité absolue
        </label>
        <label>
          <input
            type="radio"
            value="majorité relative"
            checked={majority === 'majorité relative'}
            onChange={() => setMajority('majorité relative')}
          />
          Majorité relative
        </label>
      </div>

      <div>
        <h3>Date limite</h3>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Soumettre le vote</button>
    </div>
  );
};

export default VoteCreator;
