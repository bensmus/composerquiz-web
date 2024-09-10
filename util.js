import lcs from 'node-lcs';

export function choice(array) {
    let randI = Math.floor(Math.random() * array.length)
    return [randI, array[randI]]
}

export function sample(array, count) {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        let currentIndex = array.length;
    
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
    
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }

    const copiedArray = [...array]
    shuffle(copiedArray)
    return copiedArray.slice(0, count)
}

// > maxBy(['asdf','qwe','asdf','qweqweqwe'], x=>x.length)
// < 'qweqweqwe'
export function maxBy(inputs, callback) {
    const callbackOutputs = inputs.map(input => callback(input))
    const maxIndex = callbackOutputs.indexOf(Math.max(...callbackOutputs))
    return inputs[maxIndex]
}

// Exact matches of substrings would be a good
// way to compare similarity between names of musical pieces.
// > repeatedLCS('A cat danced around the floor', 'A cat danced on the floor')
// len('A cat danced') + len('the floor')
// 12 + 9
// < 21
export function repeatedLcs(str1, str2) {
    function removeSubstr(str, substr) {
        const offset = str.indexOf(substr)
        return str.slice(0, offset) + str.slice(offset + substr.length, str.length)
    }
    let totalLength = 0
    while (true) {
        const {length, sequence, _} = lcs(str1, str2)
        if (length == 0) {
            return totalLength
        }
        totalLength += length
        str1 = removeSubstr(str1, sequence)
        str2 = removeSubstr(str1, sequence)
    }
}