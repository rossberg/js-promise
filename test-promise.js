function assert(b, s) { print(s + (b ? " ok" : " failed")) }
function unreachable(x) { assert(false, "unreachable(" + x + ")") }

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "resolved/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { assert(x === 5, "resolved/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.rejected(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "rejected/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.rejected(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "rejected/then") })
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { return x }, unreachable)
    .when(function(x) { assert(x === p1, "resolved/when/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { return x }, unreachable)
    .then(function(x) { assert(x === 5, "resolved/when/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { return 6 }, unreachable)
    .when(function(x) { assert(x === 6, "resolved/when/when2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { return 6 }, unreachable)
    .then(function(x) { assert(x === 6, "resolved/when/then2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { return x + 1 }, unreachable)
    .when(function(x) { assert(x === 6, "resolved/then/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { return x + 1 }, unreachable)
    .then(function(x) { assert(x === 6, "resolved/then/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { return Promise.resolved(x + 1) }, unreachable)
    .when(function(x) { assert(x === 6, "resolved/then/when2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { return Promise.resolved(x + 1) }, unreachable)
    .then(function(x) { assert(x === 6, "resolved/then/then2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { throw 6 }, unreachable)
    .when(unreachable, function(x) { assert(x === 6, "resolved/when-throw/when") })
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { throw 6 }, unreachable)
    .then(unreachable, function(x) { assert(x === 6, "resolved/when-throw/then") })
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { throw 6 }, unreachable)
    .when(unreachable, function(x) { assert(x === 6, "resolved/then-throw/when") })
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { throw 6 }, unreachable)
    .then(unreachable, function(x) { assert(x === 6, "resolved/then-throw/then") })
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "resolved/thenable/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { assert(x === 5, "resolved/thenable/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.rejected(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "rejected/thenable/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.rejected(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "rejected/thenable/then") })
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "when/resolve") }, unreachable)
  deferred.resolve(5)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { assert(x === 5, "then/resolve") }, unreachable)
  deferred.resolve(5)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "when/reject") }, unreachable)
  deferred.reject(5)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = Promise.resolved(p1)
  var p3 = Promise.resolved(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "then/reject") })
  deferred.reject(5)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "when/resolve/thenable") }, unreachable)
  deferred.resolve(5)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.then(function(x) { assert(x === 5, "then/resolve/thenable") }, unreachable)
  deferred.resolve(5)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.when(function(x) { assert(x === p2, "when/reject/thenable") }, unreachable)
  deferred.reject(5)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolved(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "then/reject/thenable") })
  deferred.reject(5)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var deferred = Promise.deferred()
  var p3 = deferred.promise
  p3.when(function(x) { assert(x === p2, "when/resolve2") }, unreachable)
  deferred.resolve(p2)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var deferred = Promise.deferred()
  var p3 = deferred.promise
  p3.then(function(x) { assert(x === 5, "then/resolve2") }, unreachable)
  deferred.resolve(p2)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var deferred = Promise.deferred()
  var p3 = deferred.promise
  p3.when(unreachable, function(x) { assert(x === 5, "when/reject2") })
  deferred.reject(5)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = Promise.resolved(p1)
  var deferred = Promise.deferred()
  var p3 = deferred.promise
  p3.then(unreachable, function(x) { assert(x === 5, "then/reject2") })
  deferred.reject(5)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var deferred = Promise.deferred()
  var p3 = deferred.promise
  p3.when(function(x) { assert(x === p2, "when/resolve/thenable2") }, unreachable)
  deferred.resolve(p2)
})()

var test = (function() {
  var p1 = Promise.resolved(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var deferred = Promise.deferred()
  var p3 = deferred.promise
  p3.then(function(x) { assert(x === 5, "then/resolve/thenable2") }, unreachable)
  deferred.resolve(p2)
})()

var test = (function() {
  var deferred1 = Promise.deferred()
  var p1 = deferred1.promise
  var deferred2 = Promise.deferred()
  var p2 = deferred2.promise
  var deferred3 = Promise.deferred()
  var p3 = deferred3.promise
  Promise.all([p1, p2, p3]).when(function(x) { assert(x === undefined, "all/resolve") }, unreachable)
  deferred1.resolve(1)
  deferred3.resolve(3)
  deferred2.resolve(2)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = Promise.resolved(2)
  var p3 = Promise.deferred().promise
  Promise.all([p1, p2, p3]).when(unreachable, unreachable)
  deferred.resolve(1)
})()

var test = (function() {
  var deferred1 = Promise.deferred()
  var p1 = deferred1.promise
  var deferred2 = Promise.deferred()
  var p2 = deferred2.promise
  var deferred3 = Promise.deferred()
  var p3 = deferred3.promise
  Promise.all([p1, p2, p3]).when(unreachable, function(x) { assert(x === 2, "all/reject") })
  deferred1.resolve(1)
  deferred3.resolve(3)
  deferred2.reject(2)
})()

var test = (function() {
  var p1 = Promise.resolved(1)
  var p2 = Promise.resolved(2)
  var p3 = Promise.resolved(3)
  Promise.one([p1, p2, p3]).when(function(x) { assert(x === 1, "resolved/all") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolved(1)
  var p2 = Promise.resolved(2)
  var p3 = Promise.resolved(3)
  Promise.one([0, p1, p2, p3]).when(function(x) { assert(x === 0, "resolved-const/all") }, unreachable)
})()

var test = (function() {
  var deferred1 = Promise.deferred()
  var p1 = deferred1.promise
  var deferred2 = Promise.deferred()
  var p2 = deferred2.promise
  var deferred3 = Promise.deferred()
  var p3 = deferred3.promise
  Promise.one([p1, p2, p3]).when(function(x) { assert(x === 3, "one/resolve") }, unreachable)
  deferred3.resolve(3)
  deferred1.resolve(1)
})()

var test = (function() {
  var deferred = Promise.deferred()
  var p1 = deferred.promise
  var p2 = Promise.resolved(2)
  var p3 = Promise.deferred().promise
  Promise.one([p1, p2, p3]).when(function(x) { assert(x === 2, "resolved/one") }, unreachable)
  deferred.resolve(1)
})()

var test = (function() {
  var deferred1 = Promise.deferred()
  var p1 = deferred1.promise
  var deferred2 = Promise.deferred()
  var p2 = deferred2.promise
  var deferred3 = Promise.deferred()
  var p3 = deferred3.promise
  Promise.one([p1, p2, p3]).when(function(x) { assert(x === 3, "one/resolve/reject") }, unreachable)
  deferred3.resolve(3)
  deferred1.reject(1)
})()

var test = (function() {
  var deferred1 = Promise.deferred()
  var p1 = deferred1.promise
  var deferred2 = Promise.deferred()
  var p2 = deferred2.promise
  var deferred3 = Promise.deferred()
  var p3 = deferred3.promise
  Promise.one([p1, p2, p3]).when(unreachable, function(x) { assert(x === 3, "one/reject/resolve") })
  deferred3.reject(3)
  deferred1.resolve(1)
})()

var test = (function() {
  var log
  function MyPromise(resolver) {
    log += "n"
    Promise.call(this,
      function(resolve, reject) {
        resolver(
          function(x) { log += "x" + x; resolve(x) },
          function(r) { log += "r" + r; reject(r) }
        )
      }
    )
  }

  MyPromise.__proto__ = Promise
  MyPromise.deferred = function() {
    log += "d"
    return this.__proto__.deferred.call(this)
  }

  MyPromise.prototype.__proto__ = Promise.prototype
  MyPromise.prototype.when = function(resolve, reject) {
    log += "w" 
    return this.__proto__.__proto__.when.call(this, resolve, reject)
  }

  log = ""
  var p1 = new MyPromise(function(resolve, reject) { resolve(1) })
  var p2 = new MyPromise(function(resolve, reject) { reject(2) })
  var d3 = MyPromise.deferred()
  assert(d3.promise instanceof MyPromise, "subclass/instance3")
  assert(log === "nx1nr2dn", "subclass/create")

  log = ""
  var p4 = MyPromise.resolved(4)
  var p5 = MyPromise.rejected(5)
  assert(p4 instanceof MyPromise, "subclass/instance4")
  assert(p5 instanceof MyPromise, "subclass/instance5")
  d3.resolve(3)
  assert(log === "nx4nr5x3", "subclass/resolve")

  log = ""
  var d6 = MyPromise.deferred()
  d6.promise.when(function(x) { return new Promise(x) }).when(function() {})
  d6.resolve(6)
  assert(log === "dnwnwnx6", "subclass/when")

  log = ""
  Promise.all([11, Promise.resolved(12), MyPromise.resolved(13)])
  assert(log === "nx13wn", "subclass/all/arg")

  log = ""
  MyPromise.all([21, Promise.resolved(22), MyPromise.resolved(23)])
  assert(log === "nx23dnnx21wnwn", "subclass/all/self")
})()
