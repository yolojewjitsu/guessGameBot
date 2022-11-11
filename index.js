const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require(`./options`);
// const token = "5694502809:AAFtQ65i9p36ck36O86RzaskKUn_77lqzbU";
const token = '5690505091:AAF1RNHIy9iZJ2CLyjDaSD1TXCUGHewV02k';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Now I will think of a number from 0 to 9, and you have to guess it!"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Guess", gameOptions);
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Initial greeting" },
    { command: "/info", description: "get user information" },
    { command: "/game", description: "guess the number game" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    console.log(msg);
    if (text === "/start") {
      bot.sendPhoto(chatId, "https://i.imgur.com/2ng1ged.png");
      bot.sendVideo(chatId, "https://i.imgur.com/eSq0Aun.mp4");
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `I don't understand you, try again`);
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    
    const chatId = msg.message.chat.id;
    if (data === `/again`) {
        return startGame(chatId)
    }
    if (data == chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Congratulations, you guessed the number ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Unfortunately you did not guess, the bot guessed the number ${chats[chatId]}`,
        againOptions
      );
    }

    console.log(msg);
  });
};

start();
