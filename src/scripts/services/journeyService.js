export async function fetchJourneyData() {
    const tokenData = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['pontomais_token', 'client_id', 'uid'], function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result);
        });
    });

    const { pontomais_token, client_id, uid } = tokenData;
    dayjs.extend(dayjs_plugin_utc);
    dayjs.extend(dayjs_plugin_timezone);
    const currentDate = dayjs().tz("America/Sao_Paulo").format('YYYY-MM-DD');
    const url = new URL('https://api.pontomais.com.br/api/time_cards/work_days/current');
    url.searchParams.append('start_date', currentDate);
    url.searchParams.append('end_date', currentDate);
    url.searchParams.append('attributes', 'time_cards');

    const response = await fetch(url, {
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
        throw new Error('Erro ao obter dados do dia de trabalho');
    }

    const data = await response.json();
    const timeCards = data.work_days[0].time_cards;

    chrome.storage.local.set({ journey_data: timeCards });

    return timeCards;
}
