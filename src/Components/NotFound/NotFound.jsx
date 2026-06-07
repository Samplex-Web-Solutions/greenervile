import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Moves the user back one step in history
    // If no history exists (e.g., direct link), it defaults to home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return null; 
};

export default NotFoundRedirect;