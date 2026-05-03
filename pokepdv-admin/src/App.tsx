import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import AppRouter from './router';
import { Toaster } from 'react-hot-toast';

export default function App() {

  return (
      <BrowserRouter>
          <AuthProvider>
              <AppRouter />
              <Toaster position="top-right" />
          </AuthProvider>
      </BrowserRouter>
  );

}