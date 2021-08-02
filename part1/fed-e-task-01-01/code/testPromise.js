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


// // MyPromise_V2 测试
// const MyPromise = require( './MyPromise_V2' );
// let promise = new MyPromise( (resolve,reject) => {
//     setTimeout( () => {
//         resolve('异步成功了')
//     },1000)
// } )

// promise.then( (value) => {
//     console.log(`value`, value)
// }, (reason) => {
//     console.log(`reason`, reason)
// })


// // MyPromise_V3 测试
// const MyPromise = require( './MyPromise_V3' );
// let promise = new MyPromise( (resolve,reject) => {
// 	// resolve( '多次调用-- 同步成功' )

// 	// reject('多次调用-- 同步失败')

// 	setTimeout( () => {
// 			resolve('多次调用--异步成功')
// 	}, 1000 )

// } )

// promise.then( value => {
// 	console.log(`value`, value)
// }, (reason) => {
// 	console.log(`reason`, reason)
// } )

// promise.then( value => {
// 	console.log(`value`, value)
// }, (reason) => {
// 	console.log(`reason`, reason)
// } )

// promise.then( value => {
// 	console.log(`value`, value)
// }, (reason) => {
// 	console.log(`reason`, reason)
// })


// MyPromise_V4 测试
const MyPromise = require( './MyPromise_V4' );
let promiseV4 = new MyPromise( (resolve,reject) => {
	resolve('链式调用-同步成功')
} )

// 定义一个用于返回的promise对象进行测试
other = () => {
	return new MyPromise( (resolve,reject) => {
		resolve('other')
	})
}

promiseV4.then( (value1) => {
	console.log( `value1的参数是：`, value1 )
	// return '这是value1的返回值' // 返回普通纸
	return other()  // 返回promise对象
} ).then( (value2) => {
	console.log(`value2的参数是：`, value2)
})