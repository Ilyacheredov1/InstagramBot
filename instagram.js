const puppeteer = require("puppeteer");
const helpers = require('./helpers')

const BASE_URL = "https://www.instagram.com/accounts/login/?hl=ru&source=auth_switcher";
let ref = [];
let filtRef = [];


const instagram = {
  browser: null,
  page: null,

  test: async () => {

  },

  initialize: async arg => {
    instagram.browser = await puppeteer.launch({ headless: arg });
    instagram.page = await instagram.browser.newPage();
  },

  login: async (username, password) => {
    page = username;

    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });
    await instagram.page.setExtraHTTPHeaders({ "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8" });

    await instagram.page.waitFor(5000);

    await instagram.page.waitFor('input[name="username"]');
    await instagram.page.waitFor('input[name="password"]');

    await instagram.page.type('input[name="username"]', username, { delay: 100 });
    await instagram.page.type('input[name="password"]', password, { delay: 100 });

    loginButton = await instagram.page.$x("//button");
    await loginButton[1].click();
    //if (await instagram.page.$('#react-root > section > div > div > div.ZpgjG._1I5YO > h2'))
    await instagram.page.waitFor(10000);

    if (await instagram.page.$("#react-root > section > div > div > div.ZpgjG._1I5YO > h2")) {
      console.log("not open!!!");
      await instagram.page.waitFor(60000);
    }

    await instagram.page.waitFor(15000);
    //await instagram.page.waitFor('a > span[aria-label="Профиль"]');
  },

  _collectInWindow: async (howMuch, selector, linkSelector) => {

    let references = [];

    for (let i = 0; i < howMuch; i++) {
      try {

        await instagram.page.evaluate(`${selector}.scrollBy(0, -1)`);
        await instagram.page.evaluate(`${selector}.scrollBy(0, 60)`);
        await instagram.page.waitFor(10);

        let link = await instagram.page.$$(linkSelector);

        let hrefValue;

        if (linkSelector === "._7UhW9.xLCgt.MMzan.KV-D4.fDxYl a") {
          hrefValue = await (await link[0].getProperty("href")).jsonValue();
        } else {
          hrefValue = await (await link[i].getProperty("href")).jsonValue();
        }

        references.push(hrefValue);
        await instagram.page.waitFor(10);
        console.log(`${i}: ${hrefValue}`);
        await instagram.page.waitFor(150);
        //дико зависит от времени, если ставить слишком быстро то не успевает обновляться

      } catch (err) {
        console.log('error = ', err);
        await instagram.page.waitFor(500);
      }
    }

    return references
  },

  collection: async (post, howMuch) => {

    await instagram.page.goto(post, { waitUntil: "networkidle2" });
    await instagram.page.waitFor(20000);

    let listOfLikes = await instagram.page.$("#react-root > section > main > div > div > article > div.eo2As > section.EDfFK.ygqzn > div > div > button");
    await listOfLikes.click();
    await instagram.page.waitFor(3000);
    await instagram.page.waitFor(".Igw0E.IwRSH.eGOV_.vwCYk.i0EQd");

    ref = await instagram._collectInWindow(
      howMuch,
      `document.querySelectorAll('.Igw0E.IwRSH.eGOV_.vwCYk.i0EQd')[0].querySelector('div')`,
      `._7UhW9.xLCgt.MMzan.KV-D4.fDxYl a`
    );

    console.log(ref.length);
    filtRef = helpers.unique(ref);
    await instagram.page.waitFor(500);
    console.log(filtRef.length);
  },

  likeProcess: async (maxLikes, maxSub) => {

    let sub = 0;
    let likes = 0;
    let comments = 0;

    async function subscribe(button) {
      await button.click();
      sub++;
      console.log(`subscribe: ${sub}`);
      await instagram.page.waitFor(2000);
      if (sub > 990) {
        console.log('dont can subscribe on more then 1000 people, its will lead to ban');
        await instagram.page.waitFor(Infinity);
      }
    }

    for (let i = 0; i < filtRef.length; i++) {
      try {
        await instagram.page.goto(filtRef[i]); //{ waitUntil: 'networkidle2' });
        let random = Math.round(Math.random() * 10);
        await instagram.page.waitFor(8000 + random);

        //private
        if (sub < maxSub && await instagram.page.$('#react-root > section > main > div > div > article > div._4Kbb_._54f4m > div > h2')) {
          await instagram.page.waitFor(2000);
          if (await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > button')) {
            const subscribeButton = await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > button');
            subscribe(subscribeButton)
          }
        }

        //no post
        if (sub < maxSub && await instagram.page.$('#react-root > section > main > div > div._2z6nI > article > div.Igw0E.rBNOH.eGOV_._4EzTm > div > div.FuWoR.-wdIA.A2kdl._0mzm-')) {
          await instagram.page.waitFor(2000);
          if (await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button')) {
            let subscribeButton = await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button');
            subscribe(subscribeButton);
          }
        }

        //likes and comments
        if (await instagram.page.$("div.v1Nh3.kIKUG._bz0w")) {
          let photo = await instagram.page.$("div.v1Nh3.kIKUG._bz0w");
          await photo.click();
          await instagram.page.waitFor(8000);

          //await instagram.page.waitFor('.glyphsSpriteHeart__outline__24__grey_9[aria-label="Нравится"]' || '.glyphsSpriteHeart__filled__24__red_5');
          if (await instagram.page.$('span.glyphsSpriteHeart__outline__24__grey_9.u-__7[aria-label="Like"]')) {

            //comments

            // if (likes % 18 === 0) {
            //   let rand = ~~(Math.random() * 21);
            //   let smile;

            //   const commentsArray = [
            //     "😍", "😍😍", "😍😍😍",
            //     "😘", "😘😘", "😘😘😘",
            //     "😻", "😻😻", "😻😻😻",
            //     "❤", "❤❤", "❤❤❤",
            //     "😋", "😋😋", "😋😋😋",
            //     "💪", "💪💪", "💪💪💪",
            //     "🔥", "🔥🔥", "🔥🔥🔥",
            //   ];

            //   smile = commentsArray[rand];
            //   console.log(smile);

            //   await instagram.page.type(
            //     "body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > textarea",
            //     smile,
            //     { delay: 100 }
            //   );
            //   if (await instagram.page.$("body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > button")) {
            //     let submit = await instagram.page.$("body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > button");
            //     await instagram.page.waitFor(1000);
            //     await submit.click();
            //     await instagram.page.waitFor(3000);
            //     comments++;
            //     console.log(`comments: ${comments}`);
            //   }
            // }

            if (likes < maxLikes) {

              let like = await instagram.page.$('span.glyphsSpriteHeart__outline__24__grey_9.u-__7[aria-label="Like"]');
              await like.click();
              likes += 1;
              console.log(`likes: ${likes}`);
              await instagram.page.waitFor(1000);

            } else if (likes >= maxLikes && sub >= maxSub) {

              console.log("All over");
              break;

            } else continue;
          }
        }
      } catch (e) {
        console.log("error = ", e);
        await instagram.page.waitFor(10000);
      }
    }
    console.log("All over");
  },

  unsubscribeCompare: async () => {
    let unSubs = 0;
    let subRef = [];
    let subscriptionsRef = [];
    let subFiltRef = [];

    let post = `https://www.instagram.com/${page}/`

    await instagram.page.goto(post, { waitUntil: "networkidle2" });
    await instagram.page.waitFor(10000);

    let howMuch1 = await instagram.page.$eval(
      "#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span",
      element => element.innerHTML
    );

    let howMuch = helpers.parseStringCountSubscribes(howMuch1);
    await instagram.page.waitFor(1000);

    let mySub1 = await instagram.page.$eval(
      "#react-root > section > main > div > header > section > ul > li:nth-child(3) > a > span",
      element => element.innerHTML
    );

    let mySub = instagram.parseStringCountSubscribes(mySub1);

    let list = await instagram.page.$("#react-root > section > main > div > header > section > ul > li:nth-child(2) > a");
    await list.click();
    await instagram.page.waitFor(5000);

    subRef = await instagram._collectInWindow(
      howMuch,
      `document.querySelector('body > div.RnEpo.Yx5HN > div > div.isgrP')`,
      `.FPmhX.notranslate._0imsa `
    );

    console.log(subRef.length);
    subFiltRef = helpers.unique(subRef);

    await instagram.page.waitFor(500);

    console.log(subFiltRef.length);

    await instagram.page.waitFor(1000);
    await instagram.page.goto(post, { waitUntil: "networkidle2" });
    await instagram.page.waitFor(7000);

    let mySubscriptions = await instagram.page.$("#react-root > section > main > div > header > section > ul > li:nth-child(3) > a");
    mySubscriptions.click();
    await instagram.page.waitFor(3000);

    subscriptionsRef = await instagram._collectInWindow(
      mySub,
      `document.querySelector('body > div.RnEpo.Yx5HN > div > div.isgrP')`,
      `.FPmhX.notranslate._0imsa `
    );

    console.log(subscriptionsRef.length);
    subscriptionsFiltRef = helpers.unique(subscriptionsRef);

    console.log(subscriptionsFiltRef.length);

    if (subscriptionsFiltRef.length != mySub) console.log("not same!");

    let res = helpers.saveCommonInTwoArrays(subFiltRef, subscriptionsFiltRef);
    await instagram.page.waitFor(1000);

    console.log(res.length);

    for (let y = 0; y < res.length; y++) {
      try {
        await instagram.page.goto(res[y]); //{ waitUntil: 'networkidle2' });
        let random = Math.round(Math.random() * 10);
        await instagram.page.waitFor(8000 + random);

        if (await instagram.page.$("#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button")) {
          let unSub = await instagram.page.$("#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button");
          await unSub.click();
          await instagram.page.waitFor(5000);

          if (await instagram.page.$("body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_")) {
            let unFollow = await instagram.page.$("body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_");
            await unFollow.click();
            await instagram.page.waitFor(2000);
            unSubs++;
            console.log(`unsubscribe: ${unSubs}`);
          }
        }
      } catch (e) {
        console.log("error");
        await instagram.page.waitFor(1000);
      }
    }
  },

  unsubscribe: async (countUnsub) => {

    let unsubIndex = 0;
    const pageHref = `https://www.instagram.com/${page}/`;

    await instagram.page.goto(pageHref, { waitUntil: "networkidle2" });
    await instagram.page.waitFor(10000);

    let mySubscriptionsButton = await instagram.page.$('main > div > header > section > ul > li:nth-child(3) > a');
    await mySubscriptionsButton.click();
    await instagram.page.waitFor(10000);


    for (let i = 0; unsubIndex <= countUnsub; i++) {
      try {

        for (let y = 0; y < 11; y++) {
          try {
            const random = ~~(Math.random() * 20000);
            await instagram.page.waitFor(random);
            const ButtonUnFollow = await instagram.page.$(`body > div.RnEpo.Yx5HN > div > div.isgrP > ul > div > li:nth-child(${y + 1}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
            ButtonUnFollow.click()
            await instagram.page.waitFor(1000);
            const ButtonUnFollowInWindow = await instagram.page.$(`body > div:nth-child(19) > div > div > div.mt3GC > button.aOOlW.-Cab_`);
            ButtonUnFollowInWindow.click()
            await instagram.page.waitFor(1000);

            unsubIndex++;
            console.log('Unsubscribe ', unsubIndex);

          } catch (err) {
            console.log('error = ', err);
            await instagram.page.waitFor(10000);
          }
        };

        await instagram.page.evaluate(`location.reload()`);
        await instagram.page.waitFor(5000);
        let mySubscriptionsButton = await instagram.page.$('main > div > header > section > ul > li:nth-child(3) > a');
        await mySubscriptionsButton.click();

      } catch (err) {
        console.log('error = ', err);
        await instagram.page.waitFor(10000);
      }
    }
  }

};


module.exports = instagram;
