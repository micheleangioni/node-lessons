# Node Lessons

> Node Lessons are a series of exercises aimed to learn the basics of NodeJs and Express.

## Introduction

Even for experienced Javascript programmers, learning the basics of NodeJs can be tough.
The number of guides, tutorials and articles can be overwhelming and, even though NodeJs after years of crazy and almost hysteric development has entered a more mature era of its life, the number of libraries, plugins and frameworks to choose from can leave the new users quite confused.

These lessons will guide new users to explore the potential of Express, the most used framework to build Web back ends with NodeJs.
Since its low level nature, it will soon become important to rely on various npm packages to avoid drowning in the complexities of low level Javascript.

The target of this course are Javascript programmers of all experience and level. Nevertheless, it is required a certain understanding of several basic Javascript and general concepts, such:

- Basic array and object manipulation
- Promises
- Javascript modules importing through `require`
- Basic understanding of REST APIs
- Basic knowledge of MongoDB and Redis

In order to practice with Node Lessons the following software are needed to be installed:

- NodeJs v8+
- MongoDB server
- Redis server

## Installation

Just clone the repo and run `npm install` to install the needed dependencies.

## Lessons

The `/lessons` folder contains the list of lessons of this course.
Each lesson contains a `readme` file with the detailed exaplanation of the lesson itself and an implemetation of the code required to fulfill the requirements of it.

Each lesson has an exhaustive **description**, a list of **goals**, a list of **allowed npm packages**, some **requirements** and a few **suggestions**.

Moreover, each lesson inherits the goals of *all* previous lessons, but a completely *new* list of allowed npm packages and requirements is given.

As a general advice, once understood the mission and the goals of a lesson, try to implement the requirements one by one.

Suggestions can be read before starting to code or only after getting stuck, it is up to the reader.

### Lessons:

**[Lesson 1: Create a base Github Jobs inspector](lessons/lesson1-BaseWebServer/other_file.md)**

**Lesson 2: Use 'request-promise' instead of NodeJs' 'https' as an HTTP client**

**Lesson 3: Add an Express Middleware which Logs each incoming request**

**Lesson 4: Use Axios as HTTP client**

**Lesson 5: Split our single-file application into different modules**

**Lesson 6: Use Mongoose to connect to a Mongo database**

**Lesson 7: Build a simple Users REST API**

**Lesson 8: Add Authentication**

**Lesson 9: Add a Logout endpoint**

**Lesson 10: Add Web Sockets with SocketIo**

**Lesson 11: UserMakeAdminCliCommand**

## Contribution guidelines

Please follow the coding style defined in the `.eslintrc.json` file.

Pull requests are welcome.

## License

Node Lessons is free software distributed under the terms of the MIT license.
