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
  PromiseDone(promise, 'resolved', x, promise[$$onResolve])
}

function PromiseReject(promise, r) {
  PromiseDone(promise, 'rejected', r, promise[$$onReject])
}

function PromiseDone(promise, status, value, reactions) {
  if (promise[$$status] !== 'pending') return
  for (var i in reactions) PromiseReact(reactions[i][0], reactions[i][1], value)
  promise[$$status] = status
  promise[$$value] = value
  promise[$$onResolve] = promise[$$onReject] = undefined
}

function PromiseReact(deferred, handler, x) {
  Task(function() {
    try {
      var y = handler(x)
      if (y === deferred.promise)
        throw new TypeError
      else if (IsPromise(y))
        y.chain(deferred.resolve, deferred.reject)
      else
        deferred.resolve(y)
    } catch(e) {
      deferred.reject(e)
    }
  })
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

Promise.prototype.chain = function(onResolve, onReject) {
  onResolve = onResolve || function(x) { return x }
  onReject = onReject || function(e) { throw e }
  var deferred = Promise.deferred.call(this.constructor)
  switch (this[$$status]) {
    case undefined:
      throw TypeError
    case 'pending':
      this[$$onResolve].push([deferred, onResolve])
      this[$$onReject].push([deferred, onReject])
      break
    case 'resolved':
      PromiseReact(deferred, onResolve, this[$$value])
      break
    case 'rejected':
      PromiseReact(deferred, onReject, this[$$value])
      break
  }
  return deferred.promise
}

Promise.prototype.catch = function(onReject) {
  return this.chain(undefined, onReject)
}


// Extended functionality for multi-unwrapping chaining and coercive 'then'.

Promise.prototype.then = function(onResolve, onReject) {
  onResolve = onResolve || function(x) { return x }
  var that = this
  var constructor = this.constructor
  return this.chain(
    function(x) {
      x = PromiseCoerce(constructor, x)
      return x === that ? onReject(new TypeError) :
             IsPromise(x) ? x.then(onResolve, onReject) : onResolve(x)
    },
    onReject
  )
}

var thenables = new WeakMap

function PromiseCoerce(constructor, x) {
  if (IsPromise(x)) {
    return x
  } else if (x && 'then' in Object(x)) {  // can't test for callable
    if (thenables.has(x)) {
      return thenables.get(x)
    } else {
      var deferred = constructor.deferred()
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
    x.chain(result.resolve, result.reject)
    return result.promise
  }
  return this.resolved(x)

}

Promise.all = function(values) {
  var deferred = this.deferred()
  var count = 0
  var resolutions = []
  for (var i in values) {
    ++count
    this.cast(values[i]).chain(
      function(i, x) {
        resolutions[i] = x;
        if (--count === 0) deferred.resolve(resolutions);
      }.bind(undefined, i),
      function(r) {
        if (count > 0) { count = 0; deferred.reject(r) }
      }
    )
  }
  if (count === 0) deferred.resolve(resolutions)
  return deferred.promise
}

Promise.one = function(values) {  // a.k.a. Promise.race
  var deferred = this.deferred()
  var done = false
  for (var i in values) {
    this.cast(values[i]).chain(
      function(x) { if (!done) { done = true; deferred.resolve(x) } },
      function(r) { if (!done) { done = true; deferred.reject(r) } }
    )
  }
  return deferred.promise
}
