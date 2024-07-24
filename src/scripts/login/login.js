import { showLoggedInState, showLoginForm, showMessage } from '../common/display.js';
import { saveLoginData, getLoginData } from '../common/storage.js';
import { fetchAuthToken } from '../services/signInService.js';
import { fetchSessionData } from '../services/sessionService.js';

export async function handleLogin(event) {
    event.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const authData = await fetchAuthToken(login, password);
        await saveLoginData(authData, rememberMe, login, password);
        const sessionData = await fetchSessionData(authData.token, authData.client_id, authData.data.login);
        showLoggedInState(sessionData);
        showMessage('Login realizado com sucesso!', 'success');
    } catch (error) {
        showMessage('Erro ao realizar login.', 'error');
    }
}

export function handleLogout() {
    chrome.storage.local.remove(['pontomais_token', 'client_id', 'uid', 'session_data', 'saved_login', 'saved_password'], function() {
        showLoginForm();
        showMessage('Você se desconectou com sucesso.', 'success');
    });
}
