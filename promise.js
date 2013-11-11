// For V8, need to run with --harmony

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
  return x && $$status in Object(x)
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
    Task(function() { tasks[i](x) })
  }
}


// Convenience.

Promise.resolved = function(x) {
  return new this(function(resolve, reject) { resolve(x) })
}

Promise.rejected = function(r) {
  return new this(function(resolve, reject) { reject(r) })
}

Promise.deferred = function() {  // Seems useful to expose as a method, too
  var result = {}
  result.promise = new this(function(resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}


// Simple chaining (a.k.a. flatMap).

Promise.prototype.when = function(onResolve, onReject) {
  onResolve = onResolve || function() {}
  onReject = onReject || function() {}
  var deferred = Promise.deferred.call(this.constructor)
  switch (this[$$status]) {
    case undefined:
      throw TypeError
    case 'pending':
      this[$$onResolve].push(PromiseChain(deferred, onResolve))
      this[$$onReject].push(PromiseChain(deferred, onReject))
      break
    case 'resolved':
      PromiseQueue([PromiseChain(deferred, onResolve)], this[$$value])
      break
    case 'rejected':
      PromiseQueue([PromiseChain(deferred, onReject)], this[$$value])
      break
  }
  return deferred.promise
}

Promise.prototype.catch = function(onReject) {
  return this.when(undefined, onReject)
}

function PromiseChain(deferred, handler) {
  return function(x) {
    try {
      var y = handler(x)
      if (y === deferred.promise)
        throw new TypeError
      else if (IsPromise(y))
        y.when(deferred.resolve, deferred.reject)
      else
        deferred.resolve(y)
    } catch(e) {
      deferred.reject(e)
    }
  }
}


// Extended functionality for multi-unwrapping chaining and coercive 'then'.

Promise.prototype.then = function(onResolve, onReject) {
  onResolve = onResolve || function() {}
  var that = this
  var constructor = this.constructor
  return this.when(
    function(x) {
      x = PromiseCoerce(constructor, x)
      return x === that ? onReject(new TypeError) :
             IsPromise(x) ? x.then(onResolve, onReject) : onResolve(x)
    },
    onReject
  )
}

var thenables = new WeakMap

function PromiseCoerce(x) {
  if (IsPromise(x)) {
    return x
  } else if (x && 'then' in Object(x)) {
    if (thenables.has(x)) {
      return thenables.get(x)
    } else {
      var deferred = this.constructor.deferred()
      thenables.set(x, deferred.promise)
      try {
        x.then(deferred.resolve, deferred.reject)
      } catch(e) {
        deferred.reject(e)
      }
      return deferred.promise
    }
  } else {
    return x
  }
}


// Combinators.

Promise.cast = function(x) {
  if (x instanceof this) return x
  if (IsPromise(x)) {
    var result = this.deferred()
    x.when(result.resolve, result.reject)
    return result.promise
  }
  return this.resolved(x)

}

Promise.all = function(values) {
  var deferred = this.deferred()
  var count = 0
  for (var i in values) {
    ++count
    this.cast(values[i]).when(
      function(x) { if (--count === 0) deferred.resolve(undefined) },
      function(r) { if (count > 0) { count = 0; deferred.reject(r) } }
    )
  }
  return deferred.promise
}

Promise.one = function(values) {
  var deferred = this.deferred()
  var done = false
  for (var i in values) {
    this.cast(values[i]).when(
      function(x) { if (!done) { done = true; deferred.resolve(x) } },
      function(r) { if (!done) { done = true; deferred.reject(r) } }
    )
  }
  return deferred.promise
}
