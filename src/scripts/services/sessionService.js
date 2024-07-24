export async function fetchSessionData(token, client_id, uid) {
    const response = await fetch('https://api.pontomais.com.br/api/session', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'access-token': token,
            'client': client_id,
            'uid': uid
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao obter dados da sessão');
    }

    return response.json();
}
