import axios from './axiosConfig';

class AuthService {
    static async login(username, password) {
        try {
            const response = await axios.post('/api/Auth/login', {
                userName: username,
                password: password
            });
            
            if (response.data && response.data.token) {
                this.setSession(response.data);
                return response.data;
            }
            throw new Error('Geçersiz yanıt formatı');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async register(username, email, password) {
        try {
            const response = await axios.post('/api/Auth/register', {
                userName: username,
                email: email,
                password: password
            });
            
            if (response.data && response.data.token) {
                this.setSession(response.data);
                return response.data;
            }
            throw new Error('Geçersiz yanıt formatı');
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    static setSession(authData) {
        if (authData.token) {
            localStorage.setItem('token', authData.token);
        }
        if (authData.userName) {
            localStorage.setItem('username', authData.userName);
        }
        if (authData.user) {
            localStorage.setItem('user', JSON.stringify(authData.user));
        }
    }

    static clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        try {
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    static getToken() {
        return localStorage.getItem('token');
    }
}

export default AuthService; 