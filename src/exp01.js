let a = 1;
let b = 2;
function getA() {
    a++;
    return a;

};
function getB() {
    b++;
    return b;

};
console.log("hi,there");
module.exports = [getA,getB];