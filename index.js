const fetch = require('node-fetch');
const http = require('http');
const url = require('url');

http.createServer(onRequest).listen(8000);

function onRequest(request, response) {

    const url_parts = url.parse(request.url, true);
    const query = url_parts.query;

    const eloTranslateList = {
        'IRON': 'FERRO',
        'BRONZE': 'BRONZE',
        'SILVER': 'PRATA',
        'GOLD': 'OURO',
        'PLATINUM': 'PLATINA',
        'DIAMOND': 'DIAMANTE',
        'MASTER': 'MESTRE',
        'GRANDMASTER': 'GRÃO-MESTRE',
        'CHALLENGER': 'DESAFIANTE'
    };

    let ranking = '';
    
    (async () => {
        const responseData = await fetch(`https://overwolf.kda.gg/retrieve_match_history_updated?name=${query.name}&region=${query.region}&page=1&page_size=1&update=true`);
        const json = await responseData.json();
        
        const data = JSON.parse(json);
    
        ranking = `${eloTranslateList[data.player_info.tier]}`;
        
        if(!['MASTER','GRANDMASTER','CHALLENGER'].includes(data.player_info.tier)) {
            ranking += ` - ${data.player_info.rank}`;
        }
    
        ranking += ` - ${data.player_info.leaguePoints} PDL`;

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(ranking);
        response.end();
    })();
}