/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/


function printString ( str ) {
  return new Promise( (resolve,reject) => {
    setTimeout( () => {
      resolve(str)
    },10)
  })
}

printString('hello').then( res => {
  return printString(res + ' 蓝洛')
} ).then( res => {
  return printString(res +' I ♥ U')
}).then(res=>console.log( res))
