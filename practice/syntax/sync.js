var fs = require('fs');

// readFileSync 동기
// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt', 'utf-8');
// console.log(result);
// console.log('C');
// 결과는 A B C


// 비동기
console.log('A');
fs.readFile('syntax/sample.txt', 'utf-8' , (err, result)=>{
    console.log(result);
});
console.log('C');
// 결과는 A C B 
// readFile이 실행이 될 것인데 결과를 가져오기전에 C가 실행이 되고 위에 readFile 작업이 끝나면
// 함수가 호출되면서 나중에 실행된 것 이것이 비동기