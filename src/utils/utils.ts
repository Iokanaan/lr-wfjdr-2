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
    let neg = false
    if(n < 0) {
      neg=true
      n=Math.abs(n)
    }
    const chars = n.toString().split('')
    let word = ''
    for(var i in chars) {
        word += intToChar(parseInt(chars[i]))
    }
    if(neg) {
        return "Z" + word
    } else {
        return word
    }
}

export const wordToInt = function(str: string) {
    let neg = false
    if(str.startsWith("Z")) {
        str = str.substring(1)
      neg = true
    } 
    const chars = str.split('')
    let res = ''
    for(var i in chars) {
        res += (chars[i].charCodeAt(0) - 97).toString()
    }
    if(neg) {
        return -parseInt(res)
    } else {
        return parseInt(res)
    }
}

export function signal<T>(value: T): Signal<T> {
    let state = value;
    let handlers: Handler<T>[] = []
    function _signal() {
        return state;
    }

    _signal.set = function(value: T) {
        state = value;
        for(let i=0; i<handlers.length; i++) {
            handlers[i](value)
        }
    }

    _signal.subscribe = function(handler: Handler<T>) {
        handlers.push(handler);
        return function() { }
    }

    return _signal;
}

export function computed<T>(compute: () => T, dependencies: Signal<unknown>[] | Computed<unknown>[]): Computed<T> {
    const s = signal(compute());
    for(let i=0; i<dependencies.length; i++) {
        dependencies[i].subscribe(function(c) {
            s.set(compute())
        })
    }

    return s;
}

export const hideDescriptions = function(repeater: Component<Record<string, unknown>>, descId: string) {
    each(repeater.value(), function(_, entryId) {
        repeater.find(entryId).hide()
    })
}