# Node Lessons

### Lesson 3: Add an Express Middleware which logs each incoming request

**Description**
[Middlewares](https://expressjs.com/en/guide/using-middleware.html) are a fundamental part of each Express application, which allow to filter or modify the request data, verify Authentication or perform certain actions under certain conditions.

In our case, in order to gain confidence with middlewares, let's add a middleware which simply logs each incoming request to our application.

**Goals**
- Every time the Web Server is hit, a log to file must be written by using [winston](https://github.com/winstonjs/winston), containing the timestamp, the request method and url. Winston must be used in a global Express application middleware

**Allowed Npm Packages**
- `express`: web server
- `moment`: date manager
- `request-promise`: http client used to perform the (GET) http request to fetch the job list
- `winston`: logger

**Requirements**
- The results must be saved in `userdata/data.json`
- The logs must be saved under `storage/logs/nodeJobs.log`

**Suggestions**
- Use `moment` to handle a proper date format to be logged into file

- Follow the instructions in the readme of the Winston's GitHub project page to setup a basic logger

- A global middleware, which will run on all incoming requests, can be defined like so (**before** the routes definition):

```js
app.use((req, res, next) => {
  // Code that runs at every request coming to our application

  next();
});
```
