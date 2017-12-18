
          window.__NEXT_REGISTER_PAGE('/b/2013/10/07/elasticsearch-recreate-index-tests', function() {
            var comp = module.exports=webpackJsonp([16],{229:function(e,t,n){e.exports=n(230)},230:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=n(0),r=a(l),s=n(15),o=a(s),i=function(){return r.default.createElement(o.default,{title:"Recreate ElasticSearch index for integration testing",date:"2013-10-07",langs:["en"]},function(){return r.default.createElement("div",null,r.default.createElement("p",null,"I fought against this for most of last week so now that I solved it I figured I could share it with the rest of the world (not that I had much fun running tons of Jenkins' builds to see if it was fixed...)."),r.default.createElement("p",null,"So, we have a Rails app that uses ElasticSearch for a few features. There's a single index that we query, and for integration test purposes we create a fake test index so we can go through the whole stack. We are using"," ",r.default.createElement("a",{href:"https://github.com/karmi/retire"},"Tire")," with its"," ",r.default.createElement("code",null,"Persistence")," module, so in our"," ",r.default.createElement("code",null,"spec_helper.rb")," (asuming we have a model called"," ",r.default.createElement("code",null,"Book"),") we had something along the lines of:"),r.default.createElement("pre",null,"\nbefore(:each) do\n  Book.index.delete\n  Book.create_elasticsearch_index\nend\n"),r.default.createElement("p",null,"There was some more unrelated stuff in there (like deleting the index after the whole suite was completed, or using"," ",r.default.createElement("a",{href:"https://github.com/bblimke/webmock"},"Webmock")," to ensure that we are not making any unwanted HTTP requests), the only detail that I want to mention is that you might want to wait for a"," ",r.default.createElement("a",{href:"https://github.com/karmi/retire/issues/537#issuecomment-11124205"},"yellow status")," ",'before each test to avoid "No active shards" errors.'),r.default.createElement("p",null,"Back to the problem at hand, nothing seems wrong with this, but then we started having random 404 errors because the index was missing during the examples. But it should be there, right? It should be created right after it was deleted."),r.default.createElement("p",null,"I enabled debugging on Tire's config, and I found something like the following:"),r.default.createElement("pre",null,'\n# 2013-10-04 09:25:05:839 [DELETE] ("test_index")\n#\ncurl -X DELETE http://some-server:9200/test_index</p>\n\n# 2013-10-04 09:25:05:840 [200]\n#\n# {\n#   "ok": true,\n#   "acknowledged": true\n# }\n\n# 2013-10-04 09:25:05:852 [HEAD] ("test_index")\n#\ncurl -I "http://some-server:9200/test_index"\n\n# 2013-10-04 09:25:05:852 [200]\n'),r.default.createElement("p",null,"So, right after the ",r.default.createElement("code",null,"DELETE")," request, there's a"," ",r.default.createElement("code",null,"HEAD")," request against the same index, which returns 200."),r.default.createElement("p",null,"What."),r.default.createElement("p",null,"First of all, the ",r.default.createElement("code",null,"HEAD")," request comes from Tire doing"," ",r.default.createElement("a",{href:"http://rubydoc.info/github/karmi/tire/master/Tire/Model/Indexing/ClassMethods#create_elasticsearch_index-instance_method"},"an existence check before creating the index"),". Makes sense. But why would it return 200 if the"," ",r.default.createElement("code",null,"DELETE")," request that came just before that one returned a 200 ok everything is perfect response?"),r.default.createElement("p",null,"Well, help comes from"," ",r.default.createElement("a",{href:"http://stackoverflow.com/questions/19182682/elasticsearch-async-delete-200-just-after-deleting-index-in-rails-app/19224515"},"the great people at StackOverflow"),". First comment: turns out"," ",r.default.createElement("a",{href:"http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/modules-http.html"},"the entire ES HTTP API is asynchronous"),". So yeah, I get the 200 for the ",r.default.createElement("code",null,"DELETE")," request but the index wasn't necessarily deleted yet. So, what do we do? Follow the suggestion at the accepted answer for that question: poll ES until we are sure that the index was deleted."),r.default.createElement("p",null,"So, in our Tire initializer, I added:"),r.default.createElement("pre",null,'\nTire::Index.class_eval do\n  def ensure_deleted\n    5.times do\n      return true unless exists?\n    end\n\n    raise "The ElasticSearch index wasn\'t successfully deleted."\n  end\nend\n          '),r.default.createElement("p",null,"And then modified the hooks to look like:"),r.default.createElement("pre",null,"\nbefore(:each) do\n  Book.index.ensure_deleted\n  Book.create_elasticsearch_index\nend\n\nafter(:each) do\n  Book.index.delete\nend\n            "),r.default.createElement("p",null,"So basically, we check five times to see if the index was deleted. I didn't show the whole log, but in all the failures only one request returned the fake 200 after the ",r.default.createElement("code",null,"DELETE"),", the next one always returned 404 correctly, so limiting it to 5 tries made sense."),r.default.createElement("p",null,"That's it! I hope this can save someone some time and the anger against the world that I went through."))})};t.default=i}},[229]);
            return { page: comp.default }
          })
        