var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require('fs');
var app = express();
var PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection;

if(process.env.JAWSDB_URL){

	connection = mysql.createConnection(process.env.JAWSDB_URL);
} 

else{
connection = mysql.createConnection({
  host: "localhost",
  user: "Ben",
  password: "bgrant88",
  database: "burgers_db"
});

}

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
});

app.use(express.static('public'))

app.get("/",function(req, res){

res.render("login");

});


app.post("/sets", function(req, res){

   connection.query("SELECT * FROM users;", function(err, data) {

var users = {

  datas: data
}

res.json(users);
})
 });

app.get("/check", function(req, res){

   connection.query("SELECT * FROM users;", function(err, data) {

var users = {

  datas: data
}

res.json(users);
})
 });


app.get("/home/:id", function(req, res){

 var userid = JSON.parse(req.params.id);
 var name ="";
var namey="";

 connection.query("SELECT * FROM users where id =?;", [userid], function(err, data) {


name = data[0].username;
namey = name.replace(/\s+/g, "").toLowerCase();


connection.query("SELECT * FROM burgers_"+namey+";", function(err, data) {

 
 var yes = [];
var not = [];

  var Dev = {

      devy: yes,
      devn: not,
      user: name,
      id: userid
    }

for (var i = 0; i < data.length; i++) {
if(JSON.parse(data[i].devoured) === 0) {

not.push(data[i]);
}   else{

yes.push(data[i]);
}
}

console.log(Dev);

	 res.render("index", {Dev});
});

});

});

app.post("/add", function(req, res){

	connection.query("INSERT INTO burgers_"+req.body.names+" (burger_name, ingredients) VALUES (?, ?)", [req.body.burgeradd, req.body.burgering], function(err, data) {

	res.end();
});

});

app.put("/devs/:id", function(req, res){


	connection.query("UPDATE burgers_"+req.body.names+" SET devoured = ? WHERE id = ?", [true, req.body.ids], function(err, data) {
res.end();
});
});


app.put("/reg/:id", function(req, res){

  connection.query("UPDATE burgers_"+req.body.names+" SET devoured = ? WHERE id = ?", [false, req.body.ids], function(err, data) {
res.end();
});
});

app.delete("/del/", function(req, res){

  connection.query("DELETE FROM burgers_"+req.body.names+" where devoured =? ", [true], function(err, data) {
console.log("emptied");
res.end();
});
});

 app.put("/ups",function(req, res){

console.log(req.body);

var use = req.body.users;
var user = use.replace(/\s+/g, "").toLowerCase();

connection.query("UPDATE burgers_"+user+" SET burger_name = ?, ingredients = ? WHERE id =?", [req.body.burgs, req.body.ings, req.body.ids], function(err, data) {

console.log(err);
 res.end();

});
});


app.post("/users/", function(req, res){

console.log(req.body);

  connection.query("SELECT * FROM users;", function(err, data) {

    console.log(data);

    var dats = {

      daty: data,
      reqs: req.body
    }

    console.log(dats);
    console.log(dats.daty);
    console.log(dats.reqs);

  res.json(dats);
});

});

app.post("/signs", function(req, res){

console.log(req.body.users);
console.log(req.body.pws);
   var user = req.body.users.replace(/\s+/g, "").toLowerCase();

  connection.query("INSERT INTO users (username, password) VALUES (?, ?);", [req.body.users, req.body.pws], function(err, data) {

});

connection.query("CREATE TABLE burgers_"+user+" (`id` int(11) NOT NULL AUTO_INCREMENT, `burger_name` varchar(100) DEFAULT NULL, ingredients varchar(250) DEFAULT NULL, `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `devoured` tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (`id`));", function(err, data) {

});

connection.query("INSERT INTO burgers_"+user+" (burger_name, ingredients) values ('Double-Double', 'double meat, double cheese, lettuce, tomato'), ('Big Mac', 'two patties, special sauce, sesame seed bun'), ('Whopper', 'big patty, lettuce, tomato, onions');", function(err, data) {

});

res.end();

});

app.get("/ups/:userid/:user/:id",function(req, res){

  connection.query("SELECT * FROM burgers_"+req.params.user+" where id =?;", [req.params.id], function(err, data) {
console.log(data[0]);

var obj = {

  user: req.params.user,
  id: req.params.userid,
  data: data[0]
}

console.log(obj);
res.render("update-page", {obj});

});

});

app.get("*",function(req, res){

res.render("login");

});

app.listen(PORT, function() {
  console.log("burger eating app listening on port", PORT);
});