var number = [1, 400, 12, 34, 5];
var i = 0;
while (i < number.length) {
  console.log(number[i]);
  i = i + 1;
}
var j = 0;
var total = 0;
while (j < number.length) {
  total += number[j];
  j += 1;
}
console.log(`total : ${total}`);
