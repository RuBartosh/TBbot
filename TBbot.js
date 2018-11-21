
// Переменные окружения
const hook_id = process.env.hook_id;
const hook_token = process.env.hook_token;

// Модули
const discord = require('discord.js');
const hook = new discord.WebhookClient('507601898212425756', 'NkFxq_JQCkmI9ycs26dmC6uuISfEYelt_idc3h9xYNAuOBTn1Nf0Dht9qsShnBh_64hc');
var fs = require('fs');
var request = require('request');
var gm = require('gm');

// Переменные
var logbook = [];
var data_len = 0;


load_table();




function imgsend(ind){
    var p1 = Math.floor(logbook[ind].points*30);
    if (p1 > 250) { p1 = 250; }
    var p2 = 200 - p1;
    if (p2 < 50) { p2 = 50; }
    p1 = p1.toString(16);
    p2 = p2.toString(16);
    gm('img\\fon1.jpg')
        // НикНейм
        .font("fonts\\anastasiascript.ttf", 72)
        .fill('#E0E0E0')
        .drawText(380-(15*logbook[ind].name.length), 58, logbook[ind].name)
        // Название груза
        .font('fonts\\aghelveticacyr_roman.ttf', 24)
        .fill('#EAB20F')
        .drawText(425-(7*logbook[ind].cargo.length), 98, logbook[ind].cargo+' ('+Math.round(logbook[ind].weight/1000)+'т)')
        // Город отправления
        .font('fonts\\aghelveticacyr_boldoblique.ttf', 18)
        .fill('#CCCCCC')
        .drawText(420-(10*logbook[ind].from.length), 125, logbook[ind].from)
        // Город получения
        .font('fonts\\aghelveticacyr_boldoblique.ttf', 18)
        .fill('#CCCCCC')
        .drawText(484, 125, logbook[ind].to)
        // Профит
        .font('font\\aggalleon_bold.ttf', 24)
        .fill('#77AA66')
        .drawText(552-(6*logbook[ind].profit.length), 162, logbook[ind].profit)
        // Профит за 1 км
        .font('font\\aggalleon_bold.ttf', 18)
        .fill('#779966')
        .drawText(536-(4*logbook[ind].profit.length), 182, (logbook[ind].profit/logbook[ind].distance).toFixed(2) + '/km')
        // Расстояние
        .font('font\\aggalleon_roman.ttf', 20)
        .fill('#999999')
        .drawText(185, 160, 'Расстояние:')
        .font('aggalleon_bold.ttf', 20)
        .fill('#C0C0C0')
        .drawText(300, 160, logbook[ind].distance + ' km' )
        // Вес груза
        .font('font\\aggalleon_roman.ttf', 20)
        .fill('#999999')
        .drawText(185, 182, 'Вес груза:')
        .font('font\\aggalleon_bold.ttf', 20)
        .fill('#C0C0C0')
        .drawText(300, 182, logbook[ind].weight + ' kg' )
        // Опыт
        .font('font\\aggalleon_bold.ttf', 16)
        .fill('#999999')
        .drawText(625, 151, 'EXP')
        .fill('#C0C0C0')
        .drawText(665, 151, logbook[ind].xp)
        // Макс. Скорость
        .font('font\\aggalleon_bold.ttf', 16)
        .fill('#999999')
        .drawText(625, 170, 'SPD')
        .fill('#C0C0C0')
        .drawText(665, 170, logbook[ind].max_speed +' км/ч')
        // Средний расход топлива
        .font('font\\aggalleon_bold.ttf', 16)
        .fill('#999999')
        .drawText(625, 188, 'AVG')
        .fill('#C0C0C0')
        .drawText(665, 188, logbook[ind].avg_cons +'л.')
        // Картинка груза
        .draw('image Over 0,65 166,135 img\\cargo_uksus.jpg')
        // Урон
        .font('font\\aggalleon_bold.ttf', 16)
        .fill('#CC8877')
        .drawText(145-(5*logbook[ind].damage.length), 192, logbook[ind].damage + '%')
        // Баллы
        .font('font\\aggalleon_bold.ttf', 36)
        .fill('#'+p2+p1+'33')
        .drawText(650, 58, logbook[ind].points.toFixed(2))
        .font('font\\aggalleon_bold.ttf', 20)
        .fill('#388000')
        .drawText(670, 22, '---.--')
        // Буфферизация и отправка в дискорд
        .toBuffer('PNG', function(err, buffer){
            if (err) {
                console.log(err);
            } else {
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
            }
        })
    // gm-end
}

function wh_send(num){
    var index = logbook.length-num;
    for (index; index < logbook.length; index++) {
        imgsend(index);
    }
}

function load_table(){
    fs.readFile('file.csv',
         function(err, data){
            if (err == null) {
                data = data.toString();
                lb_parse(data);
                setInterval( chek_tbsite, 60000);
                //imgsend(Math.floor(Math.random()*15));
            }
        }
    );
}

function chek_tbsite(){
    const tb_email = process.env.tb_email;
    const tb_pass = process.env.tb_pass;
    request = request.defaults({jar: true})     // enable cookies
    request.post({     // запрос авторизации
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
                            fs.writeFile('file.csv', body, function(err) {} );
                        }
                        else{
                            //imgsend(Math.floor(Math.random()*15));
                            var a = Math.floor(Math.random()*15);
                            imgsend(a);
                            hook.send(
                                    logbook[a].cargo + '\n' +
                                    logbook[a].from + '\n' +
                                    logbook[a].distance + '\n' +
                                    logbook[a].to + '\n' +
                                    logbook[a].profit + '\n' +
                                    logbook[a].weight + '\n' +
                                    logbook[a].points + '\n'
                                );
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


