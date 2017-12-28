
          window.__NEXT_REGISTER_PAGE('/b/2015/07/25/syntax-error-strict-mode-phantomjs', function() {
            var comp = module.exports=webpackJsonp([15],{544:function(e,t,n){e.exports=n(545)},545:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),l=a(o),r=n(21),s=a(r),i=n(22),u=n(17),d=a(u),c=function(){return l.default.createElement(d.default,{title:"Unexplained syntax error on PhantomJS with strict mode",date:"2015-07-25",langs:["en"]},function(){return l.default.createElement("div",null,l.default.createElement("p",null,"Short story: PhantomJS considers a syntax error when a named function expression is called the same as some of its parameters, and won't be very explicit about it."),l.default.createElement("p",null,"Consider the following code:"),l.default.createElement(s.default,{language:"js",style:i.vs2015},"\n'use strict';\nvar something = function bug(bug) {};\n  "),l.default.createElement("p",null,"The fact that the function is called ",l.default.createElement("code",null,"bug"),", and the parameter is also called ",l.default.createElement("code",null,"bug"),", will trigger a syntax error in PhantomJS. Note that a function declaration has no problems with it:"),l.default.createElement(s.default,{language:"js",style:i.vs2015},"\n'use strict';\nfunction bug(bug) {}\n  "),l.default.createElement("p",null,"No syntax error there! But when there ",l.default.createElement("em",null,"is")," a syntax error, PhantomJS will only say so and won't specify what the error is. This can be kind of annoying when your automasted tests use Phantom and fail miserably while the app works fine on your browser. One good way to find the cause for these kind of bugs is that PhantomJS behaves very similar to Safari, and this specific bug is also present there. So if you happen to develop on Safari then you'll see it before it gets to Phantom, but if you don't it's a nice trick to remember the next time you have to debug a Phantom-specific bug."))})};t.default=c}},[544]);
            return { page: comp.default }
          })
        