# Node Lessons

> Node Lessons is a series of exercises aimed to learn the basics of NodeJs and [Express](https://expressjs.com/).

## Introduction

Even for experienced Javascript programmers, learning the basics of NodeJs can be tough.
The number of guides, tutorials and articles can be overwhelming and, even though after years of crazy and almost hysteric development NodeJs has entered a more mature era of its life, the number of libraries, plugins and frameworks to choose from can leave new users quite disorient.

These lessons act as a guide aimed to explore the potential of Express, the most used framework to build Web Back-ends with NodeJs.
Since its low level nature, it will soon become important to rely on various external npm packages to avoid drowning in the complexities of low level Javascript.

The target of this course are Javascript programmers of all experience and level. Nevertheless, it is required a certain understanding of several basic Javascript and general concepts, such as:

- Basic array and object manipulation
- [Promises](https://scotch.io/tutorials/javascript-promises-for-dummies)
- Javascript modules importing through `require`
- Basic understanding of REST APIs
- Basic knowledge of [MongoDB](https://www.mongodb.com/) and [Redis](https://redis.io/)

In order to practice with Node Lessons the following software are needed to be installed:

- NodeJs v8+
- MongoDB server
- Redis server

In later lessons, the integration of various [Amazon Web Services (AWS)](https://aws.amazon.com/) will be presented.

In order to follow these lesson, it is suggested to create a new AWS account to benefit of the initial [free tier](https://aws.amazon.com/free/).
Nevertheless, it is possible to incur in some costs (they shouldn't be more than a few euros, if no serious errors are done while experimenting).
In any case we do **NOT** take any responsability for any cost readers could be subject to.

## Installation

Just clone the repo and run `npm install` to install the needed dependencies.

## Lessons

The `/lessons` folder contains the list of lessons of this course.
Each lesson contains a `readme` file with the detailed explanation of the lesson itself and an implemetation of the code required to fulfill the requirements.

Each lesson has an exhaustive **description**, a list of **goals**, a list of **allowed npm packages**, some **requirements** and a few **suggestions**.

Moreover, each lesson inherits the goals of *all* previous lessons, but a completely *new* list of allowed npm packages and requirements is given.

As a general advice, once understood the mission and the goals of a lesson, try to implement the requirements one by one.

Suggestions can be read before starting to code or only after getting stuck, it is up to the reader.

### Lessons:

**[Lesson 1: Create a base Github Jobs inspector](lessons/lesson1-BaseWebServer/readme.md)**

**[Lesson 2: Use 'request-promise' instead of NodeJs' 'https' as HTTP client](lessons/lesson2-RequestPromise/readme.md)**

**[Lesson 3: Add an Express Middleware which logs each incoming request](lessons/lesson3-MiddlewareLogs/readme.md)**

**[Lesson 4: Use Axios as HTTP client](lessons/lesson4-Axios/readme.md)**

**[Lesson 5: Split our single-file application into different modules](lessons/lesson5-Modularization/readme.md)**

**[Lesson 6: Use Mongoose to connect to a Mongo database](lessons/lesson6-Mongoose/readme.md)**

**[Lesson 7: Build a simple Users REST API](lessons/lesson7-SimpleUsersApi/readme.md)**

**[Lesson 8: Add Authentication](lessons/lesson8-Authentication/readme.md)**

**[Lesson 9: Add a Logout endpoint](lessons/lesson9-TokenInvalidation/readme.md)**

**[Lesson 10: Add Web Sockets with SocketIo](lessons/lesson10-SocketIo/readme.md)**

**[Lesson 11: Create a UserMakeAdmin Cli Command](lessons/lesson11-UserMakeAdminCliCommand/readme.md)**

**[Lesson 12: Create a socket.io room for Admin Users](lessons/lesson12-AdminSocketIoRoom/readme.md)**

**[Lesson 13: Allow for image profile upload using AWS to store them](lessons/lesson13-ImageUploadWithAWS/readme.md)**

**[Lesson 14: Switch to AWS DynamoDB in place of MongoDB](lessons/lesson14-SwitchToAWSDynamoDB/readme.md)**

## Contribution guidelines

Please follow the coding style defined in the `.eslintrc.json` file.

Pull requests are welcome.

## License

Node Lessons is free software distributed under the terms of the MIT license.
