/*
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
	// 修改状态属性值
	resolve = ( value ) => {
		if ( this.status !== PENDING ) return; // 状态一旦确定就不可以再次更改,因此要终止继续执行
		this.status = FUlFILLED;
		this.value = value;

	};
	reject = ( reason ) => {
		if ( this.status !== PENDING ) return; 
		this.status = REJECTED;
		this.reason = reason;
	};
	then (successCallback,failCallback) {
		// 判断状态，根据最终状态调用不同的回调（成功/失败）
		if ( this.status === FUlFILLED ) {
			successCallback(this.value) // 调用回调的时候，将成功的值传进去
		}
		if ( this.status === REJECTED ) {
			failCallback(this.reason) // 调用回调的时候，将失败的原因传进去
		}
	};
};

// 向外暴露MyPromise函数
module.exports = MyPromise;

