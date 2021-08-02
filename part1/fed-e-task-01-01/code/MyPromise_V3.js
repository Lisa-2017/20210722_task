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
V3： then 方法多次调用添加多个处理函数
	当 promise 为同步的时候，多次调用 then 方法 得到的都是相同的结果,因此无需额外处理；
	当 promise 为异步的时候，多次调用 then 方法，就会产生多个异步函数。
		第二版本中存储回调函数的是普通的属性，每次只能存储一个，所以需要修改promise实例上的 successCallback 和 failCallback 回调函数的类型为数组，便于存储多个回调函数。
	当 promise 的状态异步变为成功的时候，依次调用 successCallback 中的回调函数,别忘记要把 this.value 传递进去。
		使用while循环，从前向后 从数组中弹出回调函数并调用，直到 成功回调函数数组 的 length 为0就停止循环。
	当 promise 的状态异步变为失败的时候，依次调用 failCallback 中的回调函数,别忘记要把 this.reason 传递进去。
		使用while循环，从前向后 从数组中弹出回调函数并调用，直到 失败回调函数数组 的 length 为0就停止循环。


*/


// 定义常量
const PENDING = 'PENDING';
const FUlFILLED = 'FUlFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
	constructor (executor) {
		executor(this.resolve,this.reject)
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
			this.successCallback.shift()(this.value) 
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
			this.failCallback.shift()(this.reason)
		}
	};

	then ( successCallback, failCallback ) {
		// 判断状态，根据最终状态调用不同的回调（成功/失败）
		if ( this.status === FUlFILLED ) {
			successCallback( this.value ) // 调用回调的时候，将成功的值传进去
		} else if ( this.status === REJECTED ) {
			failCallback( this.reason ) // 调用回调的时候，将失败的原因传进去
		} else {
			// 如果是等待的状态,应该怎么处理呢？
			//应该将成功函数和失败函数存储起来。
			// v3:将每次传进来的函数 追加到数组中
			this.successCallback.push(successCallback);
			this.failCallback.push(failCallback);
		}
	};

};

// 向外暴露MyPromise函数
module.exports = MyPromise;

