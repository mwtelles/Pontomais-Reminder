export async function fetchSessionData() {
    const tokenData = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['pontomais_token', 'client_id', 'uid'], function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result);
        });
    });

    const { pontomais_token, client_id, uid } = tokenData;

    const response = await fetch('https://api.pontomais.com.br/api/session', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${pontomais_token}`,
            'Content-Type': 'application/json',
            'access-token': pontomais_token,
            'client': client_id,
            'uid': uid
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao obter dados da sessão');
    }

    return response.json();
}
