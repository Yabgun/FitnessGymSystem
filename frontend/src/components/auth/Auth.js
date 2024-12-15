import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import '../../styles/common.css';

function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isLogin) {
                await AuthService.login(formData.username, formData.password);
            } else {
                await AuthService.register(formData.username, formData.email, formData.password);
            }
            
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            
            navigate('/');
        } catch (err) {
            console.error('Auth error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 0) {
                setError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.');
            } else if (err.response?.status === 400) {
                setError('Geçersiz kullanıcı adı veya şifre');
            } else if (err.response?.status === 404) {
                setError('API endpoint bulunamadı. Lütfen sistem yöneticinize başvurun.');
            } else if (err.message === 'Geçersiz yanıt formatı') {
                setError('Sunucudan geçersiz yanıt alındı');
            } else {
                setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            username: '',
            password: '',
            email: ''
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Kullanıcı Adı:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required={!isLogin}
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Şifre:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="button button-primary"
                        disabled={loading}
                    >
                        {loading ? 'Lütfen bekleyin...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
                    </button>
                </form>

                <p>
                    {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                    <button
                        className="button button-link"
                        onClick={switchMode}
                        disabled={loading}
                    >
                        {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Auth; 