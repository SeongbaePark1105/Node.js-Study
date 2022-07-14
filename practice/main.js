var http = require("http");
var fs = require("fs");
var url = require("url");
function templateHTML(title, list, body){
  return  `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = "<ul>";
  var i = 0;
  while (i < filelist.length) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i += 1;
  }
  list += "</ul>";
  return list;
}
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  console.log(url.parse(_url, true));
  console.log(queryData.id);

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, filelist) => {
        console.log(filelist);
        var title = `Welcome`;
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200); // 전송 성공
        response.end(template);
      });
    } else {
      fs.readdir("./data", (err, filelist) => {
        console.log(filelist);
        var title = `Welcome`;
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
          var title = queryData.id;
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200); // 전송 성공
          response.end(template);
          //response.end(fs.readFileSync(__dirname + _url));
        });
      });
    }
  } else {
    response.writeHead(404); // 파일을 찾을 수 없을 때 없는 페이지 일때
    response.end("Not found");
  }
});
app.listen(3000);
