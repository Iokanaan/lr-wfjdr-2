export const charToInt = function(letter: string) {
    if(letter === undefined) {
        return 0
    }
    return letter.charCodeAt(0) - 97
}

export const intToChar = function(n: number) {
    return String.fromCharCode(97 + n)
}

export const intToWord = function(n: number) {
    const chars = n.toString().split('')
    let word = ''
    for(var i in chars) {
        word += intToChar(parseInt(chars[i]))
    }
    return word
}

export const wordToInt = function(str: string) {
    const chars = str.split('')
    let res = ''
    for(var i in chars) {
        res += (chars[i].charCodeAt(0) - 97).toString()
    }
    return parseInt(res)
}