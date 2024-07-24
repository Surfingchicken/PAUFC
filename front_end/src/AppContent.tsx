import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './components/auth/AuthContext';
import SurveyCreator from './components/survey/SurveyCreator';
import SurveyResponse from './components/survey/SurveyResponse';
import SurveyResults from './components/survey/SurveyResults';
import VoteCreator from './components/vote/VoteCreator';
import VoteResponse from './components/vote/VoteResponse';
import VoteResults from './components/vote/VoteResults';
import Vault from './components/vault/Vault';
import UserManager from './components/manager/UserManager';
import CreateAG from './components/ag/CreateAG';
import Profile from './components/profile/Profile';
import './styles/App.css';

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

const AppContent: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<{ [key: number]: string[][] }>({});
  const [votes, setVotes] = useState<Vote[]>([]);
  const [voteResponses, setVoteResponses] = useState<{ [key: number]: any[] }>({});
  const [currentView, setCurrentView] = useState<'surveys' | 'votes' | 'vault' | 'usermanager' | 'createag' | 'profile' | null>('profile');
  const [showSurveyResults, setShowSurveyResults] = useState<boolean[]>([]);
  const [showVoteResults, setShowVoteResults] = useState<boolean[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/surveys', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.data && Array.isArray(response.data.surveys)) {
          setSurveys(response.data.surveys);
        }
      } catch (error) {
      }
    };

    const fetchVotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/votes', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.data && Array.isArray(response.data.votes)) {
          setVotes(response.data.votes);
        } else {

        }
      } catch (error) {
      }
    };

    fetchSurveys();
    fetchVotes();
  }, [auth.user]);

  const addSurvey = (surveyData: { title: string; questions: SurveyQuestion[] }) => {
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/surveys', surveyData, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        const newSurvey = response.data;
        setSurveys([...surveys, newSurvey]);
        setShowSurveyResults([...showSurveyResults, false]);
      })
      .catch(error => {
      });
  };

  const handleSurveyResponseSubmit = (surveyIndex: number, response: string[]) => {
    const surveyId = surveys[surveyIndex].id;
    const newResponses = { ...surveyResponses };
    if (!newResponses[surveyId]) {
      newResponses[surveyId] = [];
    }
    newResponses[surveyId].push(response);
    setSurveyResponses(newResponses);
  };

  const fetchSurveyResponses = async (surveyId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/survey-responses/${surveyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.data && Array.isArray(response.data.responses)) {
        setSurveyResponses(prevResponses => ({
          ...prevResponses,
          [surveyId]: response.data.responses,
        }));
      } else {
      }
    } catch (error) {
    }
  };

  const toggleSurveyResults = async (index: number) => {
    const surveyId = surveys[index].id;
    const newShowSurveyResults = [...showSurveyResults];
    newShowSurveyResults[index] = !newShowSurveyResults[index];
    setShowSurveyResults(newShowSurveyResults);

    if (newShowSurveyResults[index] && !surveyResponses[surveyId]) {
      await fetchSurveyResponses(surveyId);
    }
  };

  const addVote = (voteData: Vote) => {
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/votes', voteData, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        const newVote = response.data;
        setVotes([...votes, newVote]);
        setShowVoteResults([...showVoteResults, false]);
      })
      .catch(error => {
      });
  };

  const handleVoteResponseSubmit = (voteIndex: number, response: string[]) => {
    const voteId = votes[voteIndex].id;
    const newResponses = { ...voteResponses };
    if (!newResponses[voteId]) {
      newResponses[voteId] = [];
    }
    newResponses[voteId].push({ responses: response });
    setVoteResponses(newResponses);
  };

  const fetchVoteResponses = async (voteId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/vote-responses/${voteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.data && Array.isArray(response.data.responses)) {
        setVoteResponses(prevResponses => ({
          ...prevResponses,
          [voteId]: response.data.responses,
        }));
      } else {
      }
    } catch (error) {
    }
  };

  const toggleVoteResults = async (index: number) => {
    const voteId = votes[index].id;
    const newShowVoteResults = [...showVoteResults];
    newShowVoteResults[index] = !newShowVoteResults[index];
    setShowVoteResults(newShowVoteResults);

    if (newShowVoteResults[index] && !voteResponses[voteId]) {
      await fetchVoteResponses(voteId);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3000/logout', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
    }
  };  

  const checkContributionStatus = () => {
    if (auth.user && (!auth.user.toBlockOn || new Date(auth.user.toBlockOn).getTime() === 0)) {
      setIsBlocked(false);
    } else if (auth.user) {
      const today = new Date();
      const toBlockOn = new Date(auth.user.toBlockOn);
      console.log(today)
      console.log(toBlockOn)
      if (today >= toBlockOn) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    }
  };
  
  

  useEffect(() => {
    checkContributionStatus();
  }, [auth.user]);

  if (isBlocked) {
    return (
      <div>
        <p>Accès bloqué</p>
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
        <div className="sidebar">
          <button onClick={() => setCurrentView('surveys')}>Sondages</button>
          <button onClick={() => setCurrentView('votes')}>Votes</button>
          {(auth.user?.role === 'admin' || auth.user?.role === 'user' || auth.user?.role === 'readonly' || auth.user?.role === 'temp-user') && (
            <>
              <button onClick={() => setCurrentView('vault')}>Coffre-fort</button>
              {auth.user?.role === 'admin' && (
                <>
                  <button onClick={() => setCurrentView('usermanager')}>Gestion des utilisateurs</button>
                  <button onClick={() => setCurrentView('createag')}>Assemblée Générale</button>
                  <button onClick={() => setCurrentView('profile')}>Profil</button>
                </>
              )}
            </>
          )}
          {(auth.user?.role === 'user') && (
            <>
              <button onClick={() => setCurrentView('createag')}>Assemblée Générale</button>
              <button onClick={() => setCurrentView('profile')}>Profil</button>
            </>
          )}
          {(auth.user?.role === 'readonly' || auth.user?.role === 'temp-user') && (
            <>
              <button onClick={() => setCurrentView('profile')}>Profil</button>
            </>
          )}

          <button onClick={handleLogout}>Déconnexion</button>
        </div>

        <div className="main-content-home">
          {currentView === 'surveys' && (
            <>
              {auth.user?.role === 'admin' || auth.user?.role === 'user' && <SurveyCreator onAddSurvey={addSurvey} />}
              {Array.isArray(surveys) && surveys.map((survey, index) => (
                <div key={survey.id}>
                  <br />
                  <SurveyResponse
                    survey={survey}
                    onSubmit={(response) => handleSurveyResponseSubmit(index, response)}
                  />

                  <button onClick={() => toggleSurveyResults(index)}>
                    {showSurveyResults[index] ? "Masquer les résultats" : "Afficher les résultats"}
                  </button>
                  {showSurveyResults[index] && (
                    <SurveyResults survey={survey} responses={surveyResponses[survey.id] || []} />
                  )}
                  <hr />
                </div>
              ))}
            </>
          )}

          {currentView === 'votes' && (
            <>
              {auth.user?.role === 'admin' || auth.user?.role === 'user' && <VoteCreator onAddVote={addVote} />}
              {votes.map((vote, index) => (
                <div key={vote.id}>
                  {vote.comment && <p>Commentaire: {vote.comment}</p>}

                  <VoteResponse
                    vote={vote}
                    onSubmit={(response) => handleVoteResponseSubmit(index, response)}
                  />
                  <button onClick={() => toggleVoteResults(index)}>
                    {showVoteResults[index] ? "Masquer les résultats" : "Afficher les résultats"}
                  </button>
                  {showVoteResults[index] && (
                    <VoteResults vote={vote} responses={voteResponses[vote.id] || []} />
                  )}
                  <hr />
                </div>
              ))}
            </>
          )}

          {currentView === 'vault' && <Vault />}

          {currentView === 'usermanager' && <UserManager />}

          {currentView === 'createag' && <CreateAG />}

          {currentView === 'profile' && <Profile />}
        </div>
      </div>
    </>
  );
};

export default AppContent;
