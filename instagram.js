const puppeteer = require("puppeteer");

const BASE_URL =
  "https://www.instagram.com/accounts/login/?hl=ru&source=auth_switcher";
let referencePage;
let ref = [];
let filtRef = [];
let sub = 0;


const instagram = {
  browser: null,
  page: null,

  test: async () => {},

  initialize: async arg => {
    instagram.browser = await puppeteer.launch({
      headless: arg
    });

    instagram.page = await instagram.browser.newPage();
  },

  login: async (username, password) => {
    page = username;

    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

    await instagram.page.setExtraHTTPHeaders({
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8"
    });

    await instagram.page.waitFor(5000);

    //await instagram.page.waitFor(300000);

    await instagram.page.waitFor('input[name="username"]');
    await instagram.page.waitFor('input[name="password"]');

    await instagram.page.type('input[name="username"]', username, {
      delay: 100
    });
    await instagram.page.type('input[name="password"]', password, {
      delay: 100
    });

    loginButton = await instagram.page.$x("//button");
    await loginButton[1].click();
    //if (await instagram.page.$('#react-root > section > div > div > div.ZpgjG._1I5YO > h2'))
    await instagram.page.waitFor(10000);

    if (
      await instagram.page.$(
        "#react-root > section > div > div > div.ZpgjG._1I5YO > h2"
      )
    ) {
      console.log("not open!!!");
      await instagram.page.waitFor(60000);
    }

    await instagram.page.waitFor(15000);
    //await instagram.page.waitFor('a > span[aria-label="Профиль"]');
  },

  collection: async (post, howMush) => {
    let count = 0;


    function unique(arr) {
      var result = [];

      nextInput: for (var b = 0; b < arr.length; b++) {
        var str = arr[b]; // для каждого элемента
        for (var j = 0; j < result.length; j++) {
          // ищем, был ли он уже?
          if (result[j] == str) continue nextInput; // если да, то следующий
        }
        result.push(str);
      }

      return result;
    }

    await instagram.page.goto(post, { waitUntil: "networkidle2" });
    await instagram.page.waitFor(30000);

    //await instagram.page.waitFor(".zV_Nj");
    let listOfLikes = await instagram.page.$("#react-root > section > main > div > div > article > div.eo2As > section.EDfFK.ygqzn > div > div > button");
    await listOfLikes.click();
    await instagram.page.waitFor(3000);
    await instagram.page.waitFor(".Igw0E.IwRSH.eGOV_.vwCYk.i0EQd");

    for (let i = 0; i < howMush; i++) {
      await instagram.page.evaluate(
        `document.querySelectorAll('.Igw0E.IwRSH.eGOV_.vwCYk.i0EQd')[0].querySelector('div').scrollBy(0, -1)`
      );
      await instagram.page.evaluate(
        `document.querySelectorAll('.Igw0E.IwRSH.eGOV_.vwCYk.i0EQd')[0].querySelector('div').scrollBy(0, 60)`
      );
      await instagram.page.waitFor(10);

      let link = await instagram.page.$$("._7UhW9.xLCgt.MMzan.KV-D4.fDxYl a");
      let hrefValue = await (await link[0].getProperty("href")).jsonValue(); //!!!!!!!!!!
      //console.log(hrefValue)
      ref.push(hrefValue);
      await instagram.page.waitFor(10);
      count++;
      console.log(`${count}: ${ref[i]}`);
      await instagram.page.waitFor(150);
      //дико зависит от времени, если ставить слишком быстро то не успевает обноваляться
    }

    for (let y = 0; y < 5; y++) {
      //убирает первые 5 лишних
      ref.shift();
    }
    console.log(ref.length);
    filtRef = unique(ref);

    await instagram.page.waitFor(500);

    console.log(filtRef.length);
  },

  likeProcess: async (maxLikes, maxSub) => {

    let likes = 0;
    let comments = 0;


    for (let i = 0; i < filtRef.length; i++) {
      try {
        await instagram.page.goto(filtRef[i]); //{ waitUntil: 'networkidle2' });
        let random = Math.round(Math.random() * 10);
        await instagram.page.waitFor(8000 + random);


        //private
        if (await instagram.page.$('#react-root > section > main > div > div > article > div._4Kbb_._54f4m > div > h2')){

          if (sub < maxSub) {
    
            await instagram.page.waitFor(2000);
            if (await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > button')){
      
              let subscribe = await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > button');
              await subscribe.click();
              sub += 1;
              await console.log(`subscribe: ${sub}`);
              await instagram.page.waitFor(2000);
              if (sub > 990) {
                break;
              }
            }  
          }
        }

        //no post
        if ( await instagram.page.$('#react-root > section > main > div > div._2z6nI > article > div.Igw0E.rBNOH.eGOV_._4EzTm > div > div.FuWoR.-wdIA.A2kdl._0mzm-')){

          if (sub < maxSub) {

            await instagram.page.waitFor(2000);
            if (await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button')){
              let subscribe = await instagram.page.$('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button');
              subscribe.click();
              sub += 1;
              console.log(`subscribe: ${sub}`);
              await instagram.page.waitFor(2000);
              if (sub > 990) {
                break;
              }
            }
          }  
        }

        //likes and comments
        if (await instagram.page.$("div.v1Nh3.kIKUG._bz0w")) {
          let photo = await instagram.page.$("div.v1Nh3.kIKUG._bz0w");
          await photo.click();
          //await console.log('on page');
          await instagram.page.waitFor(8000);

          //await instagram.page.waitFor('.glyphsSpriteHeart__outline__24__grey_9[aria-label="Нравится"]' || '.glyphsSpriteHeart__filled__24__red_5');
          if (
            await instagram.page.$(
              'span.glyphsSpriteHeart__outline__24__grey_9.u-__7[aria-label="Like"]'
            )
          ) {

            //comments

            // if (likes % 18 == 0) {
            //   let rand = Math.round(Math.random() * 21);
            //   let smile;

            //   if (rand == 1) {
            //     smile = "😍";
            //   } else if (rand == 2) {
            //     smile = "😍😍";
            //   } else if (rand == 3) {
            //     smile = "😍😍😍";
            //   } else if (rand == 4) {
            //     smile = "😘";
            //   } else if (rand == 5) {
            //     smile = "😘😘";
            //   } else if (rand == 6) {
            //     smile = "😘😘😘";
            //   } else if (rand == 7) {
            //     smile = "😻";
            //   } else if (rand == 8) {
            //     smile = "😻😻";
            //   } else if (rand == 9) {
            //     smile = "😻😻😻";
            //   } else if (rand == 10) {
            //     smile = "❤";
            //   } else if (rand == 11) {
            //     smile = "❤❤";
            //   } else if (rand == 12) {
            //     smile = "❤❤❤";
            //   } else if (rand == 13) {
            //     smile = "😋";
            //   } else if (rand == 14) {
            //     smile = "😋😋";
            //   } else if (rand == 15) {
            //     smile = "😋😋😋";
            //   } else if (rand == 16) {
            //     smile = "💪";
            //   } else if (rand == 17) {
            //     smile = "💪💪";
            //   } else if (rand == 18) {
            //     smile = "💪💪💪";
            //   } else if (rand == 19) {
            //     smile = "🔥";
            //   } else if (rand == 20) {
            //     smile = "🔥🔥";
            //   } else if (rand == 21) {
            //     smile = "🔥🔥🔥";
            //   }
            
            //   console.log(smile);

            //   await instagram.page.type(
            //     "body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > textarea",
            //     smile,
            //     { delay: 100 }
            //   );
            //   if (
            //     await instagram.page.$(
            //       "body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > button"
            //     )
            //   ) {
            //     let submit = await instagram.page.$(
            //       "body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > button"
            //     );
            //     await instagram.page.waitFor(1000);
            //     await submit.click();
            //     await instagram.page.waitFor(3000);
            //     comments++;
            //     console.log(`comments: ${comments}`);
            //   }
            // }
            //console.log('if work')
            if (likes < maxLikes) {

            let like = await instagram.page.$(
              'span.glyphsSpriteHeart__outline__24__grey_9.u-__7[aria-label="Like"]'
            );
            await like.click();
            likes += 1;
            console.log(`likes: ${likes}`);
            await instagram.page.waitFor(1000);

            } else if (likes >= maxLikes && sub >= maxSub) {

              console.log("All over");
              break;

            } else {
              continue;
            }
 
          }
        }
      } catch (e) {
        console.log("error");
        await instagram.page.waitFor(10000);
      }
    }
    console.log("All over");
  },

  unsubscribe: async () => {
    let subs = 0;
    let mySubts = 0;
    let unSubs = 0;
    let subRef = [];
    let subscriptionsRef = [];
    let subFiltRef = [];

    let referencePage =  `https://www.instagram.com/${page}/`

    let post  = referencePage;


    function unique(arr) {
      let result = [];

      nextInput: for (var b = 0; b < arr.length; b++) {
        var str = arr[b]; // для каждого элемента
        for (var j = 0; j < result.length; j++) {
          // ищем, был ли он уже?
          if (result[j] == str) continue nextInput; // если да, то следующий
        }
        result.push(str);
      }

      return result;
    }

    

    await instagram.page.goto(post, { waitUntil: "networkidle2" });
    await instagram.page.waitFor(10000);

    let howMuch1 = await instagram.page.$eval(
      "#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span",
      element => {
        return element.innerHTML;
      }
    );

    let arrHowMuch = howMuch1.split("");
    if (arrHowMuch.length == 5) {
      delete arrHowMuch[1];
    }

    let howMuch = arrHowMuch.join("");
    console.log(howMuch);
    await instagram.page.waitFor(1000);

    let mySub1 = await instagram.page.$eval(
      "#react-root > section > main > div > header > section > ul > li:nth-child(3) > a > span",
      element => {
        return element.innerHTML;
      }
    );

    let arrMySub = mySub1.split("");
    if (arrMySub.length == 5) {
      delete arrMySub[1];
    }

    let mySub = arrMySub.join("");
    console.log(mySub);

    let list = await instagram.page.$(
      "#react-root > section > main > div > header > section > ul > li:nth-child(2) > a"
    );
    await list.click();
    await instagram.page.waitFor(5000);

    for (let i = 0; i < howMuch; i++) {
      try {
        await instagram.page.evaluate(
          `document.querySelector('body > div.RnEpo.Yx5HN > div > div.isgrP').scrollBy(0, -1)`
        );
        await instagram.page.evaluate(
          `document.querySelector('body > div.RnEpo.Yx5HN > div > div.isgrP').scrollBy(0, 60)`
        );
        await instagram.page.waitFor(10);

        let link = await instagram.page.$$(".FPmhX.notranslate._0imsa ");
        let hrefValue = await (await link[i].getProperty("href")).jsonValue(); //!!!!!!!!!!
        //console.log(hrefValue)
        subRef.push(hrefValue);
        await instagram.page.waitFor(100);
        subs++;
        console.log(`${i}: ${subRef[i]}`);
        await instagram.page.waitFor(350);
        //дико зависит от времени, если ставить слишком быстро то не успевает обноваляться
      } catch (e) {
        console.log("error");
        await instagram.page.waitFor(1050);
      }
    }

    console.log(subRef.length);
    subFiltRef = unique(subRef);

    await instagram.page.waitFor(500);

    console.log(subFiltRef.length);

    await instagram.page.waitFor(1000);
    await instagram.page.goto(post, { waitUntil: "networkidle2" });
    await instagram.page.waitFor(7000);

    let mySubscriptions = await instagram.page.$(
      "#react-root > section > main > div > header > section > ul > li:nth-child(3) > a"
    );
    mySubscriptions.click();
    await instagram.page.waitFor(3000);

    for (let i = 0; i < mySub; i++) {
      try {
        await instagram.page.evaluate(
          `document.querySelector('body > div.RnEpo.Yx5HN > div > div.isgrP').scrollBy(0, -1)`
        );
        await instagram.page.evaluate(
          `document.querySelector('body > div.RnEpo.Yx5HN > div > div.isgrP').scrollBy(0, 60)`
        );
        await instagram.page.waitFor(10);

        let link = await instagram.page.$$(".FPmhX.notranslate._0imsa ");
        let hrefValue = await (await link[i].getProperty("href")).jsonValue(); //!!!!!!!!!!
        //console.log(hrefValue)
        subscriptionsRef.push(hrefValue);
        await instagram.page.waitFor(100);
        mySubts++;
        console.log(`${mySubts}: ${subscriptionsRef[i]}`);
        await instagram.page.waitFor(350);
        //дико зависит от времени, если ставить слишком быстро то не успевает обноваляться
      } catch (e) {
        console.log("error");
        await instagram.page.waitFor(1050);
      }
    }

    console.log(subscriptionsRef.length);
    subscriptionsFiltRef = unique(subscriptionsRef);

    console.log(subscriptionsFiltRef.length);

    if (subscriptionsFiltRef.length != mySub) {
      console.log("not same!");
    }

    function filtSub(arr1, arr2) {
      let result = [];

      nextInput: for (var b = 0; b < arr2.length; b++) {
        var str = arr2[b]; // для каждого элемента
        for (var j = 0; j < arr1.length; j++) {
          // ищем, был ли он уже?
          if (arr1[j] == str) continue nextInput; // если да, то следующий
        }
        result.push(str);
      }

      return result;
    }

    let res = filtSub(subFiltRef, subscriptionsFiltRef);
    await instagram.page.waitFor(1000);

    console.log(res.length);

    for (let y = 0; y < res.length; y++) {
      try {
        await instagram.page.goto(res[y]); //{ waitUntil: 'networkidle2' });
        let random = Math.round(Math.random() * 10);
        await instagram.page.waitFor(8000 + random);

        if (
          await instagram.page.$(
            "#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button"
          )
        ) {
          let unSub = await instagram.page.$(
            "#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button"
          );
          await unSub.click();
          await instagram.page.waitFor(5000);

          if (
            await instagram.page.$(
              "body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_"
            )
          ) {
            let unFollow = await instagram.page.$(
              "body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_"
            );
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
  }
};

module.exports = instagram;
