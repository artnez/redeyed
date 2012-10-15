'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , util = require('util')
  , redeyed = require('..')

function inspect (obj) {
  return util.inspect(obj, false, 5, true)
}

test('adding custom asserts ... ', function (t) {
  t.constructor.prototype.assertSurrounds = function (code, opts, expected) {
    var result = redeyed(code, opts);
    this.equals(result, expected, inspect(code) + ' => ' + inspect(expected))
    return this;
  }

  t.end() 
})
test('\nkeywords', function (t) {

  var opts001 = { Keyword: { _before: '*', _after: '&' } };  
  t.test('\n# ' + inspect(opts001), function (t) {
    t.assertSurrounds('this', opts001, '*this&')
    t.assertSurrounds('this ', opts001, '*this& ')
    t.assertSurrounds(' this', opts001, ' *this&')
    t.assertSurrounds('  this  ', opts001, '  *this&  ')
    t.assertSurrounds('if (a == 1) return', opts001, '*if& (a == 1) *return&')
    t.assertSurrounds('var n = new Test();', opts001, '*var& n = *new& Test();')
    t.assertSurrounds(
        [ 'function foo (bar) {'
        , ' var a = 3;'
        , ' return bar + a;'
        , '}'
        ].join('\n')
      , opts001
      , [ '*function& foo (bar) {'
        , ' *var& a = 3;'
        , ' *return& bar + a;'
        , '}'
        ].join('\n'))
    t.end()
  })
  
  var opts002 = { 
    Keyword: { 
        'function': { _before: '^' }
      , 'return': { _before: '(', _after: ')' }
      ,  _before: '*'
      , _after: '&' 
    } 
  };  

  t.test('\n# ' + inspect(opts002), function (t) {
    t.assertSurrounds(
        [ 'function foo (bar) {'
        , ' var a = 3;'
        , ' return bar + a;'
        , '}'
        ].join('\n')
      , opts002
      , [ '^function& foo (bar) {'
        , ' *var& a = 3;'
        , ' (return) bar + a;'
        , '}'
        ].join('\n'))
    t.end()
  })
})
