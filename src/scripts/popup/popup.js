import { initTabs } from '../common/tabs.js';
import { loadInitialState } from '../common/storage.js';
import { handleLogin, handleLogout } from '../login/login.js';
import { fetchJourneyData } from '../services/journeyService.js';
import { displayWorkDayData, showMessage, displayData, showLoggedInState, showLoginForm } from '../common/display.js';
import { fetchSessionData } from '../services/sessionService.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Carregando estado inicial...');
    loadInitialState();

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);

    const tokenData = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['pontomais_token', 'client_id', 'uid'], function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result);
        });
    });

    if (tokenData.pontomais_token && tokenData.client_id && tokenData.uid) {
        try {
            const sessionData = await fetchSessionData();
            showLoggedInState(sessionData);

            const timeCards = await fetchJourneyData();
            displayWorkDayData(timeCards);
        } catch (error) {
            showMessage('Erro ao obter dados.', 'error');
        }
    } else {
        showLoginForm();
    }

    document.getElementById('settingsButton').addEventListener('click', () => {
        showTab('settings');
    });

    initTabs();
});