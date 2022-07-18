var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
function templateHTML(title, list, body, control){
  return  `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
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
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
        response.writeHead(200); // 전송 성공
        response.end(template);
      });
    } else {
      fs.readdir("./data", (err, filelist) => {
        fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a> 
           <a href="/update?id=${title}">update</a>
           <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete">
           </form>`
           );
          response.writeHead(200); // 전송 성공
          response.end(template);
          //response.end(fs.readFileSync(__dirname + _url));
        });
      });
    }
  }else if(pathname === "/create"){
    fs.readdir("./data", (err, filelist) => {
      console.log(filelist);
      var title = `Web - create`;
      var list = templateList(filelist);
      var template = templateHTML(title, list, `
        <form action="/create_process" method="post">
        <p>
          <input type="text" name="title" placeholder="제목을 입력해 주세요.">
        </p>
        <p>
          <textarea name="description" placeholder="내용을 입력해 주세요."></textarea>
        </p>
        <p>
          <input type="submit">  
        </p>
        </form>
      `, '');
      response.writeHead(200); // 전송 성공
      response.end(template);
    });
  }
  else if(pathname ==="/create_process"){
    var body="";
    request.on('data', (data)=>{
      body = body + data;
    });
    request.on('end', ()=>{
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf-8', (err)=>{
        if(err) throw err;
        response.writeHead(302, {Location: `/?id=${title}`}); // 페이지 이동은 302, 위치 적으면 됨
        response.end("");
      })
    });
    
  }
  else if(pathname ==='/update'){
    fs.readdir("./data", (err, filelist) => {
      fs.readFile(`data/${queryData.id}`, "utf8", (err, description) => {
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list,
        `
        <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p>
          <input type="text" name="title" placeholder="제목을 입력해 주세요." value="${title}">
        </p>
        <p>
          <textarea name="description" placeholder="내용을 입력해 주세요.">${description}</textarea>
        </p>
        <p>
          <input type="submit">  
        </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(template);
      });
    });
  }
  else if (pathname=== '/update_process'){
    var body="";
    request.on('data', (data)=>{
      body = body + data;
    });
    request.on('end', ()=>{
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, (err)=>{
        if (err) throw err;
        fs.writeFile(`data/${title}`, description, 'utf-8', (err)=>{
          response.writeHead(302, {Location:`/?id=${title}`});
          response.end();
        })
      }); 
    });
  }
  else if (pathname=== '/delete_process'){
    var body="";
    request.on('data', (data)=>{
      body = body + data;
    });
    request.on('end', ()=>{
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, (err)=>{
        if (err) throw err;
        response.writeHead(302, {Location:`/`});
        response.end();
      })
    });
  }
  else {
    response.writeHead(404); // 파일을 찾을 수 없을 때 없는 페이지 일때
    response.end("Not found");
  }
});
app.listen(3000);
