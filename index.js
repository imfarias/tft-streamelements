const fetch = require('node-fetch');
const http = require('http');
const url = require('url');

http.createServer(onRequest).listen(process.env.PORT || 8080);

function onRequest(request, response) {

    const url_parts = url.parse(request.url, true);
    const query = url_parts.query;

    eloTranslateListByRegion = {
        'br' : {
            'IRON': 'FERRO',
            'BRONZE': 'BRONZE',
            'SILVER': 'PRATA',
            'GOLD': 'OURO',
            'PLATINUM': 'PLATINA',
            'DIAMOND': 'DIAMANTE',
            'MASTER': 'MESTRE',
            'GRANDMASTER': 'GRÃO-MESTRE',
            'CHALLENGER': 'DESAFIANTE'
        }
    }

    if(
        !query
        || !query.name
        || !query.region
    ) {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.write('Não foi passado o Nome/Região do usuário');
        response.end();

        return;
    }

    let ranking = '';
    
    (async () => {
        const responseData = await fetch(`https://overwolf.kda.gg/retrieve_match_history_updated?name=${query.name}&region=${query.region}&page=1&page_size=1&update=true`);
        const json = await responseData.json();
        
        const data = JSON.parse(json);

        ranking = data.player_info;
            
        ranking = ranking.charAt(0).toUpperCase() + ranking.slice(1).toLowerCase();
        
        if(!['MASTER','GRANDMASTER','CHALLENGER'].includes(data.player_info.tier)) {
            ranking += ` ${data.player_info.rank}`;
        }
    
        ranking += ` (${data.player_info.leaguePoints} LP)`;

        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.write(ranking);
        response.end();
    })();

}