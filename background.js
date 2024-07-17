chrome.runtime.onInstalled.addListener(() => {
    console.log('PontoMais Reminder instalado');
    chrome.alarms.create('checkPonto', { periodInMinutes: 30 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkPonto') {
        chrome.tabs.query({ url: 'https://app2.pontomais.com.br/*' }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'checkPonto' });
            } else {
                console.error('Nenhuma aba correspondente encontrada.');
            }
        });
    }
});
