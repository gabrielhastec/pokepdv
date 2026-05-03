import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../../lib/api';

const schema = z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [apiError, setApiError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setApiError('');
        try {
            const res = await api.post('/api/v1/auth/login', data);
            login(res.data.token, res.data.role, res.data.nome);
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Erro ao fazer login.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">PokePDV</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" {...register('email')}
                               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                               placeholder="admin@pokepdv.com" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Senha</label>
                        <input type="password" {...register('senha')}
                               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                               placeholder="••••••••" />
                        {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
                    </div>
                    {apiError && (
                        <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-3 mb-4">
                            {apiError}
                        </div>
                    )}
                    <button type="submit" disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
