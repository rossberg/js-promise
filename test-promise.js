function assert(b, s) { print(s + (b ? " ok" : " failed")) }
function unreachable(x) { assert(false, "unreachable(" + x + ")") }


var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "resolve/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { assert(x === 5, "resolve/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.reject(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "reject/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.reject(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "reject/then") })
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { return x }, unreachable)
    .when(function(x) { assert(x === p1, "resolve/when/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { return x }, unreachable)
    .then(function(x) { assert(x === 5, "resolve/when/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { return 6 }, unreachable)
    .when(function(x) { assert(x === 6, "resolve/when/when2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { return 6 }, unreachable)
    .then(function(x) { assert(x === 6, "resolve/when/then2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { return x + 1 }, unreachable)
    .when(function(x) { assert(x === 6, "resolve/then/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { return x + 1 }, unreachable)
    .then(function(x) { assert(x === 6, "resolve/then/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { return Promise.resolve(x + 1) }, unreachable)
    .when(function(x) { assert(x === 6, "resolve/then/when2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { return Promise.resolve(x + 1) }, unreachable)
    .then(function(x) { assert(x === 6, "resolve/then/then2") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { throw 6 }, unreachable)
    .when(unreachable, function(x) { assert(x === 6, "resolve/when-throw/when") })
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { throw 6 }, unreachable)
    .then(unreachable, function(x) { assert(x === 6, "resolve/when-throw/then") })
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { throw 6 }, unreachable)
    .when(unreachable, function(x) { assert(x === 6, "resolve/then-throw/when") })
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { throw 6 }, unreachable)
    .then(unreachable, function(x) { assert(x === 6, "resolve/then-throw/then") })
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "resolve/thenable/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.resolve(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { assert(x === 5, "resolve/thenable/then") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.reject(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "reject/thenable/when") }, unreachable)
})()

var test = (function() {
  var p1 = Promise.reject(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "reject/thenable/then") })
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "when/resolve") }, unreachable)
  resolve(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { assert(x === 5, "then/resolve") }, unreachable)
  resolve(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "when/reject") }, unreachable)
  reject(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = Promise.resolve(p1)
  var p3 = Promise.resolve(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "then/reject") })
  reject(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "when/resolve/thenable") }, unreachable)
  resolve(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.then(function(x) { assert(x === 5, "then/resolve/thenable") }, unreachable)
  resolve(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.when(function(x) { assert(x === p2, "when/reject/thenable") }, unreachable)
  reject(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = new Promise(function(res, rej) { resolve = res; reject = rej })
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = Promise.resolve(p2)
  p3.then(unreachable, function(x) { assert(x === 5, "then/reject/thenable") })
  reject(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = new Promise(function(res, rej) { resolve = res; reject = rej })
  p3.when(function(x) { assert(x === p2, "when/resolve2") }, unreachable)
  resolve(p2)
})()

var test = (function() {
  var resolve, reject
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = new Promise(function(res, rej) { resolve = res; reject = rej })
  p3.then(function(x) { assert(x === 5, "then/resolve2") }, unreachable)
  resolve(p2)
})()

var test = (function() {
  var resolve, reject
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = new Promise(function(res, rej) { resolve = res; reject = rej })
  p3.when(unreachable, function(x) { assert(x === 5, "when/reject2") })
  reject(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = Promise.resolve(5)
  var p2 = Promise.resolve(p1)
  var p3 = new Promise(function(res, rej) { resolve = res; reject = rej })
  p3.then(unreachable, function(x) { assert(x === 5, "then/reject2") })
  reject(5)
})()

var test = (function() {
  var resolve, reject
  var p1 = Promise.resolve(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = new Promise(function(res, rej) { resolve = res; reject = rej })
  p3.when(function(x) { assert(x === p2, "when/resolve/thenable2") }, unreachable)
  resolve(p2)
})()

var test = (function() {
  var resolve, reject
  var p1 = Promise.resolve(5)
  var p2 = {then: function(onResolve, onReject) { onResolve(p1) }}
  var p3 = new Promise(function(res, rej) { resolve = res; reject = rej })
  p3.then(function(x) { assert(x === 5, "then/resolve/thenable2") }, unreachable)
  resolve(p2)
})()
