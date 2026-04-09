import React, { useState } from 'react';
import { UserIcon, LockClosedIcon, CheckIcon, EmailIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/backendAPI';

interface LoginPageProps {
    onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Используем реальный Django API с Remember Me
            const data = await api.auth.login(email, password, rememberMe);

            if (!data.success) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Данные пользователя уже сохранены в storage в backendAPI
            const userData = data.user! as any;
            const accessToken = data.access_token!;

            // Вызываем login из AuthContext
            login(userData, accessToken);

            // Переходим на homepage
            onNavigate('homepage');
        } catch (err) {
            console.error('Login error:', err);
            setError('Server unavailable. Check if backend is running on http://localhost:8000');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e7cca3] to-[#8c7458] font-sans text-[#faf6ed] p-4">
            <div className="w-full max-w-sm p-8 space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-[#6d5741] rounded-full flex items-center justify-center">
                        <UserIcon className="h-10 w-10 text-[#ffffff]" />
                    </div>
                    <h1 className="mt-6 text-2xl font-semibold tracking-[0.3em]">LOGIN</h1>
                </div>

                {error && (
                    <div className="bg-red-500 text-white px-4 py-3 rounded text-center text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative flex items-center text-[#ffffff]">
                        <EmailIcon className="absolute left-0 h-5 w-5 pointer-events-none" />
                        <input
                            type="email"
                            placeholder="University Email (@stu.sdu.edu.kz)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full pl-8 pr-3 py-2 bg-transparent border-b border-[#ffffff] placeholder-[#ffffff] placeholder-opacity-70 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                        />
                    </div>
                    <div className="text-xs text-[#ffffff] opacity-80 -mt-2 pl-8">
                        Use your university email to login
                    </div>
                    <div className="relative flex items-center text-[#ffffff]">
                        <LockClosedIcon className="absolute left-0 h-5 w-5 pointer-events-none" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full pl-8 pr-3 py-2 bg-transparent border-b border-[#ffffff] placeholder-[#ffffff] focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                        />
                    </div>

                    <div className="flex items-center text-xs text-[#ffffff]">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={loading}
                                className="absolute opacity-0 h-0 w-0 peer" 
                            />
                            <div className="w-4 h-4 border border-[#ffffff] flex items-center justify-center text-transparent peer-checked:text-[#ffffff] transition-colors">
                                <CheckIcon className="h-3 w-3" />
                            </div>
                            <span>Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[#66523e] text-[#ffffff] rounded-lg tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'LOGGING IN...' : 'LOG IN'}
                    </button>
                </form>
            </div>
        </div>
    );
};