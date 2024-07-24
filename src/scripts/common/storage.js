import { showLoggedInState, showLoginForm } from './display.js';

export function loadInitialState() {
    chrome.storage.local.get(['pontomais_token', 'client_id', 'uid', 'session_data', 'saved_login', 'saved_password'], function(result) {
        if (result.pontomais_token) {
            showLoggedInState(result.session_data);
        } else {
            showLoginForm();
            if (result.saved_login && result.saved_password) {
                document.getElementById('login').value = result.saved_login;
                document.getElementById('password').value = result.saved_password;
                document.getElementById('rememberMe').checked = true;
            }
        }
    });
}

export function saveLoginData(authData, rememberMe, login, password) {
    return new Promise((resolve, reject) => {
        const storageData = {
            pontomais_token: authData.token,
            client_id: authData.client_id,
            uid: authData.data.login
        };

        if (rememberMe) {
            storageData.saved_login = login;
            storageData.saved_password = password;
        } else {
            storageData.saved_login = '';
            storageData.saved_password = '';
        }

        chrome.storage.local.set(storageData, function() {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

export function getLoginData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['saved_login', 'saved_password'], function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result);
        });
    });
}
