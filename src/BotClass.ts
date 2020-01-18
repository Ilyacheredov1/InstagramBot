import puppeteer from 'puppeteer'
import { selectors, commentsArray, BASE_URL } from './datas'


class BotClass {
    protected browser: puppeteer.Browser
    protected page: puppeteer.Page;
    private pagesHrefs: Set<string> = new Set;
    private pageOfMaster: string;

    constructor() {
    }


    public init = async (headless: boolean) => {

        this.browser = await puppeteer.launch({
            headless,
            devtools: false,
            defaultViewport: {
                height: 760,
                width: 1050,
            },
        });

        this.page = await this.browser.newPage();

    }


    public finish = async () => {
        console.log('Browser was closed');
        await this.browser.close();
    }


    protected clickButton = async (selector: string, timeout: number = 15000) => {
        const button = await this.page.waitForSelector(selector, {
            timeout
        });
        await button.click();
    }


    protected goToPage = async (href: string) => {
        await this.page.goto(href, {
            timeout: 30000,
            waitUntil: ['domcontentloaded', 'networkidle0', 'networkidle2']
        });
    }


    protected knowInnerText = async (href: string) => {
        return await this.page.$eval(
            href,
            (element: any) => element.innerText
        );
    }


    protected typeText = async (message: string, selector: string) => {
        await this.page.waitForSelector(selector);
        await this.page.type(selector, message, { delay: 10 });
    }


    public login = async (username: string, password: string) => {

        if (!username || !password) {
            console.log('Dont indicated login or password');
            this.finish();
        }

        this.pageOfMaster = username;

        await this.goToPage(BASE_URL);
        await this.page.setExtraHTTPHeaders({ "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8" });

        await this.typeText(username, selectors.loginField);
        await this.typeText(password, selectors.passwordField);

        await this.clickButton(selectors.loginButton);
        await this.page.waitFor(5000);

        if (await this.page.$("#react-root > section > div > div > div.ZpgjG._1I5YO > h2")) {
            console.log("not open!");
            await this.page.waitFor(60000);
        }

        if (await this.page.$(selectors.dontRightLoginOrPassword)) {
            console.log('wrong login or password');
            await this.finish();
        }

        if (await this.page.$(selectors.successLogin)) {
            console.log('Success login');
        }

    }


    protected collectInWindow = async (howMuch: number, selector: string, linkSelector: string) => {

        const references: Set<string> = new Set;

        for (let i = 1; i <= howMuch + ~~(howMuch * 0.1); i++) {
            try {

                await this.page.evaluate(`${selector}.scrollBy(0, -1)`);
                await this.page.evaluate(`${selector}.scrollBy(0, 60)`);
                await this.page.waitFor(10);

                let link = await this.page.$$(linkSelector);
                let hrefValue: string;

                if (linkSelector === "._7UhW9.xLCgt.MMzan.KV-D4.fDxYl a") {
                    // @ts-ignore
                    hrefValue = await (await link[0].getProperty("href")).jsonValue();
                } else {
                    //@ts-ignore
                    hrefValue = await (await link[i].getProperty("href")).jsonValue();
                }

                references.add(hrefValue);
                console.log(`${i}: ${hrefValue}`);
                await this.page.waitFor(150);
                //дико зависит от времени, если ставить слишком быстро то не успевает обновляться

            } catch (err) {
                console.log('error = ', err);
                await this.page.waitFor(500);
            }
        }

        console.log("references.size = ", references.size);
        return references
    }


    public collection = async (post: string, howMuch: number = 0) => {

        await this.goToPage(post);

        await this.clickButton(selectors.subscibersOnPostButton)
        await this.page.waitForSelector(".Igw0E.IwRSH.eGOV_.vwCYk.i0EQd");

        this.pagesHrefs = await this.collectInWindow(
            howMuch,
            `document.querySelectorAll('.Igw0E.IwRSH.eGOV_.vwCYk.i0EQd')[0].querySelector('div')`,
            `._7UhW9.xLCgt.MMzan.KV-D4.fDxYl a`
        );

    }


    public likeProcess = async (maxLikes: number = 0, maxSub: number = 0) => {

        let subscr: number = 0;
        let likes: number = 0;
        let comments: number = 0;

        const subscribe = async () => {
            if (subscr > 990) {
                console.log('dont can subscribe on more then 1000 people, its will lead to ban');
            } else {
                await this.clickButton(selectors.subscribeButton);
                await this.page.waitFor(1000);
                subscr++;
                console.log(`subscribe: ${subscr}`);
            }
        }

        const pagesHrefs = [...this.pagesHrefs];

        for (let i = 0; i < pagesHrefs.length; i++) {
            try {

                await this.goToPage(pagesHrefs[i])

                if (i !== 0) {
                    // искуственная задержка
                    await this.page.waitFor(5000 + (Math.random() * 10000));
                }

                //private 
                if (subscr < maxSub && await this.page.$(selectors.selectorOfPrivatePage)) {
                    await subscribe();
                }

                //no post
                if (subscr < maxSub && await this.page.$(selectors.selectorOfEmptyPage)) {
                    await subscribe();
                }

                //likes and comments
                if (await this.page.$("div.v1Nh3.kIKUG._bz0w")) {

                    await this.clickButton('div.v1Nh3.kIKUG._bz0w')
                    await this.page.waitFor(1000);

                    // //comments
                    // if (likes % 20 === 0) {

                    //     let smile: string = commentsArray[~~(Math.random() * commentsArray.length)];
                    //     await this.typeText(smile, selectors.textAreaComment);

                    //     if (await this.page.$(selectors.sendCommentButton)) {
                    //         await this.clickButton(selectors.sendCommentButton);
                    //         await this.page.waitFor(1000);
                    //         comments++;
                    //         console.log(`comments: ${comments}`);
                    //     }
                    // }

                    if (likes < maxLikes) {

                        await this.clickButton(selectors.likeButton);
                        likes++;
                        console.log(`likes: ${likes}`);
                        await this.page.waitFor(1000);

                    } else if (likes >= maxLikes && subscr >= maxSub) {
                        console.log("All over");
                        this.finish();
                    }

                }

            } catch (e) {
                console.log("error = ", e);
                await this.page.waitFor(10000);
            }
        };

        console.log("All over");

    }


    public unsubscribe = async (countUnsub: number = 0) => {

        let unsubIndex = 0;
        const pageHref = `https://www.instagram.com/${this.pageOfMaster}/`;

        await this.goToPage(pageHref)
        await this.clickButton(selectors.subscibersListButton);
        await this.page.waitForNavigation();

        const unsubInWindow = async () => {
            for (let y = 0; y < 11; y++) {
                try {

                    // искусственная задержка
                    const random = ~~(Math.random() * 20000);
                    await this.page.waitFor(random);
                    await this.clickButton(`body > div.RnEpo.Yx5HN > div > div.isgrP > ul > div > li:nth-child(${y + 1}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                    await this.page.waitFor(1000);
                    await this.clickButton(selectors.unfollowButtonInWindow);
                    unsubIndex++;
                    console.log('Unsubscribe ', unsubIndex);

                } catch (err) {
                    console.log('error = ', err);
                    await this.page.waitFor(10000);
                }
            };
        };


        for (let i = 0; unsubIndex < countUnsub; i++) {

            await unsubInWindow();

            await this.page.evaluate(`location.reload()`);
            await this.page.waitFor(5000);
            await this.clickButton('main > div > header > section > ul > li:nth-child(3) > a');

        }

    }


}



export default BotClass;