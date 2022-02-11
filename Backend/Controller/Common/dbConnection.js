var mysql = require("mysql");

var con = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "UberEats",
});

try {
  con.connect(function (err) {
    // if (err) throw err;
    if (err) {
      console.log("Error while connecting to database", err);
    } else {
      console.log("Connected!");
    }
  });
} catch (error) {
  console.log("Error while connecting to mySQL");
}

module.exports = con;
