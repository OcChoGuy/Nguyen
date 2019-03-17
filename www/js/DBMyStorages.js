// Mo DB
var db = window.openDatabase(
  "1661a",
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
        var html2="";
        for (i = 0; i < length; i++) {
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
          html += "<p class='Type'></p>";
          html+= "<p id='NoteUpdate'>Note: "+result.rows.item(i).NOTE+"</p></a>"
          html+= " <a href='#purchase' onclick='EditNote("+result.rows.item(i).ID+")' data-rel='popup' data-position-to='window' data-transition='pop'>P</a>";
          html += "</li>";
        }

        $("#ListMS").html(html);
        
        html2 += "<input type='hidden' id='IDNOTE'> "
        html2 +="<h3>Note:</h3>"
        html2 +="<textarea id='NoteTextArea' rows='5' cols='30'>"
        html2 += "</textarea>"
        html2 += " <a onclick='UpdateNote()' data-rel='back' class='ui-shadow ui-btn ui-corner-all ui-btn-b ui-icon-check ui-btn-icon-left ui-btn-inline ui-mini'>Submit</a>"
        $("#purchase").html(html2); 
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
        "<thead><tr><th>Storage Features</th><th></th></tr></thead>";
      for (i = 0; i < length; i++) {
        html +=
          "<tbody><tr><td>" +
          result.rows.item(i).STORAGESFEATURESNAME +
          "</td><td> <button class='ui-btn ui-corner-all ui-shadow' onclick=DeleteSF(" +
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
        "<thead><tr><th>Storage Types</th><th></th></tr></thead>";
      for (i = 0; i < length; i++) {
        html +=
          "<tbody><tr><td>" +
          result.rows.item(i).STORAGESTYPESNAME +
          "</td><td> <button class='ui-btn ui-corner-all ui-shadow' onclick=DeleteST(" +
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

function EditNote(ID){
  console.log(ID);
  db.transaction(function (tx) {
    var sqlStatement = "SELECT * FROM MYSTORAGES WHERE ID =?";
    tx.executeSql(
      sqlStatement,
      [ID],
      function (tx, result) {
        
          $("#IDNOTE").val(result.rows.item(0).ID);

          
        $("#NoteTextArea").val(result.rows.item(0).NOTE);
    },
    function (error) {
      console.log(error);
    }
  );
});
}
function UpdateNote(){
  var note= $("#NoteTextArea").val();
  var id = $("#IDNOTE").val();

  db.transaction(function (tx) {

    var sqlStatement = "UPDATE MYSTORAGES SET NOTE=? WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [note,id],
      function (tx, result) {
        console.log(note);

        alert("Update Succesfully");
        $("#NoteTextArea").val("");
        $("#IDNOTE").val();
        GetData();
      },
      function (error) {
        console.log("loi");
      }
    );
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
        console.log(result) ;
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
        html2 += "<button onclick='Delete(" + results.rows.item(0).ID + ")'><a href='#mainPage'>Delete</a></button><button onclick='Edit(" + results.rows.item(0).ID + ")'><a href='#UpdateMainPage'>Edit</button>";
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
    var sqlStatement = "SELECT * FROM STORAGEFEATURES";
    tx.executeSql(sqlStatement, [], function (tx, result) {
      var length = result.rows.length,
        i;
      var html = "<option class='hide'></option>";
      for (i = 0; i < length; i++) {
        html += "<option value='" + result.rows.item(i).ID + "'>" + result.rows.item(i).STORAGESFEATURESNAME + "</option>";
      }
      $("#UpdateStorageFeatures").html(html);
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
      $("#UpdateStorageTypes").html(html);
    });
  });

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
        $("#UpdateIDMS").val(Id);
        $("#UpdateDimensions").val(DIMENSIONS);
        $("#UpdateMRP").val(MONTHRENTPRICE);
        $("#UpdateStorageTypes ").val(STORAGETYPES);
        $("#UpdateStorageFeatures").val(STORAGEFEATURES);
        
        $("#UpdateNotes").val(NOTE);
        $("#UpdateNameOfRP").val(REPORTNAME);
        GetData();

      },

      function (error) {
        console.log(error);
      }
    );
  });
}

function Update() {
  var ID = $("#UpdateIDMS").val();
  var DIMENSIONS = $("#UpdateDimensions").val();
  var MONTHRENTPRICE = $("#UpdateMRP").val();
  var NOTE = $("#UpdateNotes").val();
  var STORAGETYPES = $("#UpdateStorageTypes").val();
  var STORAGEFEATURES = $("#UpdateStorageFeatures").val();
  var REPORTNAME = $("#UpdateNameOfRP").val();

  db.transaction(function (tx) {

    var sqlStatement = "UPDATE MYSTORAGES SET REPORTNAME=?,DIMENSIONS=?,MONTHRENTPRICE=?,NOTE=?,STORAGEFEATURES=?,STORAGETYPES=? WHERE ID=?";
    tx.executeSql(
      sqlStatement,
      [REPORTNAME, DIMENSIONS, MONTHRENTPRICE, NOTE, STORAGEFEATURES, STORAGETYPES, ID],
      function (tx, result) {
        alert("Update Succesfully");
        $("#UpdateMRP").val("");
        $("#UpdateNotes").val("");
        $("#UpdateDimensions").val("");
        $("#UpdateNameOfRP").val("");
        $("#UpdateStorageTypes").val("default");
        $("#UpdateStorageFeatures").val("default");
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
        console.log(result)
        $("#NameSF").val("");
        GetData();
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

