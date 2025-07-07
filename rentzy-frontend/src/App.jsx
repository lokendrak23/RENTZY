import { useLocation } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/Routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login-signup'; // you can add more paths like '/register'

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
