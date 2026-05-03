import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

import FuncionarioForm from './FuncionarioForm';
import Layout from "../../components/Layout.tsx";

interface Funcionario {
    id: string;
    nome: string;
    email: string;
    role: 'ADMIN' | 'OPERADOR';
    ativo: boolean;
}

export default function FuncionariosPage() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState<Funcionario | null>(null);

    const carregar = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/v1/funcionarios');
            setFuncionarios(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao carregar funcionários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const alternarStatus = async (f: Funcionario) => {
        const acao = f.ativo ? 'inativar' : 'ativar';
        if (!window.confirm(`Deseja ${acao} "${f.nome}"?`)) return;

        try {
            await api.patch(`/api/v1/funcionarios/${f.id}/status`);
            toast.success(`Funcionário ${f.ativo ? 'inativado' : 'ativado'} com sucesso`);
            carregar();
        } catch (err: any) {
            toast.error(err.response?.data?.message || `Erro ao ${acao} funcionário`);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Funcionários</h2>
                <button
                    onClick={() => {
                        setEditando(null);
                        setModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Novo Funcionário
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Carregando...</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                        <tr>
                            {['Nome', 'Email', 'Papel', 'Status', 'Ações'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {funcionarios.map((f) => (
                            <tr key={f.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{f.nome}</td>
                                <td className="px-4 py-3 text-gray-500">{f.email}</td>

                                <td className="px-4 py-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            f.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                      {f.role}
                    </span>
                                </td>

                                <td className="px-4 py-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            f.ativo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {f.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                                </td>

                                <td className="px-4 py-3 space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditando(f);
                                            setModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => alternarStatus(f)}
                                        className="text-gray-500 hover:underline text-xs"
                                    >
                                        {f.ativo ? 'Inativar' : 'Ativar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <FuncionarioForm
                    funcionario={editando}
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