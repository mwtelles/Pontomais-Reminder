function displayData(data) {
    const relevantData = {
        client: {
            id: data.session.client.id,
            name: data.session.client.name,
            corporate_name: data.session.client.corporate_name,
            email: data.session.client.email,
            phone: data.session.client.phone,
            cnpj: data.session.client.cnpj,
            address: data.session.client.address,
            status: data.session.client.status.name,
            plan: data.session.client.plan.name,
            employees_count: data.session.client.employees_count,
            active_employees_limit: data.session.client.active_employees_limit,
            field_occupation: data.session.client.field_occupation.name,
            contact_name: data.session.client.contact_name,
            contact_mobile_phone: data.session.client.contact_mobile_phone,
        },
        employee: {
            id: data.session.employee.id,
            name: data.session.employee.name,
            email: data.session.employee.email,
            job_title: data.session.employee.job_title.name,
            department: data.session.employee.department.name,
            team: data.session.employee.team.name,
            time_balance: data.session.employee.time_balance,
            admission_date: data.session.employee.admission_date,
            work_status_time_card: data.session.employee.work_status_time_card,
        },
        user: {
            id: data.session.user.id,
            email: data.session.user.email,
            sign_in_count: data.session.user.sign_in_count,
            last_sign_in_at: data.session.user.last_sign_in_at,
        }
    };

    const dataContainer = document.getElementById('dataContainer');
    dataContainer.style.display = 'block';
    dataContainer.innerHTML = `<pre>${JSON.stringify(relevantData, null, 2)}</pre>`;
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['pontomais_token', 'client_id', 'uid'], function(result) {
        if (result.pontomais_token) {
            showLoggedInState();
        } else {
            showLoginForm();
        }
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    fetch('https://api.pontomais.com.br/api/auth/sign_in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            chrome.storage.local.set({
                pontomais_token: data.token,
                client_id: data.client_id,
                uid: data.data.login
            }, function() {
                fetch('https://api.pontomais.com.br/api/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.token}`,
                        'access-token': data.token,
                        'client': data.client_id,
                        'uid': data.data.login
                    },
                    body: JSON.stringify({
                        session: {
                            client_id: data.client_id
                        }
                    })
                })
                .then(response => response.json())
                .then(sessionData => {
                    chrome.storage.local.set({ session_data: sessionData }, function() {
                        showLoggedInState();
                        document.getElementById('message').textContent = 'Login realizado com sucesso!';
                        document.getElementById('message').classList.add('success');
                    });
                })
                .catch(error => {
                    console.error('Erro ao obter dados da sessão:', error);
                    document.getElementById('message').textContent = 'Erro ao obter dados da sessão.';
                    document.getElementById('message').classList.add('error');
                });
            });
        } else {
            document.getElementById('message').textContent = 'Falha no login. Verifique suas credenciais.';
            document.getElementById('message').classList.add('error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('message').textContent = 'Erro ao realizar login.';
        document.getElementById('message').classList.add('error');
    });
});

document.getElementById('logoutButton').addEventListener('click', function() {
    chrome.storage.local.remove(['pontomais_token', 'client_id', 'uid', 'session_data'], function() {
        showLoginForm();
        document.getElementById('message').textContent = 'Você se desconectou com sucesso.';
        document.getElementById('message').classList.add('success');
    });
});

document.getElementById('fetchDataButton').addEventListener('click', function() {
    chrome.storage.local.get(['pontomais_token', 'client_id', 'uid'], function(result) {
        if (result.pontomais_token && result.client_id && result.uid) {
            fetch('https://api.pontomais.com.br/api/session', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${result.pontomais_token}`,
                    'Content-Type': 'application/json',
                    'access-token': result.pontomais_token,
                    'client': result.client_id,
                    'uid': result.uid
                }
            })
            .then(response => response.json())
            .then(data => {
                displayData(data);
            })
            .catch(error => {
                console.error('Erro ao obter dados da sessão:', error);
                document.getElementById('message').textContent = 'Erro ao obter dados da sessão.';
                document.getElementById('message').classList.add('error');
            });
        } else {
            document.getElementById('message').textContent = 'Token não encontrado. Faça login novamente.';
            document.getElementById('message').classList.add('error');
        }
    });
});

function showLoggedInState() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('loggedInContainer').style.display = 'block';
    document.getElementById('welcomeMessage').textContent = 'Você está logado!';
}

function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('loggedInContainer').style.display = 'none';
}
