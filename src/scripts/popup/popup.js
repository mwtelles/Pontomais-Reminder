import { initTabs } from '../common/tabs.js';
import { loadInitialState } from '../common/storage.js';
import { handleLogin, handleLogout } from '../login/login.js';
import { fetchJourneyData } from '../services/journeyService.js';
import { displayWorkDayData, showMessage, displayData } from '../common/display.js';
import { fetchSessionData } from '../services/sessionService.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Carregando estado inicial...');
    loadInitialState();

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);

    try {
        const sessionData = await fetchSessionData();
        displayData(sessionData);
    } catch (error) {
        showMessage('Erro ao obter dados da sessão.', 'error');
    }

    try {
        const timeCards = await fetchJourneyData();
        displayWorkDayData(timeCards);
    } catch (error) {
        showMessage('Erro ao obter dados do dia de trabalho.', 'error');
    }

    document.getElementById('settingsButton').addEventListener('click', () => {
        showTab('settings');
    });

    initTabs();
});
