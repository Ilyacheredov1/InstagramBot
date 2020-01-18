export const BASE_URL = "https://www.instagram.com/accounts/login/?hl=ru&source=auth_switcher";


interface ISelectors {
    loginField: string,
    passwordField: string,
    loginButton: string,
    dontRightLoginOrPassword: string
    successLogin: string
    subscibersOnPostButton: string,
    subscribeButton: string,
    selectorOfPrivatePage: string,
    selectorOfEmptyPage: string
    textAreaComment: string
    likeButton: string,
    sendCommentButton: string,
    subscibersListButton: string
    unfollowButtonInWindow: string

};

export const selectors: ISelectors = {
    loginField: 'input[name="username"]',
    passwordField: 'input[name="password"]',
    loginButton: '#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(4) > button > div',
    dontRightLoginOrPassword: '#slfErrorAlert',
    successLogin: 'div.SKguc > a',
    subscibersOnPostButton: '#react-root > section > main > div > div > article > div.eo2As > section.EDfFK.ygqzn > div > div > button',
    subscribeButton: 'main > div > header > section > div.nZSzR > button',
    selectorOfPrivatePage: '#react-root > section > main > div > div > article > div._4Kbb_._54f4m > div > h2',
    selectorOfEmptyPage: '#react-root > section > main > div > div._2z6nI > article > div.Igw0E.rBNOH.eGOV_._4EzTm > div > div.FuWoR.-wdIA.A2kdl._0mzm-',
    textAreaComment: 'body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > textarea',
    likeButton: 'span.fr66n > button',
    sendCommentButton: 'body > div._2dDPU.vCf6V > div.zZYga > div > article > div.eo2As > section.sH9wk._JgwE > div > form > button',
    subscibersListButton: 'main > div > header > section > ul > li:nth-child(3) > a',
    unfollowButtonInWindow: 'body > div:nth-child(19) > div > div > div.mt3GC > button.aOOlW.-Cab_',

};


export const commentsArray: string[] = [
    "😍", "😍😍", "😍😍😍",
    "😘", "😘😘", "😘😘😘",
    "😻", "😻😻", "😻😻😻",
    "❤", "❤❤", "❤❤❤",
    "😋", "😋😋", "😋😋😋",
    "💪", "💪💪", "💪💪💪",
    "🔥", "🔥🔥", "🔥🔥🔥",
];





