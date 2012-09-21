# **node-campfire** #

A node.js wrapper for the [Campfire](http://www.campfirenow.com) (by [37signals](http://37signals.com/)) API.

https://github.com/potrebic/node-campfire

This code isn't in a released state yet.

>This is my first node.js project. This package will be used in another project that I'm working on - [Smoke Signal](https://github.com/potrebic/smokesignal). I wrote the first version of smoke Signal in C#/.Net, and rewriting it in node as a learning experience

The notion was to create a minimal wrapper around the campfire APIs. This package doesn't define any sort of 'entity' objects that represent the campfire objects such as room, message, user. Rather this API simply deals with json objects that come through the campfire API.

## **Unit tests** ##
The unit tests can be run using the following command:
> mocha -u tdd -R tap

If want to run the tests against the real campfire API please see:
> test/lib/support.js

And in this case you might want to extend the default timeout for the tests like so:

>mocha -u tdd -t 5000 -R tap


## **tests** ##
There isn't support for 2 sets of campfire APIs:

- uploads
- streaming


## **License** ##
Copyright (c) 2012 Peter Potrebic. All rights reserved.

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE
