// Função para exibir os dados na UI
function displayData(data) {
    console.log('Dados recebidos para exibição:', data);

    if (!data || !data.session || !data.session.client || !data.session.employee || !data.session.user) {
        console.error('Dados de sessão incompletos ou ausentes:', data);
        return;
    }

    const relevantData = {
        client: {
            id: data.session.client.id,
            name: data.session.client.name,
            corporate_name: data.session.client.corporate_name,
            email: data.session.client.email,
            phone: data.session.client.phone,
            cnpj: data.session.client.cnpj,
            address: data.session.client.address,
            status: data.session.client.status,
            plan: data.session.client.plan,
            employees_count: data.session.client.employees_count,
            active_employees_limit: data.session.client.active_employees_limit,
            field_occupation: data.session.client.field_occupation,
            contact_name: data.session.client.contact_name,
            contact_mobile_phone: data.session.client.contact_mobile_phone,
        },
        employee: {
            id: data.session.employee.id,
            name: data.session.employee.name,
            email: data.session.employee.email,
            job_title: data.session.employee.job_title,
            department: data.session.employee.department,
            team: data.session.employee.team,
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

    // Salvar os dados relevantes no armazenamento local
    chrome.storage.local.set({ session_data: relevantData });

    // Atualizar a UI com os dados relevantes
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.style.display = 'block';
    dataContainer.innerHTML = `<pre>${JSON.stringify(relevantData, null, 2)}</pre>`;

    const sessionDataContainer = document.getElementById('sessionDataContainer');
    sessionDataContainer.style.display = 'block';
    sessionDataContainer.innerHTML = `<pre>${JSON.stringify(relevantData, null, 2)}</pre>`;

    document.getElementById('employeeName').textContent = relevantData.employee.name;
    document.getElementById('employeeDetails').textContent = `${relevantData.employee.job_title.name}, ${relevantData.employee.department.name}`;
    document.getElementById('clientDetails').textContent = `${relevantData.client.name}, CNPJ: ${relevantData.client.cnpj}`;
}

// Função para carregar o estado inicial da popup
function loadInitialState() {
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

// Função para carregar o estado inicial da popup
function loadInitialState() {
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

// Evento DOMContentLoaded para carregar o estado inicial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carregando estado inicial...');
    loadInitialState();

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        fetch('https://api.pontomais.com.br/api/auth/sign_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do login:', data);
            if (data.token) {
                const storageData = {
                    pontomais_token: data.token,
                    client_id: data.client_id,
                    uid: data.data.login
                };

                if (rememberMe) {
                    storageData.saved_login = login;
                    storageData.saved_password = password;
                } else {
                    storageData.saved_login = '';
                    storageData.saved_password = '';
                }

                chrome.storage.local.set(storageData, function() {
                    fetch('https://api.pontomais.com.br/api/session', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.token}`,
                            'access-token': data.token,
                            'client': data.client_id,
                            'uid': data.data.login
                        }
                    })
                    .then(response => response.json())
                    .then(sessionData => {
                        console.log('Dados da sessão obtidos:', sessionData);
                        chrome.storage.local.set({ session_data: sessionData }, function() {
                            showLoggedInState(sessionData);
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
        chrome.storage.local.remove(['pontomais_token', 'client_id', 'uid', 'session_data', 'saved_login', 'saved_password'], function() {
            showLoginForm();
            document.getElementById('message').textContent = 'Você se desconectou com sucesso.';
            document.getElementById('message').classList.add('success');
        });
    });

    document.getElementById('fetchDataButton').addEventListener('click', function() {
        chrome.storage.local.get(['pontomais_token', 'client_id', 'uid'], function(result) {
            console.log('Dados de autenticação recuperados:', result);
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

    document.getElementById('settingsButton').addEventListener('click', function() {
        showTab('settings');
    });

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            showTab(tab);
        });
    });
});

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(tab).style.display = 'block';
}

function showLoggedInState(sessionData) {
    console.log('Exibindo estado logado com dados da sessão:', sessionData);

    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('loggedInContainer').style.display = 'block';
    if (sessionData) {
        displayData(sessionData);
    } else {
        document.getElementById('fetchDataButton').click();
    }
}

function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('loggedInContainer').style.display = 'none';
}

document.getElementById('fetchJourneyDataButton').addEventListener('click', function() {
    chrome.storage.local.get(['pontomais_token', 'client_id', 'uid'], function(result) {
        console.log('Dados de autenticação recuperados:', result);
        if (result.pontomais_token && result.client_id && result.uid) {
            // Carregar plugins do dayjs
            dayjs.extend(dayjs_plugin_utc);
            dayjs.extend(dayjs_plugin_timezone);

            // Definir a data atual no fuso horário de Brasília/São Paulo
            const currentDate = dayjs().tz("America/Sao_Paulo").format('YYYY-MM-DD');

            // Montar a URL com os parâmetros de consulta
            const url = new URL('https://api.pontomais.com.br/api/time_cards/work_days/current');
            url.searchParams.append('start_date', currentDate);
            url.searchParams.append('end_date', currentDate);
            url.searchParams.append('attributes', 'time_cards');

            fetch(url, {
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
                displayWorkDayData(data.work_days[0].time_cards); // Exibe os dados de time_cards
            })
            .catch(error => {
                console.error('Erro ao obter dados do dia de trabalho:', error);
                document.getElementById('message').textContent = 'Erro ao obter dados do dia de trabalho.';
                document.getElementById('message').classList.add('error');
            });
        } else {
            document.getElementById('message').textContent = 'Token não encontrado. Faça login novamente.';
            document.getElementById('message').classList.add('error');
        }
    });
});

function displayWorkDayData(timeCards) {
    console.log('Dados dos cartões de ponto recebidos para exibição:', timeCards);

    if (!timeCards || timeCards.length === 0) {
        console.error('Nenhum cartão de ponto disponível.');
        return;
    }

    const dataContainer = document.getElementById('dataContainer');
    dataContainer.style.display = 'block';
    dataContainer.innerHTML = `<pre>${JSON.stringify(timeCards, null, 2)}</pre>`;

    timeCards.forEach(timeCard => {
        const timeCardElement = document.createElement('div');
        timeCardElement.classList.add('time-card');
        timeCardElement.innerHTML = `
            <p>ID: ${timeCard.id}</p>
            <p>Data: ${timeCard.date}</p>
            <p>Hora: ${timeCard.time}</p>
            <p>Endereço: ${timeCard.address}</p>
            <p>Tipo de Registro: ${timeCard.register_type.name}</p>
            <p>Método: ${timeCard.software_method.name}</p>
        `;
        dataContainer.appendChild(timeCardElement);
    });
}