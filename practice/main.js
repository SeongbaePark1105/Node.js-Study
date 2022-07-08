var http = require("http");
var fs = require("fs");
var url = require("url");
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  console.log(queryData.id); // query 값 받아옴
  var title = queryData.id;
  if (_url == "/") {
    title = "Welcome";
  }
  if (_url == "/favicon.ico") {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200);
  fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
    var template = `<!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScrpit">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      <p>${description}</p>
    </body>
    </html>
    `;
    response.end(template);
  });
  //response.end(fs.readFileSync(__dirname + _url));
});
app.listen(3000);
