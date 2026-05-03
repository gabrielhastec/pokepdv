import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Layout from '../../components/Layout';
import ProdutoForm from './ProdutoForm';

export interface Produto {
    id: string;
    nome: string;
    descricao?: string;
    preco: number;
    ean?: string;
    ativo: boolean;
}

export default function ProdutosPage() {

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState<Produto | null>(null);

    const carregar = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/v1/produtos');
            setProdutos(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const alternarStatus = async (id: string) => {
        try {
            await api.patch(`/api/v1/produtos/${id}/status`);
            carregar();
        } catch (err: any) {
            alert('Erro ao alterar status. Tente novamente.');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Novo Produto
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Carregando...</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                        <tr>
                            {['Nome', 'EAN', 'Preço', 'Status', 'Ações'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {produtos.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{p.nome}</td>
                                <td className="px-4 py-3 text-gray-500">{p.ean || '—'}</td>
                                <td className="px-4 py-3">
                                    {p.preco.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </td>
                                <td className="px-4 py-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.ativo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                                </td>
                                <td className="px-4 py-3 space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditando(p);
                                            setModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => alternarStatus(p.id)}
                                        className="text-gray-500 hover:underline text-xs"
                                    >
                                        {p.ativo ? 'Inativar' : 'Ativar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <ProdutoForm
                    produto={editando}
                    onClose={() => {
                        setModalOpen(false);
                        setEditando(null);
                    }}
                    onSalvo={() => {
                        setModalOpen(false);
                        setEditando(null);
                        carregar();
                    }}
                />
            )}
        </Layout>
    );
}
