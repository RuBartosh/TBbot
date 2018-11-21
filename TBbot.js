
// Переменные окружения
//const hook_id = process.env.hook_id;
//const hook_token = process.env.hook_token;

// Модули
import { WebhookClient } from 'discord.js';
import { readFile, writeFile } from 'fs';
//import request, { defaults, post } from 'request';

// Переменные
const hook = new WebhookClient('507601898212425756', 'NkFxq_JQCkmI9ycs26dmC6uuISfEYelt_idc3h9xYNAuOBTn1Nf0Dht9qsShnBh_64hc');
var logbook = [];
var data_len = 0;


load_table();




function wh_send(num){
    /*
    var index = logbook.length-num;
    for (index; index < logbook.length; index++) {
        //imgsend(index);
    }
    */

    /*
    var msg = 'Водитель ' + logbook[ind].name + 
                ' отвез груз\n' + logbook[ind].cargo + 
                ' (' + Math.round(logbook[ind].weight/1000) + 'Т)';
    if (logbook[ind].damage > 0) {
        msg += ' [ повредив его на ' + logbook[ind].damage + ' ]\n'
    }else{
        msg += '\n'
    }
    msg += 'из ' + logbook[ind].from + ' →(' + logbook[ind].distance + ' км)→  в ' + logbook[ind].to + '\n'+
                'Заработав ' + logbook[ind].profit + ' € и ' + logbook[ind].xp + ' опыта\n';
                //'Максимальная скорость ' + logbook[ind].max_speed + ' км/ч  |  средний расход топлива ' + logbook[ind].avg_cons +' литров на 100 км.';
    hook.send(msg, 
        {
            code: true,
            file: { attachment: buffer, name: logbook[ind].name+'.png' },
            embeds:[{
                color: 16758528,
                footer: {text:'Euro Truck Simulator 2',icon_url:'https://trucksbook.eu/data/system/icon_ets2.png'},
                timestamp: Date.now(),
            }]
        }
    )
    */
}

function load_table(){
    readFile('file.csv',
         function(err, data){
            if (err == null) {
                data = data.toString();
                lb_parse(data);
                //setInterval( chek_tbsite, 20000);
                wh_send(Math.floor(Math.random()*15));
            }
        }
    );
}
/*
function chek_tbsite(){
    //const tb_email = process.env.tb_email;
    //const tb_pass = process.env.tb_pass;
    request = defaults({jar: true})     // enable cookies
    post({     // запрос авторизации
            url:'https://trucksbook.eu/components/notlogged/login.php?go=', 
            form: {email:'bartosch@bk.ru', pass:'5mvBc26gEryuFD6'},
            headers: {'User-Agent': 'Discord-Bot'}
        }, 
        function( err, resp, body ){
            if (err == null) {
                request({
                        url: getcsvurl(),
                        headers: {'User-Agent': 'Discord-Bot'}
                    },
                    function(err,resp,body){
                        if (body.length > data_len) {
                            var lb_count = logbook.length;
                            lb_parse(body);
                            wh_send(logbook.length-lb_count);
                            writeFile('file.csv', body, function(err) {} );
                        }
                        else{
                            //var a = Math.floor(Math.random()*15);
                            / *
                            hook.send(
                                logbook[a].cargo + '\n' +
                                logbook[a].from + '\n' +
                                logbook[a].distance + '\n' +
                                logbook[a].to + '\n' +
                                logbook[a].profit + '\n' +
                                logbook[a].weight + '\n' +
                                logbook[a].points + '\n'
                                );
                            * /
                        }
                    }
                );
            }
        }
    );
}

function getcsvurl(){
    cdate = new Date();
    td = cdate.getDate();
    th = cdate.getHours()-2;
    tm = cdate.getMinutes();
    ts = cdate.getSeconds();
    if (td < 10) { td = '0' + td; }
    if (th < 10) { th = '0' + th; }
    if (tm < 10) { tm = '0' + tm; }
    if (ts < 10) { ts = '0' + ts; }
    sdate = cdate.toISOString();
    sd1 = sdate.slice(0,8) + '01T00:00:00.00+01:00';
    sd2 = sdate.slice(0,8) + td+'T'+th+':'+tm+':'+ts+'.00+01:00';
    return 'https://trucksbook.eu/csv/'+Math.floor(Date.parse(sd1)/1000)+'/'+Math.floor(Date.parse(sd2)/1000);
}
*/
function lb_parse(data){
    var t1, t2;     // temp array
    var job = {};
    var tpnts;
    data_len = data.length;
    logbook = [];
    data = data.replace(/"| kph| km| kg| l|\/100km| €|€|\s(?=[0-9])/g, ''); 
    t1 = data.split('\n');
    t1.splice(0,2);
    t1.splice(-1,1);
    t1.forEach(element => {
        t2 = element.split(',');
        tpnts = t2[9]/500 + t2[11]/25000 + t2[6]/5000 - t2[5]*0.1;
        if (tpnts < 0 ) { tpnts = 0; }
        job = {
            name      :  t2[ 0],
            game      :  t2[ 1],
            from      :  t2[ 2],
            to        :  t2[ 3],
            cargo     :  t2[ 4],
            damage    : +t2[ 5],
            xp        :  t2[ 6],
            profit    :  t2[ 7],
            max_speed :  t2[ 8],
            distance  :  t2[ 9],
            offences  :  t2[10],
            weight    :  t2[11],
            avg_cons  :  t2[12],
            refueled  :  t2[13],
            fuel_cost :  t2[14],
            points    :  tpnts
        };
        logbook.push(job);
    });
}


