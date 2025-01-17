let numbers = [1, 2, 3, 4]

numbers = new Proxy(numbers, {
    get(target, prop) {
        if (prop === 'length') {
            return 2
        }
        console.log('prop:', prop)
        if (prop in target) {
            return target[prop]
        } else {
            return 0
        }
    },
})

console.log(numbers.join())
console.log(numbers[2])
console.log(numbers[4])
