(function(window){
    let PENDING = 'pending';
    let RESOLVED = 'resolved';
    let REJECTED = 'rejected'
    let Promise = function (excutor){
        this.state = PENDING;
        let that = this;
        let resolve = function (value){
            that.state = RESOLVED;
        }
        let reject = function (reason){
            that.state = RESOLVED;
        }
        excutor(resolve,reject)
    }
    Promise.prototype.then = function (){

    }
    Promise.prototype.catch = function (){

    }
    Promise.reject = function (){

    }
    Promise.resolve = function (){

    }
    Promise.race = function (){

    }
    Promise.all = function (){

    }
    Promise.finally = function (){

    }
    window.Promise = Promise;
    })(window)