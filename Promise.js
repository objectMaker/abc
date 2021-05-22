(function (window){
    let PENDING = 'pending'
    let RESOLVED = 'resolved'
    let REJECTED = 'rejected'
    function Promise(executor){
        this.status = PENDING;
        this.data = undefined;
        this.callbacks = []
        let that = this;
        function resolve(value){
            if(that.status !== PENDING){
                return
            }else{
                //改变promise状态为成功
                that.status = RESOLVED
                //将值存入promise中
                that.data = value;
                if(that.callbacks.length){
                    setTimeout(function (){
                        that.callbacks.forEach(function (item){
                            if(that.status===RESOLVED){
                                item.onResolved()
                            }else{
                                item.onRejected()
                            }
                        })
                    })
                }
            }
        }
        function reject(reason){
            if(that.status !== PENDING){
                return
            }else{
                //改变promise状态为失败
                that.status = REJECTED
                //将值存入promise中
                that.data = reason
                if(that.callbacks.length){
                    that.callbacks.forEach(function (item){
                        item.onRejected(that.data)
                    })
                }
            }


        }
        try{
            executor(resolve,reject)
        }catch (err){
            reject(err)
        }
    }
    Promise.prototype.then=function (onResolved,onRejected){
        //类型错误处理
        onRejected instanceof Function?undefined:onRejected=reason=>new Promise(()=>{throw reason})
        onRejected instanceof Function?undefined:onResolved=value=>value;
        let that = this;
        return new Promise(function (resolved,rejected){
            function handle(onRes){
                        try{
                            let result = onRes(that.data);
                            if(!(result instanceof Promise)){
                                //如果不是一个promise那么 返回一个成功的promise，值为它
                                resolved(result)
                            }else{
                                result.then(resolved,rejected);
                            }
                        }catch (err){
                            rejected(err)
                        }
            }
                if(that.status === RESOLVED){
                    setTimeout(()=>{handle(onResolved)})
                }else if(that.status === REJECTED){
                    setTimeout(()=>{handle(onRejected)})
                }else{
                    //将函数存起来.要改变上一个promise状态。。
                    that.callbacks.push({onResolved:function (){
                            setTimeout(()=>{handle(onResolved)})
                        },onRejected:function (){
                            setTimeout(()=>{handle(onRejected)})
                        }})
                }

        })
    }
    Promise.prototype.catch = function (onRejected){
        return this.then(undefined,onRejected)
    }
    Promise.resolve = function (value){
        return new Promise((resolve)=>{
            resolve(value)
        })
    };
    Promise.reject = function (reason){
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
    Promise.all = function (proArr){
        return new Promise((resolve,reject)=>{
            let result = [];
            let count = 0;
            proArr.forEach(function (item,index){
                item.then(value=>{
                    count++;
                    result[index]=value;
                    if(count===proArr.length){
                        resolve(result)
                    }
                },reason=>{
                    reject(reason)
                })
            })
        }
        )
    }
    Promise.race = function (proArr){
        return new Promise((resolve,reject)=>{
            proArr.forEach(function (item){
                item.then(resolve,reject)
            })
        })
    }
    window.Promise = Promise;
})(window)