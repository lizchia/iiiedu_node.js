const Person = require('./person');
const p1 = new Person("Liz", 20 )
const p2 = new Person();
console.log(p1.toJSON());
console.log(p2.toJSON());