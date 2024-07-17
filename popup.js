document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('pontomais_token', function(result) {
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
        chrome.storage.local.set({ pontomais_token: data.token }, function() {
          showLoggedInState();
          document.getElementById('message').textContent = 'Login realizado com sucesso!';
          document.getElementById('message').classList.add('success');
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
    chrome.storage.local.remove('pontomais_token', function() {
      showLoginForm();
      document.getElementById('message').textContent = 'Você se desconectou com sucesso.';
      document.getElementById('message').classList.add('success');
    });
  });
  
  document.getElementById('fetchDataButton').addEventListener('click', function() {
    chrome.storage.local.get('pontomais_token', function(result) {
      if (result.pontomais_token) {
        const token = result.pontomais_token;
        fetch('https://api.pontomais.com.br/api/session', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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
  
  function displayData(data) {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.style.display = 'block';
    dataContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
  
  function showLoggedInState() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('loggedInContainer').style.display = 'block';
    document.getElementById('welcomeMessage').textContent = 'Você está logado!';
  }
  
  function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('loggedInContainer').style.display = 'none';
  }
  