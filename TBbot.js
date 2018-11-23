

// Модули
const discord = require('discord.js');
var request = require('request');
request = request.defaults({jar: true})  // enable cookies
var fs = require('fs');

// Переменные
const hook = new discord.WebhookClient(process.env.hook_id, process.env.hook_token);
const client = new discord.Client();
const tb_email = process.env.tb_email;
const tb_pass = process.env.tb_pass;
const pf = '..';
var logbook = [];
var data_len = 0;


client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login(process.env.bot_token);

load_table();




function wh_send(index){
    var i = 0;
    var msg = '';
    msg += '`∙ ∙ ∙ ∙ ';
    for (i = Math.ceil(logbook[index].name.length/2); i <= 18; i++) { msg += ' '; }
    msg += logbook[index].name
    for (i = Math.floor(logbook[index].name.length/2); i <= 18; i++) { msg += ' '; }
    msg += '                   ∙ ∙ ∙ ∙`\n';
    msg += '`∙                                                                      ∙`\n';
    msg += '`∙ ';
    for (i = logbook[index].damage.length; i <= 5; i++) { msg += ' '; }
    msg += logbook[index].damage + ' %    ∙`:package:`∙ ';
    for (i = Math.ceil(logbook[index].cargo.length/2); i <= 14; i++) { msg += ' '; }
    msg += logbook[index].cargo
    for (i = Math.floor(logbook[index].cargo.length/2); i <= 14; i++) { msg += ' '; }
    msg += ' ∙`:package:`∙ ';
    for (i = logbook[index].weight.length; i <= 6; i++) { msg += ' '; }
    msg += logbook[index].weight + ' kg  ∙`\n';
    msg += '`∙                                                                      ∙`\n';
    msg += '`∙`:arrow_upper_right:`∙ ' + logbook[index].from;
    for (i = logbook[index].from.length; i <= 19; i++) { msg += ' '; }
    msg += ' ∙` `∙';
    for (i = logbook[index].distance.length; i <= 5; i++) { msg += ' '; }
    msg += logbook[index].distance + ' km ∙` `∙ ';
    for (i = logbook[index].to.length; i <= 19; i++) { msg += ' '; }
    msg += logbook[index].to + ' ∙`:arrow_lower_left:`∙`\n';
    msg += '`∙                                                                      ∙`\n';
    msg += '`∙ ∙`:star:`∙ ';
    for (i = logbook[index].xp.length; i <= 5; i++) { msg += ' '; }
    msg += logbook[index].xp + '   ∙`:euro:`∙ ';
    for (i = logbook[index].profit.length; i <= 6; i++) { msg += ' '; }
    msg += logbook[index].profit + '   ∙`:fuelpump:`∙ ';
    for (i = logbook[index].avg_cons.length; i <= 5; i++) { msg += ' '; }
    msg += logbook[index].avg_cons + '   ∙`:chart_with_upwards_trend:`∙ '
    for (i = logbook[index].points.toFixed(2).length; i <= 5; i++) { msg += ' '; }
    msg += logbook[index].points.toFixed(2) + '   ∙` `∙ ∙`';
    
    hook.send(msg,
        {
            code: false,
            embeds:[{
                color: 16758528,
                footer: {text:'Euro Truck Simulator 2',icon_url:'https://trucksbook.eu/data/system/icon_ets2.png'},
                timestamp: Date.now(),
            }]
        }
    ).then(setTimeout(onFulfilled, 5000, index));
}

function onFulfilled(ind){
    if (ind < logbook.length-1) {
        wh_send(ind+1);
    }
}


function load_table(){
    fs.exists('file.csv', function(exf){
        if (exf) {
            fs.readFile('file.csv',
                function(err, data){
                    if (err == null) {
                        data = data.toString();
                        lb_parse(data);
                        setInterval( chek_tbsite, 120000);
                    }
                }
            );
        } else {
            data_len = 0;
            chek_tbsite();
            setInterval( chek_tbsite, 120000);
        }
    })
}

function chek_tbsite(){
    request.post({     // запрос авторизации
            url:'https://trucksbook.eu/components/notlogged/login.php?go=', 
            form: {email: tb_email, pass: tb_pass},
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
                            wh_send(lb_count);
                            fs.writeFile('file.csv', body, function(err) {} );
                        }
                    }
                );
            }
        }
    );
}

function getcsvurl(){
    var cdate = new Date();
    var td = cdate.getDate();
    var th = cdate.getHours();
    var tm = cdate.getMinutes();
    var ts = cdate.getSeconds();
    if (td < 10) { td = '0' + td; }
    if (th < 10) { th = '0' + th; }
    if (tm < 10) { tm = '0' + tm; }
    if (ts < 10) { ts = '0' + ts; }
    var sdate = cdate.toISOString();
    var sd1 = sdate.slice(0,8) +'01T00:00:00.00+03:00';
    var sd2 = sdate.slice(0,8) +td+'T'+th+':'+tm+':'+ts+'.00+03:00';
    return 'https://trucksbook.eu/csv/'+Math.floor(Date.parse(sd1)/1000)+'/'+Math.floor(Date.parse(sd2)/1000);
}

function lb_parse(data){
    var t1, t2;     // temp array
    var job = {};
    var tpnts;
    data_len = data.length;
    logbook = [];
    data = data.replace(/"| kph| km| kg| l|\/100km| €|€|/g, ''); 
    t1 = data.split('\n');
    t1.splice(0,2);
    t1.splice(-1,1);
    t1.forEach(element => {
        t2 = element.split(',');
        t2[7]=t2[7].replace(' ', '');
        t2[9]=t2[9].replace(' ', '');
        t2[11]=t2[11].replace(' ', '');
        tpnts = t2[9]/500 + t2[11]/25000 + t2[6]/5000 - t2[5]*0.1;
        if (tpnts < 0 ) { tpnts = 0; }
        job = {
            name      :  t2[0],
            game      :  t2[1],
            from      :  t2[2],
            to        :  t2[3],
            cargo     :  t2[4],
            damage    :  t2[5],
            xp        :  t2[6],
            profit    :  t2[7],
            max_speed :  t2[8],
            distance  :  t2[9],
            offences  :  t2[10],
            weight    :  t2[11],
            avg_cons  :  t2[12],
            refueled  :  t2[13],
            fuel_cost :  t2[14],
            points    :  tpnts
        };
        logbook.push(job);
    });
    //fs.writeFile('f2.csv', JSON.stringify(logbook,null,2));
}
