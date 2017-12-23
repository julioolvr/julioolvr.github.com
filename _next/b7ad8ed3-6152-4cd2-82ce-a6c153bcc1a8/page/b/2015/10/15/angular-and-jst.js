
          window.__NEXT_REGISTER_PAGE('/b/2015/10/15/angular-and-jst', function() {
            var comp = module.exports=webpackJsonp([14],{499:function(e,t,a){e.exports=a(500)},500:function(e,t,a){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(0),r=l(n),o=a(18),i=l(o),u=a(19),s=a(15),c=l(s),d=function(){return r.default.createElement(c.default,{title:"Using JST as a source of Angular templates",date:"2015-10-15",langs:["en"]},function(){return r.default.createElement("div",null,r.default.createElement("p",null,"If you're using Rails, a nice tool to expose your Javascript templates is"," ",r.default.createElement("a",{href:"https://github.com/sstephenson/sprockets#javascript-templating-with-ejs-and-eco"},"JST"),". JST allows you to write HTML templates for your JS library of choice, and it exposes them in a ",r.default.createElement("code",null,"JST")," global object on the client side, using their path relative to the Javascript asset's path as the key. They play nicely with Angular.js and there's a way to make Angular \"JST aware\" so to speak."),r.default.createElement("p",null,"Usually, if you're writing some piece of Angular code that uses a template like a directive or a route, you would be able to use your JST templates writing something like:"),r.default.createElement(i.default,{language:"js",style:u.vs2015},"\nangular.module('app')\n  .directive('someDirective', function() {\n    return {\n      template: JST['some/template/path']()\n    };\n  });\n  "),r.default.createElement("p",null,"This would execute the template function generated by JST, generate the HTML and set it as the directive's template. This is all fine, but let's look at some other ways of doing it."),r.default.createElement("p",null,"When we try to find a template with an URL, Angular's first step is to look for it on its ",r.default.createElement("code",null,"$templateCache"),". If it can't find it, it will try to fetch it from the server. Knowing that, we can manually inject our templates in the"," ",r.default.createElement("code",null,"$templateCache"),":"),r.default.createElement(i.default,{language:"js",style:u.vs2015},"\nangular.module('app')\n  .directive('someDirective', function() {\n    return {\n      templateUrl: 'some/template/path'\n    };\n  })\n  .run(['$templateCache', function($templateCache) {\n    $templateCache.put('some/template/path', JST['some/template/path']);\n  }]);\n  "),r.default.createElement("p",null,"In this case, we're providing the ",r.default.createElement("code",null,"$templateCache")," ","directly with a function that will generate the template. Angular will find and use it when looking for that"," ",r.default.createElement("code",null,"templateUrl"),". Now, this is all very repetitive, and we can avoid it by"," ",r.default.createElement("a",{href:"https://docs.angularjs.org/api/auto/service/$provide#decorator"},"decorating")," ","the ",r.default.createElement("code",null,"$templateCache")," that is used all over Angular to make it try and fetch from JST first."),r.default.createElement(i.default,{language:"js",style:u.vs2015},"\nangular.module('app')\n  .config(['$provide', function($provide) {\n    $provide.decorator('$templateCache', function ($delegate) {\n        var get = $delegate.get;\n\n        $delegate.get = function (key) {\n          return JST[key] || get(key);\n        }\n\n        return $delegate;\n    });\n  }]);\n  "),r.default.createElement("p",null,"And that's it! From then on, you can use a JST key anywhere you'd use a template URL and Angular will automatically take it from JST."))})};t.default=d}},[499]);
            return { page: comp.default }
          })
        