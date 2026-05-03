import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import ProdutosPage from './features/produto/ProdutosPage';
import FuncionariosPage from './features/funcionario/FuncionariosPage';

export default function AppRouter() {

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/produtos" element={<ProtectedRoute><ProdutosPage /></ProtectedRoute>} />
            <Route path="/funcionarios" element={<ProtectedRoute><FuncionariosPage /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/produtos" replace />} />
        </Routes>
    );

}
