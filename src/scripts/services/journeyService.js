export async function fetchJourneyData(token, client_id, uid) {
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'access-token': token,
            'client': client_id,
            'uid': uid
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao obter dados do dia de trabalho');
    }

    return response.json().then(data => data.work_days[0].time_cards);
}
