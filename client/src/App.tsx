// App.tsx
import React, { useEffect, useState, createContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import LanguageTest from './pages/LanguageTest';
import { verifyUser } from './api/auth';
import { useMutation } from 'react-query';
import TestEditPage from './pages/TestEditPage';
import PageNotFound from './pages/PageNotFound';

// Define the type for your shared data
type MyContextData = {
  user?: any; // Change the data type as needed
};

// Create a context with the specified type
export const MyContext = createContext<MyContextData | undefined>(undefined);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>({});

  // Access the path from location object
  const currentPath = location.pathname;

  const testDetailsMutation = useMutation(verifyUser, {
    onSuccess: (data: any) => {
      setUser(data)
      if (currentPath === '/login' || currentPath === '/signup') navigate('/')
      if (currentPath === '/' && data?.role === 'admin') navigate('/admin')
    },
    onError: () => {
      // Redirect to the landing page if the token is verified
      navigate('/login')
    }
  });

  useEffect(() => {
    // Check if the user is authenticated by looking for the token in session storage
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to the login page if the token is not found
      navigate('/login');
    } else {
      testDetailsMutation.mutate()
    }
  }, []);

  return (
    <MyContext.Provider value={{ user }}>
      <Routes>
        <Route path="/signup" Component={SignUp} />
        <Route path="/login" Component={Login} />
        {
          user?.role === 'user' &&
          <>
            <Route path="/test/:lang" Component={LanguageTest} />
            <Route path="/" Component={LandingPage} />
          </>
        }
        {
          user?.role === 'admin' &&
          <>
            <Route path="/admin" Component={LandingPage} />
            <Route path="/admin/test/:lang" Component={TestEditPage} />
          </>
        }

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MyContext.Provider>
  );
};

export default App;
