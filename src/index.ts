import BotClass from "./BotClass";

const bot = new BotClass;

; (async () => {

    await bot.init(false);  // argument false opens the browser, true does everything in the background

    await bot.login('', ''); // Your login and password to initialize

    // await bot.unsubscribe(100);

    await bot.collection('https://www.instagram.com/p/B7bpDjJB16U/', 300); // You need to specify the link of the post and the bot will collect an array of people who like it, the second argument is the length of the array

    await bot.likeProcess(200, 0); // first argument, number of likes, second number of subscriptions

    bot.finish();

})();

/*

This bot collects an array of people who like any post that you specify and goes to each page, puts likes or subscribes.

First you need to install Node.js and npm;

Then you need to install all the necessary packages.
"npm i"

After you need compile Typescript files to Javascript
"npm run b-w"

start
"npm run start"

start and dont stop even if you close console
"npm run start-forever"
See logs in forever mode
"npm run see-logs"
If you in forever mode be sure to specify this command if you want to stop working. Otherwise, it will work until you turn off the computer.
pm2 stop index.js

*/

