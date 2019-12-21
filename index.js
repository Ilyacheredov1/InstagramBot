const ig = require('./instagram');

(async () => {

    await ig.initialize(false);  // argument false opens the browser, true does everything in the background

    await ig.login('', ''); // Your login and password to initialize

    await ig.collection('https://www.instagram.com/p/B6SvfibhgOn/', 300); // You need to specify the link of the post and the bot will collect an array of people who like it, the second argument is the length of the array

    await ig.likeProcess(900, 500); // first argument, number of likes, second number of subscriptions

})();

/*

This bot collects an array of people who like any post that you specify and goes to each page, puts likes or subscribes.

First you need the packages you need to install Nodejs and npm;

Then you need to install all the necessary packages.
npm i

Next, you need to install pm2 to work in the background.
npm install pm2 -g

start
pm2 start index.js

See logs
pm2 log 0

Be sure to specify this command if you want to stop working. Otherwise, it will work until you turn off the computer.
pm2 stop index.js

*/

