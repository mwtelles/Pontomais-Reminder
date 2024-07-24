export async function fetchAuthToken(login, password) {
    const response = await fetch('https://api.pontomais.com.br/api/auth/sign_in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
    });

    if (!response.ok) {
        throw new Error('Erro ao realizar login');
    }

    return response.json();
}
