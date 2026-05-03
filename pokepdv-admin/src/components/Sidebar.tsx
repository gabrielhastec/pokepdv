import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export default function Sidebar() {

    const { logout, nome } = useAuth();
    const { pathname } = useLocation();
    const active = (p: string) =>
        pathname === p ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-800';

    return (

        <aside className="w-56 bg-blue-900 min-h-screen flex flex-col">
            <div className="p-4 border-b border-blue-700">
                <h1 className="text-white font-bold text-xl">PokePDV</h1>
                <p className="text-blue-300 text-sm mt-1 truncate">{nome}</p>
            </div>
            <nav className="flex-1 p-3 space-y-1">
                <Link to="/produtos" className={`block px-3 py-2 rounded text-sm font-medium ${active('/produtos')}`}>
                    Produtos
                </Link>
                <Link to="/funcionarios" className={`block px-3 py-2 rounded text-sm font-medium ${active('/funcionarios')}`}>
                    Funcionários
                </Link>
            </nav>
            <div className="p-4 border-t border-blue-700">
                <button onClick={logout}
                        className="w-full text-left text-gray-300 hover:text-white text-sm px-3 py-2 rounded hover:bg-blue-800">
                    Sair
                </button>
            </div>
        </aside>
    );
}
