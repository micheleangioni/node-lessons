# Node Lessons

### Lesson 4: Use Axios as HTTP client

**Description**
[Axios](https://github.com/axios/axios) is probably the most used HTTP client both back and frontend.
Its super simply API makes creating HTTP requests a joke, yet allowing a deep configuration customization making itself ideal for all use cases.

Replace `request-promise` with Axios all along the application.

**Goals**
- Use `axios` as http client instead of `request-promise`

**Allowed Npm Packages**
- `axios`: http client used to perform the (GET) http requests
- `express`: web server
- `moment`: date manager
- `winston`: logger

**Requirements**
- The results must be saved in `userdata/data.json`
- The logs must be saved under `storage/logs/nodeJobs.log`

**Suggestions**
- Rewrite the function which takes the query parameters from the incoming request
