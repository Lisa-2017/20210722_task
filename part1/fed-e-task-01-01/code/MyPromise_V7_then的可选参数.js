/*
V1： Promise类核心逻辑的实现
	1. Promise 就是一个类 在调用类的时候 要传递一个执行器进去 执行器会立即执行
		创建一个类
		用构造函数接收一个执行器作为参数，并立即调用
		执行器函数有2个参数, 调用resolve / reject 用来修改Promise状态
			定义2个函数 resolve & reject，修改promise状态
			状态是每个实例对象独有的，所以 状态属性要定义为实例属性
		调用执行器函数

	2. Promise 中有三种状态：pending 等待  fufilled 成功  rejected失败; 状态一旦确定就不可以再次更改
	3. 对应的，
		执行器中调用resolve(value): 
			判断状态，如果当前状态不是pending说明已经改过一次，便不可再更改了。
			如果是pending：
				将Promise 的状态从 pending 改变为 fufilled ; 
				传入的 value 为成功的值,保存到 value属性中
		执行其中调用reject(reson)：
		判断状态，如果当前状态不是pending说明已经改过一次，便不可再更改了。
			如果是pending：
				将Promise 的状态从 pending 改变为 rejected ; 
				传入的 reson 为失败的原因，保存到reason属性中

	4. 定义then方法:
			then方法被定义在原型对象上,
			接收2个函数作为参数;
			判断当前的状态,分别调用成功/失败的回调函数;
			并将 成功的value /  失败的reson传递给对应的回调函数;

-----------------------------------------------------------------------------------------------------
V2： 在MyPromise 类中 加入异步逻辑
	异步代码的实行顺序时自上而下的，当遇到异步的时候会开启新的线程处理异步代码，主线程中的代码不会阻塞，而是会继续向下执行，当遇到promise.then 方法的调用时，此时 proimse的状态尚未发生变化，仍然是pending。

	因此，首先要处理 then 方法里面，当状态为其他（pending）的时候怎么办？
		保存 成功 和 失败  两个回调函数,在实例上声明2个变量，用于在then方法中存储2个回调函数。

	当promise的状态变为成功的时候，再次调用 resolve 方法，
		此时需要在resolve方法中判断实例上是否保存有successCallback函数，
		如果没有说明是同步代码就无需执行了，
		如果有的话说明是异步代码，需要再次调用 successCallback方法,并将this.value 传递进去。

	当promise的状态变为失败的时候，再次调用 reject 方法，
		此时需要在reject方法中，判断实例上是否有 failCallback,
		如果没有说明是同步代码就无需执行了，
		如果有的话说明是异步代码，需要再次调用 failCallback 方法,并将this.reason 传递进去。

-----------------------------------------------------------------------------------------------------
V3： then 方法多次调用添加多个处理函数，分为同步 & 异步考虑
	当 promise 为同步的时候，多次调用 then 方法 得到的都是相同的结果,因此无需额外处理；
	当 promise 为异步的时候，多次调用 then 方法，就会产生多个异步函数。
		第二版本中存储回调函数的是普通的属性，每次只能存储一个，所以需要修改promise实例上的 successCallback 和 failCallback 回调函数的类型为数组，便于存储多个回调函数。
	当 promise 的状态异步变为成功的时候，依次调用 successCallback 中的回调函数,别忘记要把 this.value 传递进去。
		使用while循环，从前向后 从数组中弹出回调函数并调用，直到 成功回调函数数组 的 length 为0就停止循环。
	当 promise 的状态异步变为失败的时候，依次调用 failCallback 中的回调函数,别忘记要把 this.reason 传递进去。
		使用while循环，从前向后 从数组中弹出回调函数并调用，直到 失败回调函数数组 的 length 为0就停止循环。

-----------------------------------------------------------------------------------------------------
V4： then 方法的链式调用
	Promise 是支持链式调用的。后面一个then获取到的value 其实是上一个then方法的返回值。
	所以 每个peomise方法都应该返回一个promise2对象。
		创建 promise2 对象，在执行器中执行之前的then 方法，
		创建变量 x ，接收第一个then方法的中回调函数的返回值
		使用 promise2中的 resolve(x) 方法， 将变量传递给下一个then方法。

	首先，判断 then方法中回调函数的返回值是普通纸还是promise对象；
		如果是普通对象，直接调用 resolve方法
		如果是promise对，查看promise对象返回的结果
		再根据promise对象返回的结果的状态，决定 调用 resolve 还是 reject

	由于相同的代码会在 then方法中的 PENDING/ FULFILLED / REJECTED 三种状态下都需要用，所以建议封装成函数使用： resolvePromise 

-----------------------------------------------------------------------------------------------------
V5： then方法的链式调用:识别 then 方法 自己返回自己, 并进行报错。

	例如：  then 方法返回了自身，会产生循环调用，因此需要识别出来，并进行报错处理
		let promise = new Promise((resolve,reject)=>{resolve(100)})
		let p1 = promise.then(value=>{ return p1})
		控制台报错： Chaning cycle detected for promise <#Promise>  这个promise对象被循环调用了


	将 promise对象 作为参数 传递到 resolvePromise函数中，
		判断回调函数的返回值和promise 是否相等，
		如果then方法的回调函数中返回的结果等于 promise 本身，则 停止向下执行，并抛出错误提示

	因为同步代码是无法在自己内部获取到自己的（promise2）,
		通过setTimeout 将同步代码变成异步代码
		就可以等 promise2执行结束再来执行 定时器里面的，此时就可以顺利获取到promise2了。

	此时在调用 p1.then时看起来是没有问题的，
		但是当再次链式调用then方法时，就会被失败的函数捕获到自调用的错误提示。

-----------------------------------------------------------------------------------------------------
V6： 捕获错误 & 处理错误 增强代码的健壮性

	1. 当执行器中的代码发生错误的时候，将promise的状态变为失败的状态；
	2. 当 then 方法的回调函数在执行时发生错误，让这个错误在下一个then方法的错误回调中被捕获；
			成功状态
			失败状态
			异步时：
				处理异步回调中的错误 ,将函数push进数组，在函数中处理回调函数，并捕捉错误

-----------------------------------------------------------------------------------------------------
V7: promise 在调用 then 方法的时候 可以不传递任何参数
	分析,二者等价：
		promise																							promise
			.then()																							.then(value=>value)
			.then()																	《===》		  .then(value=>value)
			.then(value=>{console.log(value)})									.then(value=>{console.log(value)})
	所以,可选参数的原理是：
		在then 方法的内部 判断 then 有没有参数，
		如果没有的话 补齐设置 value=>value ;从而确保value可以正常向后传递。

*/


// 定义常量
const PENDING = 'PENDING';
const FUlFILLED = 'FUlFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
	constructor ( executor ) {
		// v6: 捕获执行器错误
		try {
			executor(this.resolve,this.reject)
		} catch (error) {
			this.reject(error)
		}

	};

	// 定义示例属性 status
	status = PENDING;
	value = undefined;// 保存成功的值
	reason = undefined; // 保存失败的原因
	// successCallback = undefined; //用于保存成功的回调函数
	// failCallback = undefined; //用于保存失败的回调函数
	// v3: 声明两个变量分别保存 多个 成功/失败 的回调函数
	successCallback = []; // 存储成功的回调函数数组
	failCallback = []; // 存储失败的回调函数数组

	// 修改状态属性值
	resolve = ( value ) => {
		if ( this.status !== PENDING ) return; // 状态一旦确定就不可以再次更改,因此要终止继续执行
		this.status = FUlFILLED;
		this.value = value;
		// v2.判断成功的回调函数是否存在，如果存在就调用，否则不处理
		// this.successCallback && this.successCallback( this.value );
		//v3: 从前向后 从数组中弹出回调函数并调用，直到回调函数数组的 length 为0就停止循环
		while ( this.successCallback.length ) {
			//v6: 异步错误步获的时候，已经将value传递进来了，所以不需要再传递了
			// this.successCallback.shift()(this.value) 
			this.successCallback.shift()() 
		}
	};

	reject = ( reason ) => {
		if ( this.status !== PENDING ) return; 
		this.status = REJECTED;
		this.reason = reason;
		// v2.判断失败的回调函数是否存在，如果存在就调用，否则不处理
		// this.failCallback && this.failCallback( this.reason );
		//v3: 从前向后 从数组中弹出回调函数并调用，直到回调函数数组的 length 为0就停止循环
		while ( this.failCallback.length ) {
				//v6: 异步错误步获的时候，已经将reason传递进来了，所以不需要再传递了
			// this.failCallback.shift()(this.reason)
			this.failCallback.shift()()
		}
	};

	then ( successCallback, failCallback ) {
		// V7: 实现then 方法的可选参数
		successCallback = successCallback ? successCallback : value => value;
		failCallback = failCallback ? failCallback : reason => { throw reason }

		// v4 创建一个promise 对象
		let promise2 = new MyPromise( (resolve, reject) => {

			// 判断状态，根据最终状态调用不同的回调（成功/失败）
			if ( this.status === FUlFILLED ) {
				// // v4: 变量 then_return_value 接收then方法中回调的返回值 return ，并通过promis2的resolve方法将这个返回值带给下一个then方法。
				// let then_return_value = successCallback( this.value ) // 调用回调的时候，将成功的值传进去
				// // resolve( then_return_value );
				// resolvePromise( promise2, then_return_value, resolve, reject ) // 封装函数处理

				//V5: 因为同步代码是无法在自己内部获取到自己的（promise2）,通过setTimeout 将同步代码变成异步代码就可以等 promise2执行结束再来执行 定时器里面的，此时就可以顺利获取到promise2了。
				setTimeout( () => {
					// v6: 步获 then的回调函数发生的错误
					try {
						let then_return_value = successCallback( this.value );
						//V5: 将promise2传递进去对比看是否是自己返回自己，如果是则提示报错。
						resolvePromise( promise2, then_return_value, resolve, reject ) 
					} catch (error) {
						reject(error) // v6: 将错误回调传递给下一个promise的回调函数
					}
				},0)

			} else if ( this.status === REJECTED ) {
				// v6: 使用异步的方式处理同步代码，避免 调用自己的问题
				setTimeout( () => {
					try {
						let then_return_reason = failCallback( this.reason ) // 调用回调的时候，将失败的原因传进去
						resolvePromise(promise2,then_return_reason,resolve,reject)
					} catch (error) {
						reject(error)
					}
				},0)

			} else {
				// 如果是等待的状态,应该怎么处理呢？
				//应该将成功函数和失败函数存储起来。
				// v3:将每次传进来的函数 追加到数组中
				// this.successCallback.push(successCallback);
				// this.failCallback.push(failCallback);

				// v6: 处理异步回调中的错误 ,将函数push进数组，在函数中处理回调函数，并捕捉错误
				this.successCallback.push( () => {
					setTimeout( () => {
						try {
							let then_result_value = successCallback( this.value );
							resolvePromise(promise2,then_result_value,resolve,reject)
						} catch (error) {
							reject(error)
						}
					},0)
				} )
				this.failCallback.push( () => {
					setTimeout( () => {
						try {
							let then_return_reason = failCallback( this.reason )
							resolvePromise(promise2,then_return_reason,resolve,reject)
						} catch (error) {
							reject(error)
						}
					},0)
				})
			}

		});

		// V4: 返回promise2
		return promise2;
	};

};

resolvePromise = ( promise2, callbackresult, resolve, reject ) => {
	//V5: 如果then方法的回调函数中返回的结果等于 promise 本身，则 停止向下执行，并抛出错误提示
	if ( promise2 == callbackresult ) {
		return 	reject( new TypeError('Chaning cycle detected for promise $<Promise>') );
	}

	if ( callbackresult instanceof MyPromise ) {
		// 是promise对象
		// 标准写法：
		// callbackresult.then( (value) => {
		// 	resolve(value)
		// }, (reason) => {
		// 	reject(reason)
		// } )
		
		// 可以简写为：
		callbackresult.then(resolve,reject)

	} else {
		// 是普通值
		resolve(callbackresult)
	}
}

// 向外暴露MyPromise函数
module.exports = MyPromise;

