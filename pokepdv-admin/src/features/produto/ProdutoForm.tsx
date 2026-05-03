import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../lib/api';
import type { Produto } from './ProdutosPage';

const schema = z.object({

    nome: z.string().min(2, 'Mínimo 2 caracteres').max(255),
    preco: z
        .number({ invalid_type_error: 'Informe um valor' })
        .positive('Preço deve ser maior que zero'),
    ean: z
        .string()
        .regex(/^\d{8}$|^\d{12}$|^\d{13}$/, 'EAN deve ter 8, 12 ou 13 dígitos numéricos')
        .optional()
        .or(z.literal('')),
    descricao: z.string().max(1000).optional(),

});

type FormData = z.infer<typeof schema>;

interface Props {
    produto: Produto | null;
    onClose: () => void;
    onSalvo: () => void;
}

export default function ProdutoForm({ produto, onClose, onSalvo }: Props) {
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: produto
            ? {
                nome: produto.nome,
                preco: produto.preco,
                ean: produto.ean || '',
                descricao: produto.descricao || '',
            }
            : { nome: '', preco: 0, ean: '', descricao: '' },
    });

    // Reseta o formulário sempre que o produto a ser editado mudar
    useEffect(() => {
        if (produto) {
            reset({
                nome: produto.nome,
                preco: produto.preco,
                ean: produto.ean || '',
                descricao: produto.descricao || '',
            });
        } else {
            reset({ nome: '', preco: 0, ean: '', descricao: '' });
        }
        setFieldErrors({});
    }, [produto, reset]);

    const onSubmit = async (data: FormData) => {
        setFieldErrors({});
        try {
            const body = {
                ...data,
                ean: data.ean || null,
                descricao: data.descricao || null,
            };
            if (produto) {
                await api.put(`/api/v1/produtos/${produto.id}`, body);
            } else {
                await api.post('/api/v1/produtos', body);
            }
            onSalvo();
        } catch (err: any) {
            const status = err.response?.status;
            const msg = err.response?.data?.message || '';

            if (status === 409) {
                const msgLower = msg.toLowerCase();
                if (msgLower.includes('nome')) {
                    setFieldErrors({ nome: msg });
                } else if (msgLower.includes('ean')) {
                    setFieldErrors({ ean: msg });
                } else {
                    // Conflito genérico (ex: chave única não identificada explicitamente)
                    alert(msg || 'Conflito ao salvar. Verifique os dados.');
                }
            } else if (status === 400 && err.response?.data?.errors) {
                const erros: Record<string, string> = {};
                err.response.data.errors.forEach((e: any) => {
                    erros[e.field] = e.message;
                });
                setFieldErrors(erros);
            } else {
                alert(msg || 'Erro ao salvar produto');
            }
        }
    };

    const input =
        'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4">
                    {produto ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {[
                        {
                            label: 'Nome *',
                            name: 'nome',
                            type: 'text',
                            err: errors.nome?.message || fieldErrors.nome,
                        },
                        {
                            label: 'Preço *',
                            name: 'preco',
                            type: 'number',
                            err: errors.preco?.message,
                            step: '0.01',
                            min: '0.01',
                        },
                        {
                            label: 'EAN',
                            name: 'ean',
                            type: 'text',
                            err: errors.ean?.message || fieldErrors.ean,
                            placeholder: '8, 12 ou 13 dígitos (opcional)',
                        },
                    ].map((f) => (
                        <div key={f.name} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {f.label}
                            </label>
                            <input
                                {...register(f.name as any, f.type === 'number' ? { valueAsNumber: true } : {})}
                                type={f.type}
                                className={input}
                                placeholder={f.placeholder}
                                step={f.step}
                                min={f.min}
                            />
                            {f.err && <p className="text-red-500 text-xs mt-1">{f.err}</p>}
                        </div>
                    ))}

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                        </label>
                        <textarea {...register('descricao')} className={input} rows={3} />
                        {errors.descricao && (
                            <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>
                        )}
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
