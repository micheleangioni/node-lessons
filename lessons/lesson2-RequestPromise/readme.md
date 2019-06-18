# Node Lessons

### Lesson 2: Use 'request-promise' instead of NodeJs' 'https' as HTTP client

**Description**
NodeJs' `https` module is quite low level, so it requires some manual tweaking.
In comparison, [request-promise](https://github.com/request/request-promise) has a much simpler API and can be used to simplify our program.
Let's use it in place of `https`.

Additionally, let's wrap all NodeJs functions, which use callbacks, into custom functions which return a Promise.

**Goals**
- Simplify the http client code by using `request-promise` in place of `https`

**Allowed Npm Packages**
- `express`: web server
- `request-promise`: http client used to perform the (GET) http request to fetch the job list

**Requirements**
- The results must be saved in `userdata/data.json`
- `fs.writeFile` must reside inside its own function that returns a Promise

**Suggestions**
- Asynchronous functions using callbacks, such as Node ones, can be wrapped into a Promise by

```js
return new Promise((resolve, reject) => {
  fs.writeFile('userdata/data.json', data, (err) => {
    if (err) return reject();
    resolve(data);
  });
})
```
