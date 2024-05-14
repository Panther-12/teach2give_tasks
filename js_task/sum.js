const array1 = [
    {price: 10.99},
    {price: 5.99},
    {price: 29.99}
]



const sum4 = array1.map(item => item.price).reduce((accumulator, price) => accumulator + price, 0)
console.log(`The sum of ${array1[0].price} + ${array1[0].price} + ${array1[0].price} = ${sum4}`) // 46.97

