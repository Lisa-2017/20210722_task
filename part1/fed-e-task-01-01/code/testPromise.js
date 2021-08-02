// MyPromise_V1 测试========================================
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



// // MyPromise_V2 测试========================================
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



// // MyPromise_V3 测试========================================
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



// // MyPromise_V4 测试========================================
// const MyPromise = require( './MyPromise_V4' );
// let promiseV4 = new MyPromise( (resolve,reject) => {
// 	resolve('链式调用-同步成功')
// } )

// // 定义一个用于返回的promise对象进行测试
// other = () => {
// 	return new MyPromise( (resolve,reject) => {
// 		resolve('other')
// 	})
// }

// promiseV4.then( (value1) => {
// 	console.log( `value1的参数是：`, value1 )
// 	// return '这是value1的返回值' // 返回普通纸
// 	return other()  // 返回promise对象
// } ).then( (value2) => {
// 	console.log(`value2的参数是：`, value2)
// })



// // MYPromise_V5 测试========================================
// const MyPromise = require( './MyPromise_V5' );
// let promise = new MyPromise( (resolve,reject) => {
// 	resolve('测试promise返回')
// })

// let p1 = promise.then( value => {
// 	console.log(`value`, value)
// 	return p1
// } )

// p1.then( ( value ) => {
// 	console.log(`value`, value)
// }, (reason) => {
// 	console.log(`reason`, reason)
// })



// // MyPromise_V6_1 测试 执行器中错误捕获====================================
// const MyPromise = require( './MyPromise_V6' );
// let promise = new MyPromise( (resolve,reject) => {
// 	throw new Error( '测试执行器错误' );
// 	resolve(1)
// } )

// promise.then( value => {
// 	console.log( `value1`, value )
// }, reason => {
// 	// console.log(`reason`, reason)
// 	console.log( `reason1`, reason.message ) //捕获到了执行器函数中的错误
// } )



// // MyPromise_V6_2 测试 then方法的回调函数中 resolve  时的错误捕获====================================
// const MyPromise = require( './MyPromise_V6' );
// let promise = new MyPromise( (resolve,reject) => {
// 	resolve(1)
// } )
// promise.then( value => {
// 	console.log( `value1`, value )
// 	throw new Error('测试 then方法的回调中发生错误')
// }, reason => {
// 	console.log(`reason1`, reason)
// } ).then( value => {
// 	console.log(`value2`, value)
// }, reason => {
// 	// console.log(`reason2`, reason)
// 	console.log(`reason2-这里捕获到的是上一个then的回调函数中发生的错误`, reason.message)
// } )



// // MyPromise_V6_3 测试 then方法的回调函数中 rejected 时的错误捕获==================================
// const MyPromise = require( './MyPromise_V6' );
// let promise = new MyPromise( (resolve,reject) => {
// 	reject('失败了')
// } )
// promise.then( value => {
// 	console.log( `value1`, value )
// }, reason => {
// 	console.log(`reason1`, reason)
// 	return '当前promise虽然失败了，但是仍然向下一个promise中传递数据'
// 	// throw new Error('THEN ERROR') // 测试 then 返回失败
// } ).then( value => {
// 	console.log(`value2-- 上一个then 方法返回的只要是 一般值或者promise对象，我都接收：`, value)
// }, reason => {
// 	// console.log(`reason2`, reason)
// 	console.log(`reason2-上一个then方法返回的是失败的就交给我吧：`, reason.message)
// } )



// // MyPromise_V6_4 测试 异步错误捕获====================================
// const MyPromise = require( './MyPromise_V6' );
// let promise = new MyPromise( (resolve,reject) => {
// 	setTimeout( () => {
// 		resolve('测试异步的错误捕获--成功')
// 	},2000)
// } )

// promise.then( value => {
// 	console.log( `value1`, value )
// 	return 'aaa--测试异步错误捕获'
// }, reason => {
// 	console.log(`reason1`, reason)
// } ).then( value => {
// 	console.log(`value2`, value)
// }, reason => {
// 	console.log(`reason2`, reason)
// } )


// // MyPromise_v7 测试  then方法的可选参数=============================================
// const MyPromise = require( './MyPromise_V7_then的可选参数' );
// let promise = new MyPromise( (resolve,reject) => {
// 	// resolve('成功')
// 	reject('失败了')
// } )

// promise
// 	.then()
// 	.then()
// 	.then( value => { console.log( `value`, value ) }, reason => { console.log(`reason`, reason)})



// // MyPromise 测试 Promise.all方法=======================================
// const MyPromise = require( './MyPromise_V8_实现all方法' );
// let promise = new MyPromise( (resolve,reject) => {
// 	resolve(200)
// } )

// const p1 = () => {
// 	return new MyPromise( (resolve,reject) => {
// 		setTimeout( () => {
// 			resolve('p1')
// 		},2000)
// 	})
// }
// const p2 = () => {
// 	return new MyPromise( (resolve,reject) => {
// 		resolve('p2')
// 		// throw new Error('只要有一个出错，满盘皆输')
// 	})
// }

// MyPromise.all( [ 'a', 'b', p1(), p2(), 'c', 'd' ] )
// 	.then( value=> {
// 		console.log(`value`, value) //  [ 'a', 'b', 'p1', 'p2', 'c', 'd' ]
// 	}, reason => { 
// 		console.log(`reason`, reason.message)
// 	})


// // MyPromise_V9 测试 Promise.resolve方法==================================
// const MyPromise = require( './MyPromise_V9_Promise.resolve方法' )
// const p1 = () => {
// 	return new MyPromise( (resolve,reject) => {
// 		setTimeout( () => {
// 			resolve('p1')
// 		},2000)
// 	})
// }

// MyPromise.resolve( '调用MyPromise.resolve试试' )
// 	.then( value => console.log( value ) )

// MyPromise.resolve( p1() )
// 	.then( value => console.log( `value`, value ) )




// // MyPromise_V10 测试 finally方法=============================================
// const MyPromise = require( './MyPromise_V10_实现finally方法' )
// const p2 = () => {
// 	return new MyPromise( (resolve,reject) => {
// 		reject( 'p2--error' )
// 		// resolve('p2')
// 	})
// }

// p2().finally( () => {
// 	console.log(`finally`)
// } ).then( value => console.log(`value`, value), reason => console.log(`reason`, reason))


// MyPromise_V11 测试 catch方法 ===============================================
const MyPromise = require( './MyPromise_V11_ 实现catch方法' )
const p2 = () => {
	return new MyPromise( (resolve,reject) => {
		// resolve('p2')
		reject( 'p2--error' )
	})
}

p2().then(value=>console.log(`value`, value)).catch(error=>console.log(`error`, error))