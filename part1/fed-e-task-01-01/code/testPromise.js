// MyPromise_V1 测试
// const MyPromise = require( './MyPromise_V1' );

// let promise = new MyPromise( (resolve,reject) => {
//     // resolve('状态变成成功了')
//     reject('这个是失败的原因')
// } )

// promise.then( value => {
//     console.log(`value`, value)
// }, reason => {
//     console.log( 'reason', reason )
// } )


// MyPromise_V2 测试
const MyPromise = require( './MyPromise_V2' );
let promise = new MyPromise( (resolve,reject) => {
    setTimeout( () => {
        resolve('异步成功了')
    },1000)
} )

promise.then( (value) => {
    console.log(`value`, value)
}, (reason) => {
    console.log(`reason`, reason)
})