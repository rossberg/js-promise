// For V8, run with --harmony

"use strict"

// A shim for creating microtasks.
function Task(task) {
  if (typeof setTimeout !== 'undefined') {
    setTimeout(task, 0)
  } else if (Object.observe) {
    var dummy = {}
    Object.observe(dummy, task)
    dummy.dummy = dummy
  } else {
    throw "No tasks available"
  }
}


// Core functionality.

var $$status = Symbol("Promise#status")
var $$value = Symbol("Promise#value")
var $$onResolve = Symbol("Promise#onResolve")
var $$onReject = Symbol("Promise#onReject")

function IsPromise(x) {
  return typeof x === 'object' && x !== null && $$status in x
}

function Promise(resolver) {
  this[$$status] = 'pending'
  this[$$onResolve] = []
  this[$$onReject] = []
  var that = this
  resolver(function(x) { PromiseResolve(that, x) },
           function(r) { PromiseReject(that, r) })
}

function PromiseResolve(promise, x) {
  if (promise[$$status] !== 'pending') throw TypeError
  PromiseQueue(promise[$$onResolve], x)
  promise[$$value] = x
  promise[$$onResolve] = promise[$$onReject] = undefined
  promise[$$status] = 'resolved'
}

function PromiseReject(promise, r) {
  if (promise[$$status] !== 'pending') throw TypeError
  PromiseQueue(promise[$$onReject], r)
  promise[$$value] = r
  promise[$$onResolve] = promise[$$onReject] = undefined
  promise[$$status] = 'rejected'
}

function PromiseQueue(tasks, x) {
  for (var i in tasks) {
    Task(function() { tasks[i](x) }, 0)
  }
}

function PromiseChain(resolve, reject, handler) {
  return function(x) {
    try {
      var y = handler(x)
      if (IsPromise(y))
        y.when(resolve, reject)
      else
        resolve(y)
    } catch(e) {
      reject(e)
    }
  }
}

Promise.resolve = function(x) {
  return new Promise(function(resolve, reject) { resolve(x) })
}

Promise.reject = function(r) {
  return new Promise(function(resolve, reject) { reject(r) })
}

// One level unwrapping (a.k.a. flatMap).
Promise.prototype.when = function(onResolve, onReject) {
  var that = this
  return new Promise(function(resolve, reject) {
    switch (that[$$status]) {
      case undefined:
        throw TypeError
      case 'pending':
        that[$$onResolve].push(PromiseChain(resolve, reject, onResolve))
        that[$$onReject].push(PromiseChain(resolve, reject, onReject))
        break
      case 'resolved':
        PromiseQueue([PromiseChain(resolve, reject, onResolve)], that[$$value])
        break
      case 'rejected':
        PromiseQueue([PromiseChain(resolve, reject, onReject)], that[$$value])
        break
    }
  })
}

Promise.prototype.catch = function(onReject) {
  return this.when(undefined, onReject)
}


// Extended functionality for multi-unwrapping and coercive 'then'.

Promise.prototype.then = function(onResolve, onReject) {
  return this.when(
    function(x) {
      x = PromiseCoerce(x)
      return IsPromise(x) ? x.then(onResolve, onReject) : onResolve(x)
    },
    onReject
  )
}

var thenables = new WeakMap

function PromiseCoerce(x) {
  if (IsPromise(x)) {
    return x
  } else if (typeof x === 'object' && x !== null && 'then' in x) {
    if (thenables.has(x)) {
      return thenables.get(x)
    } else {
      var resolve, reject
      var promise = new Promise(function(res, rej) { resolve = res; reject = rej })
      thenables.set(x, promise)
      x.then(resolve, reject)
      return promise
    }
  } else {
    return x
  }
}
