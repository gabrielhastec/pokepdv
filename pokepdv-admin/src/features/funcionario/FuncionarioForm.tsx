import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const schema = z.object({
    nome: z.string().min(2, 'Mínimo 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    senha: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
    role: z.enum(['ADMIN', 'OPERADOR']),
});

type FormData = z.infer<typeof schema>;

interface Funcionario {
    id: string;
    nome: string;
    email: string;
    role: 'ADMIN' | 'OPERADOR';
    ativo: boolean;
}

interface Props {
    funcionario: Funcionario | null;
    onClose: () => void;
    onSalvo: () => void;
}

export default function FuncionarioForm({ funcionario, onClose, onSalvo }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: funcionario
            ? {
                nome: funcionario.nome,
                email: funcionario.email,
                role: funcionario.role,
                senha: '',
            }
            : {
                nome: '',
                email: '',
                senha: '',
                role: 'OPERADOR',
            },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const body: any = {
                nome: data.nome,
                email: data.email,
                role: data.role,
            };

            if (data.senha && data.senha.trim() !== '') {
                body.senha = data.senha;
            }

            if (funcionario) {
                await api.put(`/api/v1/funcionarios/${funcionario.id}`, body);
                toast.success('Funcionário atualizado com sucesso');
            } else {
                if (!data.senha) {
                    toast.error('Senha é obrigatória');
                    return;
                }

                body.senha = data.senha;
                await api.post('/api/v1/funcionarios', body);
                toast.success('Funcionário criado com sucesso');
            }

            onSalvo();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao salvar funcionário');
        }
    };

    const input =
        'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4">
                    {funcionario ? 'Editar Funcionário' : 'Novo Funcionário'}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {[
                        { label: 'Nome *', name: 'nome', type: 'text' },
                        { label: 'Email *', name: 'email', type: 'email' },
                        {
                            label: funcionario
                                ? 'Senha (vazio = sem alteração)'
                                : 'Senha *',
                            name: 'senha',
                            type: 'password',
                        },
                    ].map((f) => (
                        <div key={f.name} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {f.label}
                            </label>

                            <input
                                {...register(f.name as keyof FormData)}
                                type={f.type}
                                className={input}
                            />

                            {errors[f.name as keyof FormData] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors[f.name as keyof FormData]?.message as string}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Papel *
                        </label>
                        <select {...register('role')} className={input}>
                            <option value="OPERADOR">OPERADOR</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
