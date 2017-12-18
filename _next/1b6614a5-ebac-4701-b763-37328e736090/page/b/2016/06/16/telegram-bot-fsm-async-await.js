
          window.__NEXT_REGISTER_PAGE('/b/2016/06/16/telegram-bot-fsm-async-await', function() {
            var comp = module.exports=webpackJsonp([13],{238:function(e,t,a){e.exports=a(239)},239:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(0),o=n(l),s=a(15),i=n(s),r=function(){return o.default.createElement(i.default,{title:"Creating a conversational Telegram bot in Node.js with a finite state machine and async/await",date:"2016-06-16",langs:["en"]},function(){return o.default.createElement("div",null,o.default.createElement("p",null,o.default.createElement("a",{href:"https://telegram.org/"},"Telegram"),", for those who don't know it, is a free multi-platform messaging app. They release new versions with interesting features fairly often, and one of the biggest ones was without a doubt their"," ",o.default.createElement("a",{href:"https://core.telegram.org/bots"},"bot platform"),". I've been having some fun lately developing a"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-frinkiac-bot"},"couple")," ","of"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-sticker-extractor-bot"},"bots"),", and I came up with a solution for a conversation-based bot based on a finite state machine that makes use of ECMAScript's upcoming"," ",o.default.createElement("a",{href:"https://tc39.github.io/ecmascript-asyncawait/"},o.default.createElement("code",null,"async"),"/",o.default.createElement("code",null,"await"))," ","that I believe is decent and interesting enough to share. I'll explain it by creating a new bot from scratch."),o.default.createElement("h2",null,"Intro"),o.default.createElement("p",null,"Telegram's bot API is stateless. The only data you get regarding the conversation before is the id of the message the user is replying to, if any. Initially, this means that the bot can only respond easily to single commands, but can't have a more natural conversation to accomplish a complex task."),o.default.createElement("p",null,"Luckily, the API provides us with an option to force a reply from the user when sending a message. This means that, unless the user actively cancels it, every message sent can be a reply to a previous message of the bot. This will allow us to build a bot that can keep track of each conversation it has and collect data in several steps."),o.default.createElement("p",null,"We're going to build a simple echo bot, but with some conversational characteristics. When the bot receives the ",o.default.createElement("code",null,"/start")," ","command, it will ask for the user's name. After that, it will start echoing mentioning the name of the user it is echoing to. Upon receiving a ",o.default.createElement("code",null,"/stop")," command, it will ask for confirmation. If the user says ",o.default.createElement("em",null,"yes"),", then the bot will stop echoing, if the user says ",o.default.createElement("em",null,"no"),", it will go back to echoing, and if the user says anything else it will ask for clarification."),o.default.createElement("p",null,"I find Node.js fitting as a platform for building the bots - all operations through Telegram's API are asynchronous and most of the time I end up relying on yet more IO for the specific features of the bots. Node.js makes it easier to build bots that can respond to multiple conversations at a time without blocking."),o.default.createElement("p",null,"You can see all the code"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-bot-example"},"here"),". You'll have to register a bot and set its key in a ",o.default.createElement("code",null,".env")," ","file if you want to try it. See the exact instructions in the README file."),o.default.createElement("h2",null,"First commit"),o.default.createElement("p",null,"The"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-bot-example/commit/91f4413d2ae33f643825a75596a19b03895549bc"},"first commit")," ","has nothing really specific to the topic, so I'll just go over the tools and libraries we'll be using. Perhaps the only thing slightly related is adding ",o.default.createElement("a",{href:"https://babeljs.io"},"babel")," that we'll eventually need for transpiling the async functions, but we'll need to do some more configuration for that. So, feel free to skip to the next section if you're not interested on what's on that basic setup."),o.default.createElement("p",null,"Looking at the ",o.default.createElement("code",null,"package.json")," file, we have"," ",o.default.createElement("code",null,"eslint")," in our dev dependencies, together with"," ",o.default.createElement("code",null,"babel-eslint")," that will be needed for ESLint to play nicely with our async functions. I'm also using ",o.default.createElement("code",null,"nodemon")," ","to automatically reload my files during development. The runtime dependencies include ",o.default.createElement("code",null,"babel")," and"," ",o.default.createElement("code",null,"babel-register")," to easily transpile our code, Babel's preset for ES2015 and",o.default.createElement("code",null,"dotenv")," to load the bot's token from a ",o.default.createElement("code",null,".env")," ","file."),o.default.createElement("p",null,"The ",o.default.createElement("code",null,"index.js")," file simply uses ",o.default.createElement("code",null,"dotenv")," to load the environment variables from ",o.default.createElement("code",null,".env"),", starts"," ",o.default.createElement("code",null,"babel-register")," and initializes the bot (which at this point just logs to the console and exits)."),o.default.createElement("p",null,"The rest are configuration files for the various tools -"," ",o.default.createElement("code",null,".eslintrc")," for ESLint, ",o.default.createElement("code",null,".babelrc")," for Babel,"," ",o.default.createElement("code",null,".nvmrc")," to specify Node's version with NVM and"," ",o.default.createElement("code",null,".editorconfig")," to keep a consistent style while writing the code."),o.default.createElement("h2",null,"Echoing"),o.default.createElement("p",null,"The"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-bot-example/commit/1686a61f026fbd28ee9a1a6244ad80ef8684acb9"},"next step")," ","is having the bot actually doing something. Before we dive into the code, we'll have to actually create the bot in the platform. To do that, talk to"," ",o.default.createElement("a",{href:"https://web.telegram.org/#/im?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3Dbotfather"},"@BotFather")," ","and follow the steps. It boils down to giving your bot a name. After that, you'll get a token that the bot will use to identify itself when querying Telegram's API. Keep that somewhere safe and let's start working on some basic functionality."),o.default.createElement("p",null,"First things first, for a while I've been coding the interaction with Telegram's API manually, using"," ",o.default.createElement("a",{href:"https://www.npmjs.com/package/request"},o.default.createElement("code",null,"request")," "),"or"," ",o.default.createElement("a",{href:"https://www.npmjs.com/package/got"},o.default.createElement("code",null,"got"))," ","to make the requests. There are a number of already implemented solutions available in NPM so this time I went with"," ",o.default.createElement("a",{href:"https://www.npmjs.com/package/node-telegram-bot-api"},o.default.createElement("code",null,"node-telegram-bot-api")),". It has most of the API functionality implemented and it handles replies very well. So let's install it:"),o.default.createElement("pre",null,"npm i node-telegram-bot-api --save"),o.default.createElement("p",null,"Now let's update our ",o.default.createElement("code",null,"Bot")," class - it will use an instance of the class exported by ",o.default.createElement("code",null,"node-telegram-bot-api")," ","as a client to interact with Telegram's API:"),o.default.createElement("pre",null,"\nimport TelegramBotClient from 'node-telegram-bot-api'\n\nexport default class Bot {\n  constructor(token) {\n    this.client = new TelegramBotClient(token, { polling: true })\n  }\n\n  start() {\n    this.client.on('message', message => {\n      console.log('Got a message', message)\n    })\n  }\n}\n"),o.default.createElement("p",null,"Note that we need to pass two parameters to the client - the"," ",o.default.createElement("code",null,"token")," is pretty simple, it's the token we got from @BotFather. The options object is setting up the client to poll for updates. Your bot has two ways to get messages from Telegram. The first one is using a webhook. You can configure the platform to push the messages to some endpoint that you own and read the messages from there. This is a clean solution but at the same time it implies more configuration. For instance, the endpoint"," ",o.default.createElement("em",null,"has")," to be accessible through HTTPS. Self-signed certificates work, but it's still more troublesome to configure that than using polling."),o.default.createElement("p",null,"The polling method (",o.default.createElement("a",{href:"https://en.wikipedia.org/wiki/Push_technology#Long_polling"},"long polling"),", actually) makes a request to Telegram to fetch updates. If there are none, Telegram's server will just hold until there's one or a timeout is reached. That way, immediately after a new update comes through, Telegram will resolve the pending request and your bot will get it almost immediately."),o.default.createElement("p",null,"So how do we get the bot's token to the client? That's where"," ",o.default.createElement("code",null,"dotenv")," comes in. We don't want the token to be hardcoded and available for everyone with access to the code. So we'll put the token in a ",o.default.createElement("code",null,".env")," file, like"),o.default.createElement("pre",null,"BOT_TOKEN=123456789:abcdefghijklmnoprqstuvwxyz"),o.default.createElement("p",null,"Since we're already calling ",o.default.createElement("code",null,"dotenv.load()")," in our"," ",o.default.createElement("code",null,"index.js")," file, we have everything that's on"," ",o.default.createElement("code",null,".env")," available in"," ",o.default.createElement("code",null,"process.env"),". So we'll update ",o.default.createElement("code",null,"index.js")," to pass that token to our ",o.default.createElement("code",null,"Bot")," instance:"),o.default.createElement("pre",null,"-var bot = new Bot() +var bot = new Bot(process.env.BOT_TOKEN)"),o.default.createElement("p",null,"So far so good, our bot logs each message it receives. Let's take one more step and make it echo whatever it receives. It's rather simple using ",o.default.createElement("code",null,"node-telegram-bot-api"),", we just need to tell it what message we want to send (the exact text we got) and to which chat (the one we got it from):"),o.default.createElement("pre",null,"\n-    console.log('Got a message', message)\n+    this.client.on('message', message => {\n+      this.client.sendMessage(message.chat.id, message.text)\n+    })\n"),o.default.createElement("p",null,"And that's it! At this point we have a bot that echoes whatever we send to it. Let's move onto having a very simple conversation leveraging ",o.default.createElement("code",null,"async"),"/",o.default.createElement("code",null,"await"),"."),o.default.createElement("h2",null,"Async/Await"),o.default.createElement("p",null,"Now we want to make our bot stop echoing. When the bot receives a message saying ",o.default.createElement("em",null,"stop"),", it will just say it stopped echoing. For that, we want to force the user to reply to each echo of the bot. You can see all the code in the"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-bot-example/commit/0b93835276b14a57c44c113bb12d70660e883085"},"third commit"),"."),o.default.createElement("p",null,'This could\'ve been done without waiting for replies - just make the bot send the message "Stopping" if the user sent the message "stop". It wouldn\'t actually ',o.default.createElement("em",null,"stop")," doing anything, but the end result would be the same. Let's do it waiting for a user reply for now and then we'll see an example which really needs the replies in the next step."),o.default.createElement("p",null,"We'll use the"," ",o.default.createElement("a",{href:"https://core.telegram.org/bots/api#forcereply"},o.default.createElement("code",null,"ForceReply"))," ","option in the send messages API to make Telegram automatically show the user the UI to reply to the bot's last message. Our code for sending the echo will now look like this:"),o.default.createElement("pre",null,"\nthis.client.sendMessage(message.chat.id,\n                        `echo: ${text}`,\n                        { reply_markup: JSON.stringify({ force_reply: true }) })\n"),o.default.createElement("p",null,"Note that we have to pass the options as a string, so we'll use"," ",o.default.createElement("code",null,"JSON.stringify")," for that."),o.default.createElement("p",null,o.default.createElement("code",null,"sendMessage")," returns a promise that gets resolved with the sent message once it went through and which has some interesting information about it, namely its id which can be used to wait for a reply. ",o.default.createElement("code",null,"node-telegram-bot-api")," has a method called",o.default.createElement("code",null,"onReplyToMessage")," which will execute a callback when a message comes that is a reply for a specific message id. So let's put those two together to handle our user's first reply:"),o.default.createElement("pre",null,"\nthis.client.sendMessage(message.chat.id,\n                        `echo: ${text}`,\n                        { reply_markup: JSON.stringify({ force_reply: true }) })\n    .then(reply => console.log(reply))\n"),o.default.createElement("p",null,"Nice. So what do we actually want to do with the reply? Well, if"," ",o.default.createElement("code",null,"reply.text === 'stop'"),", we want to stop echoing, otherwise we want to echo again. And wait for another reply. So basically the same thing we just did. Let's extract it to a method then:"),o.default.createElement("pre",null,"\nrespondTo(message) {\n  if (message.text === 'stop') {\n    this.client.sendMessage(message.chat.id, 'Stopping')\n  } else {\n    this.respondToMessage(message)\n  }\n}\n\nrespondToMessage(message) {\n  this.client.sendMessage(message.chat.id,\n                          `echo: ${text}`,\n                          { reply_markup: JSON.stringify({ force_reply: true }) })\n    .then(sentMessage => {\n      this.client.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, reply => {\n        if (reply.text === 'stop') {\n          this.client.sendMessage(message.chat.id, 'Stopping')\n        } else {\n          this.respondToMessage(reply)\n        }\n      })\n    })\n}\n"),o.default.createElement("p",null,"That should do the trick, right? Well, yes. But the code is (maybe arguably) harder to read than if it were synchronous. We have some nesting when the algorithm is basically a ",o.default.createElement("code",null,"while")," loop. So what if the code could look more like this:"),o.default.createElement("pre",null,"\nrespondTo(message) {\n  let text = message.text\n\n  while (text !== 'stop') {\n    let sentMessage = this.client.sendMessage(message.chat.id,\n                                              `echo: ${text}`,\n                                              { reply_markup: JSON.stringify({ force_reply: true }) })\n    let reply = this.client.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id)\n    text = reply.text\n  }\n\n  this.client.sendMessage(message.chat.id, 'Stopping')\n}\n"),o.default.createElement("p",null,"Hint: it can, and it will. That's where ",o.default.createElement("code",null,"async")," and"," ",o.default.createElement("code",null,"await")," come in. The"," ",o.default.createElement("a",{href:"https://tc39.github.io/ecmascript-asyncawait/"},"Async Functions proposal")," ","aims to make it simpler to write asynchronous code like the above. It leverages the power of"," ",o.default.createElement("a",{href:"https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*"},"generators")," ","and"," ",o.default.createElement("a",{href:"https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise"},"promises")," ","- and can actually be considered"," ",o.default.createElement("a",{href:"https://tc39.github.io/ecmascript-asyncawait/#desugaring"},"syntax sugar over both")," ","- to make writing code that interacts with promises very straightforward."),o.default.createElement("p",null,"The first keyword, ",o.default.createElement("code",null,"async"),", is used in function declarations to make it clear that they are asynchronous. In practice, this means that they'll return promises. In our case, we just need to declare ",o.default.createElement("code",null,"respondTo")," as"," ",o.default.createElement("code",null,"async respondTo"),"."),o.default.createElement("p",null,o.default.createElement("code",null,"await")," can only be used in ",o.default.createElement("code",null,"async")," functions. It will take the promise following it and stop execution until it resolves. Putting the two of them together means that, roughly, the following two snippets are equivalent:"),o.default.createElement("pre",null,"\nfunction syncFunction() {\n  return someAsyncOperation()\n    .then(result => result + 1)\n    .catch(err => console.error(err))\n}\n\nasync function asyncFunction() {\n  try {\n    let result = await someAsyncOperation()\n    return result + 1\n  } catch (err) {\n    console.error(err)\n  }\n}\n"),o.default.createElement("p",null,"Going back to our code, the first step we need to take is to configure Babel to support async functions. Since they're not part of the spec yet, they aren't supported by default. So first, we want to install ",o.default.createElement("code",null,"babel-plugin-transform-async-to-generator")," ","along with ",o.default.createElement("code",null,"babel-polyfill"),":"),o.default.createElement("pre",null,"npm i babel-plugin-transform-async-to-generator babel-polyfill --save"),o.default.createElement("p",null,"Once that's done, we need to add"," ",o.default.createElement("code",null,"require('babel-polyfill')")," before requiring"," ",o.default.createElement("code",null,"babel-register")," in our ",o.default.createElement("code",null,"index.js")," file, and configure Babel to use the async transformation plugin in our"," ",o.default.createElement("code",null,".babelrc")," file:"),o.default.createElement("pre",null,'\n{\n  "presets": [\n    "es2015"\n  ],\n  "plugins": [\n    "transform-async-to-generator"\n  ]\n}\n'),o.default.createElement("p",null,"Now we can go and use async functions in the bot's code. We can use"," ",o.default.createElement("code",null,"await")," directly with"," ",o.default.createElement("code",null,"this.client.sendMessage")," since, as we saw before, it returns a promise. ",o.default.createElement("code",null,"this.client.onReplyToMessage")," is a little bit trickier - it doesn't return a promise, instead it executes a callback that it receives as the last parameter when the reply arrives. We'll have to turn it into a promise, but luckily that's not hard at all:"),o.default.createElement("pre",null,"\nlet reply = await new Promise(resolve =>\n  this.client.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, resolve)\n)\n"),o.default.createElement("p",null,"I won't go into the details of promise creation since there are good posts out there, but the gist of it is that we're creating a new promise that gets resolved when"," ",o.default.createElement("code",null,"this.client.onReplyToMessage")," executes its callback, and the value it resolves to is the parameter that's passed to that callback. So if we put everything together, we end up with something like this:"),o.default.createElement("pre",null,"\nasync respondTo(message) {\n  let text = text = message.text\n\n  while (text !== 'stop') {\n    let sentMessage = await this.client.sendMessage(message.chat.id,\n                                                    `echo: ${text}`,\n                                                    { reply_markup: JSON.stringify({ force_reply: true }) })\n    let reply = await new Promise(resolve => this.client.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, resolve))\n    text = reply.text\n  }\n\n  this.client.sendMessage(message.chat.id, 'Stopping')\n}\n"),o.default.createElement("p",null,"Note that we marked ",o.default.createElement("code",null,"respondTo")," as ",o.default.createElement("code",null,"async"),", and then used two ",o.default.createElement("code",null,"await"),"s in the body of the"," ",o.default.createElement("code",null,"while")," loop. And that's it! The code certainly reads a lot easier, almost as if it were synchronous. It could be better if we didn't have to \"promisify\" the call to"," ",o.default.createElement("code",null,"this.client.onReplyToMessage")," but it's definitely easier to follow than the version without ",o.default.createElement("code",null,"async"),"/",o.default.createElement("code",null,"await"),"."),o.default.createElement("p",null,"One more change we'll have to do for this to work - while the user replies will get to the callback in"," ",o.default.createElement("code",null,"this.client.onReplyToMessage"),", they are also regular messages so they will show up in our callback to"," ",o.default.createElement("code",null,"this.client.on('message')")," as well. So we have to update that callback to only take into account messages which are not replies. Replies will already be caught by the loop."),o.default.createElement("pre",null,"\nstart() {\n  this.client.on('message', message => {\n    if (!message.reply_to_message) {\n      this.respondTo(message)\n    }\n  })\n}\n"),o.default.createElement("p",null,"Having done this, it's time to model more complex behavior in the form of a state machine."),o.default.createElement("h2",null,"Finite State Machine"),o.default.createElement("p",null,"Let's remember the final functionality we expect from the bot. It should ask us for our name upon ",o.default.createElement("code",null,"/start"),". Then, it should start echoing whatever we send to it, until we say"," ",o.default.createElement("code",null,"/stop"),'. When we send that command, it should ask us for confirmation. If we say "yes", the execution should finish. If we say "no", it should go back to echoing. If we say anything else, it should ask for clarification.'),o.default.createElement("p",null,"There might be several ways to model this behavior. What I know for sure is that I want to avoid having a bunch of flags and complicated conditionals that are checked on each reply, because the pain it would be to write it wouldn't be comparable to the pain of maintaining it. So one possible way to create a mental model of it is to think of the bot being in one of several states, and being able to transition between them:"),o.default.createElement("p",null,o.default.createElement("img",{src:"/static/images/blog/telegram-fsm.png",alt:"Bot states",title:""})),o.default.createElement("p",null,"It's been a while since I studied finite state machines so I'm not going to pretend I remember them well enough to explain it here. I'll refer to the always trustworthy"," ",o.default.createElement("a",{href:"https://en.wikipedia.org/wiki/Finite-state_machine"},"Wikipedia article")," ","for them, but if you want a quick explanation that's enough for the purposes of this post, here it goes."),o.default.createElement("p",null,"A finite state machine (FSM from now on) is a model that is composed of states, and the transitions between them. The machine is always in one of those states, until an event comes that makes it change to another. Some of those states can be considered final or terminal."),o.default.createElement("p",null,"Not surprisingly, that model fits the diagram of the bot above pretty well. The bot will be in one of several states, which mostly represent what is it waiting for - the ",o.default.createElement("code",null,"/start")," command, a name, text to echo and so on. It will be our job to determine, based on the current state of the machine and the message we get from Telegram's API, what's the corresponding event."),o.default.createElement("p",null,"Again, you can check the"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-bot-example/commit/ffb568314ad5f8f531828246495f0cc1852e0e2c"},"corresponding commit")," ","to see the changes."),o.default.createElement("h3",null,"Defining the state machine"),o.default.createElement("p",null,"Let's start by installing a library that will handle the FSM internals. I'll go with"," ",o.default.createElement("a",{href:"https://www.npmjs.com/package/javascript-state-machine"},o.default.createElement("code",null,"javascript-state-machine"))," ","but it's likely there are plenty of others."),o.default.createElement("pre",null,"npm i javascript-state-machine --save"),o.default.createElement("p",null,"Now let's write the FSM from above using the library. Since an instance of the FSM keeps track of its current state, we want to have one instance per conversation. So we'll start by defining a function that creates the machine:"),o.default.createElement("pre",null,"\nimport StateMachine from 'javascript-state-machine'\n\nfunction createFsm() {\n  return StateMachine.create({\n    initial: 'waitingstart',\n    final: 'final',\n    events: [\n      { name: 'gotstart', from: 'waitingstart', to: 'waitingname' },\n      { name: 'gotname', from: 'waitingname', to: 'echoing' },\n      { name: 'gottext', from: 'echoing', to: 'echoing' },\n      { name: 'gotstop', from: 'echoing', to: 'confirm' },\n      { name: 'confirmed', from: 'confirm', to: 'final' },\n      { name: 'cancelled', from: 'confirm', to: 'echoing' },\n      { name: 'invalid', from: 'confirm', to: 'confirm' }\n    ]\n  })\n}\n"),o.default.createElement("p",null,"If you take a look at each event, they represent the transitions defined in the diagram. The states aren't explicitly listed, but you'll see all of them in the transitions. We can use that function in ",o.default.createElement("code",null,"respondTo")," to get a new FSM for the conversation. Also, now we have a fancier way to check if the conversation has ended - we can use the method ",o.default.createElement("code",null,"isFinished")," from the state machine to check for a final state. Let's update the code then:"),o.default.createElement("pre",null,"\nasync respondTo(message) {\n  let fsm = createFsm()\n  let lastReply = message\n\n  while (!fsm.isFinished()) {\n    let text = lastReply.text\n    let event = eventFromStateAndMessageText(fsm.current, text)\n\n    if (!event || fsm.cannot(event)) {\n      this.client.sendMessage(message.chat.id, 'I wasn't expecting that, try /start')\n      break\n    }\n\n    fsm[event](lastReply)\n\n    let sentMessage = await lastMessage\n    lastReply = await new Promise(resolve => this.client.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, resolve))\n  }\n}\n"),o.default.createElement("p",null,"Besides using ",o.default.createElement("code",null,"fsm.isFinished()")," as our"," ",o.default.createElement("code",null,"while")," condition, we're using"," ",o.default.createElement("code",null,"fsm.cannot(event)"),". This means that once we figured out what event corresponds to the received message, we can check if the machine can actually apply that transition. Otherwise, it means the user sent something we weren't expecting. This doesn't necessarily applies to this case, since we're already considering the current state when deciding which event we should trigger, but it's useful in more complex situations."),o.default.createElement("p",null,"Notice that we have a ",o.default.createElement("code",null,"lastMessage")," variable that's not defined yet. Let's keep it there for now and we'll go back to it, but basically it holds the last message the bot sent, so we can then wait for a reply to it."),o.default.createElement("p",null,"Also notice that we're calling ",o.default.createElement("code",null,"fsm[event](lastReply)")," to make the FSM transition states. The FSM has a method for each event we defined for it that will trigger such event. We can pass arbitrary parameters to that method, which we'll use later in the callbacks."),o.default.createElement("p",null,"Let's go to that ",o.default.createElement("code",null,"eventFromStateAndMessageText")," function now. We'll pass the current machine state and the text from the last user reply, and expect to receive a string with the event. We consider the case where the event is ",o.default.createElement("code",null,"undefined"),", because it can happen that given the current state, there's no valid event for the message we got. The kind of logic that'll go in this function goes something like \"if I'm waiting for the /start command and I get the /start text, the event is 'gotstart'\", \"if I'm waiting for the name, whatever text I received generates the 'gotname' event\" and so on:"),o.default.createElement("pre",null,"\nfunction eventFromStateAndMessageText(state, text) {\n  switch (state) {\n  case 'waitingstart':\n    return text === '/start' && 'gotstart'\n    break\n  case 'waitingname':\n    return 'gotname'\n    break\n  case 'echoing':\n    return text === '/stop' ? 'gotstop' : 'gottext'\n    break\n  case 'confirm':\n    if (text === 'yes') {\n      return 'confirmed'\n    } else if (text === 'no') {\n      return 'cancelled'\n    } else {\n      return 'invalid'\n    }\n  }\n}\n"),o.default.createElement("h3",null,"Defining the machine's behavior"),o.default.createElement("p",null,"Now to the last part: where are we actually replying to the user? Well, the FSM provides us with a couple of callbacks, specifically when the machine enters and leaves a state, and before and after executing an event. Each have their use cases, but the way we thought our bot here I believe using the event callbacks makes sense - after I get /start, I want to ask for the name. After I got a name, I want to start echoing, and so on."),o.default.createElement("p",null,"We want to attach these callbacks to the machine inside"," ",o.default.createElement("code",null,"respondTo")," though, because we need some context for them - we want the chat id we're responding to, and we want access to the Telegram client to be able to send messages back. So, before the"," ",o.default.createElement("code",null,"while")," loop we'll define all the callbacks:"),o.default.createElement("pre",null,"\nlet name\nlet lastMessage\n\nfsm.ongotstart = () => {\n  lastMessage = this.client.sendMessage(message.chat.id,\n                                        'Let's begin! What's your name?',\n                                        { reply_markup: JSON.stringify({ force_reply: true }) })\n}\n\nfsm.ongotname = (event, from, to, message) => {\n  name = message.text\n  lastMessage = this.client.sendMessage(message.chat.id,\n                                        `Got it ${name}, I'll begin echoing your replies until you respond with /stop`,\n                                        { reply_markup: JSON.stringify({ force_reply: true }) })\n}\n\nfsm.ongottext = (event, from, to, message) => {\n  lastMessage = this.client.sendMessage(message.chat.id,\n                                        `Echoing for ${name}: ${message.text}`,\n                                        { reply_markup: JSON.stringify({ force_reply: true }) })\n}\n\n/.../\n"),o.default.createElement("p",null,"I omitted some callbacks for brevity, but they're all pretty similar. That, I believe, is what makes modeling the bot as a FSM so useful. We can separate the transitions (I got this message and I was waiting for this other thing) from the actual behavior once a transition is applied. Our ",o.default.createElement("code",null,"oncancelled")," callback knows that we were echoing and got a /stop command, that was then cancelled. All it has to do is send the appropriate message back. Not even transition to another state - the FSM will handle it."),o.default.createElement("p",null,"We defined two new variables that we'll need across different messages outside of the callbacks - ",o.default.createElement("code",null,"name"),", where we'll store the name the user gives us for the current conversation, and the previously seen ",o.default.createElement("code",null,"lastMessage")," so we can then wait for it to be sent and expect a reply if needed."),o.default.createElement("p",null,"And that's all there's to it! Take a look at the finished code on"," ",o.default.createElement("a",{href:"https://github.com/julioolvr/telegram-bot-example"},"Github"),". Certainly more could be done to the bot. For instance, DRY up those ",o.default.createElement("code",null,"this.client.sendMessage")," calls, and maybe create a custom class that wraps the FSM and can keep the context needed (in particular, ",o.default.createElement("code",null,"javascript-state-machine")," has a"," ",o.default.createElement("code",null,"target")," option to extend an existing instance of another class and turn it into a FSM). But I think in its current state it already shows how useful it is to model the bot as a FSM, and how clean and readable the code is using ",o.default.createElement("code",null,"async"),"/",o.default.createElement("code",null,"await"),"."),o.default.createElement("h2",null,"Further reading"),o.default.createElement("ul",null,o.default.createElement("li",null,o.default.createElement("a",{href:"https://ponyfoo.com/articles/understanding-javascript-async-await"},"Understanding JavaScript’s async await"),", by ",o.default.createElement("a",{href:"https://twitter.com/nzgb"},"@nzgb")),o.default.createElement("li",null,o.default.createElement("a",{href:"https://github.com/yagop/node-telegram-bot-api"},o.default.createElement("code",null,"node-telegram-bot-api"))),o.default.createElement("li",null,o.default.createElement("a",{href:"https://github.com/jakesgordon/javascript-state-machine"},o.default.createElement("code",null,"javascript-state-machine")))))})};t.default=r}},[238]);
            return { page: comp.default }
          })
        