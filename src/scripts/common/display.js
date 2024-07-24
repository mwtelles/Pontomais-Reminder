export function displayData(data) {
    console.log('Dados recebidos para exibição:', data);

    if (!data || !data.client || !data.employee || !data.user) {
        console.error('Dados de sessão incompletos ou ausentes:', data);
        return;
    }

    const relevantData = {
        client: {
            id: data.client.id,
            name: data.client.name,
            corporate_name: data.client.corporate_name,
            email: data.client.email,
            phone: data.client.phone,
            cnpj: data.client.cnpj,
            address: data.client.address,
            status: data.client.status,
            plan: data.client.plan,
            employees_count: data.client.employees_count,
            active_employees_limit: data.client.active_employees_limit,
            field_occupation: data.client.field_occupation,
            contact_name: data.client.contact_name,
            contact_mobile_phone: data.client.contact_mobile_phone,
        },
        employee: {
            id: data.employee.id,
            name: data.employee.name,
            email: data.employee.email,
            job_title: data.employee.job_title,
            department: data.employee.department,
            team: data.employee.team,
            time_balance: data.employee.time_balance,
            admission_date: data.employee.admission_date,
            work_status_time_card: data.employee.work_status_time_card,
        },
        user: {
            id: data.user.id,
            email: data.user.email,
            sign_in_count: data.user.sign_in_count,
            last_sign_in_at: data.user.last_sign_in_at,
        }
    };

    chrome.storage.local.set({ session_data: relevantData });

    document.getElementById('employeeName').textContent = relevantData.employee.name;
    document.getElementById('employeeDetails').textContent = `${relevantData.employee.job_title.name}, ${relevantData.employee.department.name}`;
    document.getElementById('clientDetails').textContent = `${relevantData.client.name}, CNPJ: ${relevantData.client.cnpj}`;
}

export function displayWorkDayData(timeCards) {
    console.log('Dados dos cartões de ponto recebidos para exibição:', timeCards);

    if (!timeCards || timeCards.length === 0) {
        console.error('Nenhum cartão de ponto disponível.');
        return;
    }

    const dataContainer = document.getElementById('dataContainer');
    dataContainer.style.display = 'block';
    dataContainer.innerHTML = '';

    timeCards.forEach(timeCard => {
        const timeCardElement = document.createElement('div');
        timeCardElement.classList.add('time-card');
        timeCardElement.innerHTML = `
            <p><strong>Data:</strong> ${timeCard.date}</p>
            <p><strong>Hora:</strong> ${timeCard.time}</p>
            <p><strong>Endereço:</strong> ${timeCard.address}</p>
            <p><strong>Tipo de Registro:</strong> ${timeCard.register_type.name}</p>
            <p><strong>Método:</strong> ${timeCard.software_method.name}</p>
        `;
        dataContainer.appendChild(timeCardElement);
    });
}

export function showLoggedInState(sessionData) {
    console.log('Exibindo estado logado com dados da sessão:', sessionData);

    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('loggedInContainer').style.display = 'block';

    if (sessionData) {
        displayData(sessionData);
    } else {
        console.error('sessionData está ausente:', sessionData);
    }

    chrome.storage.local.get(['journey_data'], function(result) {
        if (result.journey_data) {
            displayWorkDayData(result.journey_data);
        } else {
            console.error('Dados da jornada estão ausentes:', result);
        }
    });
}

export function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('loggedInContainer').style.display = 'none';
}

export function showMessage(message, type) {
    const messageContainer = document.getElementById('message');
    messageContainer.textContent = message;
    messageContainer.className = type;
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}
