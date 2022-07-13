var http = require("http");
var fs = require("fs");
var url = require("url");
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;
  console.log(url.parse(_url, true));
  console.log(queryData);
  console.log(queryData.id);

  if (pathname === "/") {
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
      response.writeHead(200); // 전송 성공
      response.end(template);
      //response.end(fs.readFileSync(__dirname + _url));
    });
  } else {
    response.writeHead(404); // 파일을 찾을 수 없을 때 없는 페이지 일때
    response.end("Not found");
  }
});
app.listen(3000);
