const array1 = [
    {price: 10.99},
    {price: 5.99},
    {price: 29.99}
]



const sum4 = array1.map(item => item.price).reduce((accumulator, price) => accumulator + price, 0)
console.log(`The sum of ${array1[0].price} + ${array1[0].price} + ${array1[0].price} = ${sum4}`) // 46.97


var sum = 0
const sum5 = array1.map(item => item.price)
console.log(sum5[0]+sum5[1]+sum5[2])

var sum = 0
const sum6 = array1[0].price + array1[1].price +array1[2].price
console.log(sum6)