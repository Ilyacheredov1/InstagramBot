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

function saveCommonInTwoArrays(arr1, arr2) {
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

function parseStringCountSubscribes(str) {
    const strArr = str.split("").filter(it => it !== ',');
    let numberSubs = strArr.join('')
    console.log('numberSubs = ', numberSubs);
    return numberSubs;
}



module.exports = {
    unique,
    saveCommonInTwoArrays,
    parseStringCountSubscribes
}