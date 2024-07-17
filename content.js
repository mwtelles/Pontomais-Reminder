chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkPonto') {
      chrome.storage.local.get('pontomais_token', (result) => {
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
            console.log('Dados da sessão:', data);
            alert('Verifique seu ponto! Hora de bater o ponto.');
            sendResponse({ success: true });
          })
          .catch(error => {
            console.error('Erro ao obter dados da sessão:', error);
            sendResponse({ success: false, error: error.toString() });
          });
        } else {
          console.error('Token não encontrado no armazenamento local');
          sendResponse({ success: false, error: 'Token não encontrado' });
        }
      });
      return true;
    }
  });
  