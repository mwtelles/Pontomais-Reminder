export function displayData(data) {
    console.log('Dados recebidos para exibição:', data);

    if (!data || !data.session.client || !data.session.employee || !data.session.user) {
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
            first_name: data.session.employee.first_name,
            email: data.session.employee.email,
            job_title: data.session.employee.job_title,
            department: data.session.employee.department,
            team: data.session.employee.team,
            time_balance: data.session.employee.time_balance,
            admission_date: data.session.employee.admission_date,
            work_status_time_card: data.session.employee.work_status_time_card,
            picture: data.session.employee.picture ? data.session.employee.picture.url : ''
        },
        user: {
            id: data.session.user.id,
            email: data.session.user.email,
            sign_in_count: data.session.user.sign_in_count,
            last_sign_in_at: data.session.user.last_sign_in_at,
        }
    };

    document.getElementById('employeeName').textContent = relevantData.employee.name;
    document.getElementById('employeeDetails').textContent = `${relevantData.employee.job_title.name}, ${relevantData.employee.department.name}`;
    document.getElementById('clientDetails').textContent = `${relevantData.client.name}, CNPJ: ${relevantData.client.cnpj}`;
    if (relevantData.employee.picture) {
        const employeePicture = document.getElementById('employeePicture');
        employeePicture.src = `https:${relevantData.employee.picture}`;
        employeePicture.style.display = 'block';
    }
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

export function showLoggedInState(sessionData, JourneyData) {
    console.log('Exibindo estado logado com dados da sessão:', sessionData);
    console.log('Exibindo estado logado com dados da jornada:', JourneyData);

    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('loggedInContainer').style.display = 'block';

    if (sessionData) {
        displayData(sessionData);
    } else {
        console.error('sessionData está ausente:', sessionData);
    }

    if (JourneyData) {
        displayWorkDayData(JourneyData);
    } else {
        console.error('JourneyData está ausente:', JourneyData);
    }
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
