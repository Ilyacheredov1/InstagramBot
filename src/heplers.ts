export function saveCommonInTwoArrays(arr1: any[], arr2: any[]) {
    let result = [];

    nextInput: for (var b = 0; b < arr2.length; b++) {
        var str = arr2[b];
        for (var j = 0; j < arr1.length; j++) {
            if (arr1[j] == str) continue nextInput;
        }
        result.push(str);
    }

    return result;
}


export function parseStringCountSubscribes(str: string) {
    const strArr = str.split("").filter(it => it !== ',');
    let numberSubs = strArr.join('')
    console.log('numberSubs = ', numberSubs);
    return numberSubs;
}



