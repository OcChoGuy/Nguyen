// Mo DB
var db = window.openDatabase(
  "DBMyStoreges12",
  "1.0",
  "My Storeges",
  200000000000000
);

$(document).ready(function () {
  GetData();
  CreateDB();
  var html = "";
  $("#ulgetdata").html(html);
});

// TAO BANG
function CreateDB() {
  db.transaction(function (tx) {
    var sqlStatement =
      "CREATE TABLE IF NOT EXISTS MYSTORAGES(ID INTEGER PRIMARY KEY  AUTOINCREMENT, DIMENSIONS INTEGER, DATETIME TEXT,MONTHRENTPRICE INTEGER,NOTE TEXT, REPORTNAME TEXT,STORAGEFEATURES INTEGER,STORAGETYPES INTEGER)";
    tx.executeSql(
      sqlStatement,
      [],
      function (tx, result) {
        console.log("Create table MAIN success.");
      },
      function (error) {
        console.log(error);
      }
    );
  });

  db.transaction(function (tx) {
    var sqlStatement =
      "CREATE TABLE IF NOT EXISTS STORAGEFEATURES(ID INTEGER PRIMARY KEY  AUTOINCREMENT, STORAGESFEATURESNAME TEXT)";
    tx.executeSql(
      sqlStatement,
      [],
      function (tx, result) {
        console.log("Create table SF success.");
      },
      function (error) {
        console.log(error);
      }
    );
  });
  db.transaction(function (tx) {
    var sqlStatement =
      "CREATE TABLE IF NOT EXISTS STORAGETYPES(ID INTEGER PRIMARY KEY  AUTOINCREMENT, STORAGESTYPESNAME TEXT)";
    tx.executeSql(
      sqlStatement,
      [],
      function (tx, result) {
        console.log("Create table ST success.");
      },
      function (error) {
        console.log(error);
      }
    );
  });
}


function GetData() {
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM MYSTORAGES";
    tx.executeSql(
      sqlStatement,
      [],
      function (tx, result) {
        var length = result.rows.length,
          i;
        var html = "";
        for (i = 1; i < length; i++) {
          var StorageId = result.rows.item(i).STORAGEFEATURES;
          var StorageType = result.rows.item(i).STORAGETYPES;
          html +=
            "<li onclick=Detail(" + result.rows.item(i).ID + ")><a href='#Detail'><h2>" +
            result.rows.item(i).REPORTNAME +
            "</h2><p class='ui-li-aside'>" +
            result.rows.item(i).DATETIME +
            "</p>";
          //get data storages features
          db.transaction(function (tx) {
            var sqlStatement = "SELECT * FROM STORAGEFEATURES WHERE ID=?";
            tx.executeSql(sqlStatement, [StorageId], function (tx, result2) {
              $(".Feature").html(result2.rows.item(0).STORAGESFEATURESNAME);
            });
          });
          //get data storages types
          db.transaction(function (tx) {
            var sqlStatement = "SELECT * FROM STORAGETYPES WHERE ID=?";
            tx.executeSql(sqlStatement, [StorageType], function (tx, result2) {
              $(".Type").html(result2.rows.item(0).STORAGESTYPESNAME);
            });
          });
          html += "<p class='Feature'></p>";
          html += "<p class='Type'></p></a>";
          html += "</li>";
        }

        $("#ListMS").html(html);
      },
      function (error) {
        console.log(error);
      }
    );
  });

  // GET DATA STORAGES FEATURES
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM STORAGEFEATURES";
    tx.executeSql(sqlStatement, [], function (tx, result) {
      var length = result.rows.length,
        i;
      var html =
        "<thead><tr><th>Storage Features</th><th></th></tr><tr></tr></thead>";
      for (i = 0; i < length; i++) {
        html +=
          "<tbody><tr><td>" +
          result.rows.item(i).STORAGESFEATURESNAME +
          "</td><td><button class='ui-btn ui-corner-all ui-shadow' onclick=EditSF(" +
          result.rows.item(i).ID +
          ")>Edit</button> </td><td> <button class='ui-btn ui-corner-all ui-shadow' onclick=DeleteSF(" +
          result.rows.item(i).ID +
          ")>Delete</button></td></tr></tbody>";
      }
      $("#ShowDataSF").html(html);
    });
  });


  //GET DATA STORAGES TYPES
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM STORAGETYPES";
    tx.executeSql(sqlStatement, [], function (tx, result) {
      var length = result.rows.length,
        i;
      var html =
        "<thead><tr><th>Storage Types</th><th></th></tr><tr></tr></thead>";
      for (i = 0; i < length; i++) {
        html +=
          "<tbody><tr><td>" +
          result.rows.item(i).STORAGESTYPESNAME +
          "</td><td><button class='ui-btn ui-corner-all ui-shadow' onclick=EditST(" +
          result.rows.item(i).ID +
          ")>Edit</button> </td><td> <button class='ui-btn ui-corner-all ui-shadow' onclick=DeleteST(" +
          result.rows.item(i).ID +
          ")>Delete</button></td></tr></tbody>";
      }
      $("#ShowDataST").html(html);
    });
  });

  // DROPDOWNLIST StoragesFeature
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM STORAGEFEATURES";
    tx.executeSql(sqlStatement, [], function (tx, result) {
      var length = result.rows.length,
        i;
      var html = "<option class='hide'></option>";
      for (i = 0; i < length; i++) {
        html += "<option value='" + result.rows.item(i).ID + "'>" + result.rows.item(i).STORAGESFEATURESNAME + "</option>";
      }
      $("#StorageFeatures").html(html);
    });
  });
  // DROPDOWNLIST StoragesTypes
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM STORAGETYPES";
    tx.executeSql(sqlStatement, [], function (tx, result) {
      var length = result.rows.length,
        i;
      var html = "<option class='hide'></option>";
      for (i = 0; i < length; i++) {
        html += "<option value='" + result.rows.item(i).ID + "'>" + result.rows.item(i).STORAGESTYPESNAME + "</option>";
      }
      $("#StorageTypes").html(html);
    });
  });

}

function Submit() {

  var d = new Date();
  var strDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  console.log(strDate);
  db.transaction(function (tx) {
    var monthrentprice = $("#MRP").val();
    var note = $("#Notes").val();
    var Dimensions = $("#Dimensions").val();
    var nameofRP = $("#NameOfRP").val();
    var Datenow = strDate;
    var storagefeatures = $("#StorageFeatures").val();
    var storagetypes = $("#StorageTypes").val();
    var sqlStatement =
      "INSERT INTO MYSTORAGES(DIMENSIONS ,DATETIME ,MONTHRENTPRICE ,NOTE,REPORTNAME ,STORAGEFEATURES ,STORAGETYPES) VALUES(?,?,?,?,?,?,?)";
    tx.executeSql(
      sqlStatement,
      [
        Dimensions,
        Datenow,
        monthrentprice,
        note,
        nameofRP,
        storagefeatures,
        storagetypes
      ],
      function (tx, result) {
        console.log(result);
        $("#MRP").val("");
        $("#Notes").val("");
        $("#Dimensions").val("");
        $("#NameOfRP").val("");

        document.getElementById('StorageTypes').value = 'default';
        document.getElementById('StorageFeatures').value = 'default';
        alert("Success");
        GetData();
      },
      function (error) {
        console.log("loi");
      }
    );
  });
}

function Detail(ID) {
  db.transaction(function (tx) {

    var sqlStatement = "SELECT * FROM MYSTORAGES WHERE ID = ?"
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, results) {
        console.log(results);
        var html = "";
        var html2 = "";

        html += "<p>Name Of The Report: " + results.rows.item(0).REPORTNAME + "</p><hr>";
        html += "<p>DIMENSIONS: " + results.rows.item(0).DIMENSIONS + "m<sup>2</sup></p><hr>";
        html += "<p>MONTHRENTPRICE: " + results.rows.item(0).MONTHRENTPRICE + "</p><hr>";

        db.transaction(function (txa) {
          var sqlStatement = "SELECT * FROM STORAGEFEATURES WHERE ID=?";
          txa.executeSql(sqlStatement, [results.rows.item(0).STORAGEFEATURES], function (tx, result2) {
            $(".Feature").html(result2.rows.item(0).STORAGESFEATURESNAME);
          });
        });
        //get data storages types
        db.transaction(function (txa) {
          var sqlStatement = "SELECT * FROM STORAGETYPES WHERE ID=?";
          txa.executeSql(sqlStatement, [results.rows.item(0).STORAGETYPES], function (tx, result2) {
            $(".Type").html(result2.rows.item(0).STORAGESTYPESNAME);
          });
        });
        html += "STORAGEFEATURES:<p class='Feature'>  </p><hr>";
        html += "STORAGETYPES :<p class='Type'> </p><hr>";
        html += "<p>NOTE: " + results.rows.item(0).NOTE + "</p><hr>";
        html += "<p>DATETIME: " + results.rows.item(0).DATETIME + "</p><hr>";

        $("#ShowDetail").html(html);
        html2 += "<button onclick='Delete(" + results.rows.item(0).ID + ")'><a href='#mainPage'>Delete</a></button><button onclick='Edit(" + results.rows.item(0).ID + ")'><a href='#AOU'>Edit</button>";
        $("#footermain").html(html2);
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function Delete(ID) {
  db.transaction(function (tx) {
    var sqlStatement = "DELETE FROM MYSTORAGES  WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, results) {
        alert("Xoa Thanh Cong");
        GetData();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function Edit(ID) {
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM MYSTORAGES WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, results) {
        console.log(results);
        var Id = results.rows.item(0).ID;
        var DIMENSIONS = results.rows.item(0).DIMENSIONS;

        var MONTHRENTPRICE = results.rows.item(0).MONTHRENTPRICE;
        var NOTE = results.rows.item(0).NOTE;
        var REPORTNAME = results.rows.item(0).REPORTNAME;
        var STORAGEFEATURES = results.rows.item(0).STORAGEFEATURES;
        var STORAGETYPES = results.rows.item(0).STORAGETYPES;
        $("#IDMS").val(Id);
        $("#Dimensions").val(DIMENSIONS);
        $("#MRP").val(MONTHRENTPRICE);
        $("#StorageTypes").val(STORAGETYPES);
        $("#StorageFeatures").val(STORAGEFEATURES);
        $("#Notes").val(NOTE);
        $("#NameOfRP").val(REPORTNAME);

      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function Update() {
  var ID = $("#IDMS").val();
  var DIMENSIONS = $("#Dimensions").val();
  var MONTHRENTPRICE = $("#MRP").val();
  var NOTE = $("#StorageTypes").val();
  var STORAGETYPES = $("#StorageTypes").val();
  var STORAGEFEATURES = $("#StorageFeatures").val();
  var REPORTNAME = $("#NameOfRP").val();

  db.transaction(function (tx) {

    var sqlStatement = "UPDATE MYSTORAGES SET REPORTNAME=?,DIMENSIONS=?,MONTHRENTPRICE=?,NOTE=?,STORAGEFEATURES=?,STORAGETYPES=? WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [REPORTNAME, DIMENSIONS, MONTHRENTPRICE, NOTE, STORAGEFEATURES, STORAGETYPES, ID],
      function (tx, result) {
        alert("Update Succesfully");
        $("#MRP").val("");
        $("#Notes").val("");
        $("#Dimensions").val("");
        $("#NameOfRP").val("");

        document.getElementById('StorageTypes').value = 'default';
        document.getElementById('StorageFeatures').value = 'default';
        GetData();
      },
      function (error) {
        console.log("loi");
      }
    );
  });
}

// FUNC SF
function SubmitSF() {
  db.transaction(function (tx) {
    var name = $("#NameSF").val();
    var sqlStatement =
      "INSERT INTO STORAGEFEATURES(STORAGESFEATURESNAME) VALUES(?)";
    tx.executeSql(
      sqlStatement,
      [name],
      function (tx, result) {
        console.log("Create Success.");
        $("#NameSF").val("");
        GetData();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function EditSF(ID) {
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM STORAGEFEATURES WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, result) {
        console.log("DONE");
        var Id = result.rows.item(0).ID;
        var Name = result.rows.item(0).STORAGESFEATURESNAME;
        $("#IDSF").val(Id);
        $("#NameSF").val(Name);
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function DeleteSF(ID) {
  db.transaction(function (tx) {
    var sqlStatement = "DELETE FROM STORAGEFEATURES WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, results) {
        GetData();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function UpdateSF() {
  var Id = $("#IDSF").val();
  var Name = $("#NameSF").val();
  db.transaction(function (tx) {
    var name = $("#NameSF").val();

    var sqlStatement =
      "UPDATE STORAGEFEATURES SET STORAGESFEATURESNAME=? WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [Name, Id],
      function (tx, result) {
        GetData();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

// FUNC ST
function SubmitST() {
  db.transaction(function (tx) {
    var name = $("#NameST").val();
    var sqlStatement = "INSERT INTO STORAGETYPES(STORAGESTYPESNAME) VALUES(?)";
    tx.executeSql(
      sqlStatement,
      [name],
      function (tx, result) {
        console.log("Create Success.");
        $("#NameST").val("");
        GetData();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function EditST(ID) {
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM STORAGETYPES WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, result) {
        console.log("DONE");
        var Id = result.rows.item(0).ID;
        var Name = result.rows.item(0).STORAGESTYPESNAME;
        $("#IDST").val(Id);
        $("#NameST").val(Name);
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function DeleteST(ID) {
  db.transaction(function (tx) {
    var sqlStatement = "DELETE FROM STORAGETYPES WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, results) {
        GetData();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}

function UpdateST() {
  var Id = $("#IDST").val();
  var Name = $("#NameST").val();
  db.transaction(function (tx) {
    var name = $("#NameST").val();
    var sqlStatement = "UPDATE STORAGETYPES SET STORAGESTYPESNAME=? WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [Name, Id],
      function (tx, result) {
        GetData();
      },
      function (error) {
        console.log(error);
      }
    );
  });
}