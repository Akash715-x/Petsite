const express = require("express");
const fileupload = require("express-fileupload");
const mysql2 = require("mysql2");

const app = express();

app.listen(2023, function () {
    console.log("Server Started:2023");
})

app.use(express.static("public"));
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));

// const config =
// {
//     host: "127.0.0.1",
//     user: "root",
//     password: 'akash@2004',
//     database: 'pet',
//     dateStrings: true,
//     timezone: 'ist'
// }
const config =
{
    host: "bvpgmtz1euiyqbjsnbhy-mysql.services.clever-cloud.com",
    user: "uvt8nyj45yuiyzka",
    password: 'LPZwA8Z3vb5VB3plFtnZ',
    database: 'bvpgmtz1euiyqbjsnbhy',
    dateStrings: true,
    timezone: 'ist'
}
const mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("Connected Successfully");
    else
        console.log(err.sqlMessage);
});
app.get("/", function (req, resp) {
    const path = process.cwd() + "/public/pet.html";
    resp.sendFile(path);
});
app.get("/oprofile", function (req, resp) {
    const path = process.cwd() + "/public/owner-profile.html";
    resp.sendFile(path);
});
app.get("/sprofile", function (req, resp) {
    const path = process.cwd() + "/public/shelter-profile.html";
    resp.sendFile(path);
});
app.get("/users-admin", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/users-admin.html");
});
app.get("/shelter", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/shelter-admin.html");
});
app.get("/owner", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/owner-admin.html");
});
app.get("/admin",function(req,resp){
    resp.sendFile(process.cwd()+"/public/dash-admin.html");
});
app.get("/db-signup", function (req, resp) {

    let data = [req.query.Email, req.query.Pwd, req.query.Utype];
    mysql.query("insert into users value(?,?,?,current_date(),1)", data, function (err) {
        if (err) {
            resp.send("Already a User");
        }
        else {
            resp.send("Signup Successfully");
        }
    });
});


app.get("/db-login", function (req, resp) {

    let data = [req.query.Email, req.query.Pwd];
    mysql.query("select * from users where emailid=? and password=?", data, function (err, result) {
        if (err != null)
            resp.send(err.message());

        else if (result.length == 1) {
            if (result[0].status == 1) {
                if (result[0].utype == "Shelter")
                    resp.send("Shelter Logined");
                else if (result[0].utype == "Owner")
                    resp.send("Owner Logined");

            }
            else if (result[0].status == 0) {
                resp.send("You Are Blocked");
            }
        }
        else
            resp.send("Invalid (Plz Check Email Or Password)");
    });

})
app.post("/oprofile-save", function (req, resp) {
    console.log(req.body);
    const email = req.body.txtEmail;
    const name = req.body.txtName;
    const contact = req.body.txtCont;
    const address = req.body.txtAdd;
    const city = req.body.txtCity;
    //const ppic = req.body.txtPpic;
    const pets = req.body.txtPets;
    let filename = "";
    if (req.files != null) {
        filename = req.body.txtEmail + "-" + req.files.ppic.name;
        const path = process.cwd() + "/public/uploads/" + filename;
        req.files.ppic.mv(path);
        console.log("File Uploaded Successfully");
    }
    mysql.query("insert into oprofile values(?,?,?,?,?,?,?)", [email, name, contact, address, city, filename, pets], function (err) {
        if (err == null)
            resp.send("Record Saved Successfully");
        else
            resp.send(err.message);
    });
})
app.get("/fetch-json-record", function (req, resp) {
    let data = [req.query.Email];
    mysql.query("select * from oprofile where emailid=?", data, function (err, result) {
        if (err)
            resp.send(err.message);

        else
            resp.send(result);
    })
})
app.post("/oprofile-update", function (req, resp) {
    console.log(req.body);
    const email = req.body.txtEmail;
    const name = req.body.txtName;
    const contact = req.body.txtCont;
    const address = req.body.txtAdd;
    const city = req.body.txtCity;

    const pets = req.body.txtPets;
    // const pets = req.body.txtPets.join("-");
    let filename = "";
    if (req.files != null) {
        filename = email + "-" + req.files.ppic.name;
        const path = process.cwd() + "/public/uploads/" + filename;
        req.files.ppic.mv(path);
        console.log("File Uploaded Successfully");
    }
    else
        filename = req.body.hdn;
    mysql.query("update oprofile set name=?,contact=?,address=?,city=?,ppic=?,ptype=? where emailid=?", [name, contact, address, city, filename, pets, email], function (err) {
        if (err == null)
            resp.send("Record Updated Successfully");
        else
            resp.send(err.message);
    });
})
app.post("/shelter-save", function (req, resp) {
    console.log(req.query)
    let email = req.body.Email;
    let name = req.body.Name;
    let cont = req.body.contact;
    let add = req.body.Address;
    let city = req.body.City;
    let webs = req.body.Web;
    let since = req.body.sin;
    let spet = req.body.Spet;
    let filename1 = "";
    let filename2 = "";

    if (req.files != null) {
        filename1 = req.body.Email + "-" + req.files.ppic1.name;
        filename2 = req.body.Email + "-" + req.files.ppic2.name;
        const path1 = process.cwd() + "/public/uploads/" + filename1;
        const path2 = process.cwd() + "/public/uploads/" + filename2;
        req.files.ppic1.mv(path1);
        req.files.ppic2.mv(path2);
        console.log("File Uploaded Successfullyy");
    }
    mysql.query("insert into sprofile values(?,?,?,?,?,?,?,?,?,?)", [email, name, cont, add, city, webs, since, spet, filename1, filename2], function (err) {
        if (err == null)
            resp.send("Record Saved Successfully");
        else
            resp.send(err.message);
    });
})
app.get("/fetch-json-shelter-record", function (req, resp) {
    let data = [req.query.Email];
    mysql.query("select * from sprofile where emailid=?", data, function (err, result) {
        if (err)
            resp.send(err.message);

        else
            resp.send(result);
    })
})

app.post("/shelter-update", function (req, resp) {
    console.log(req.body)
    let email = req.body.Email;
    let name = req.body.Name;
    let cont = req.body.contact;
    let add = req.body.Address;
    let city = req.body.City;
    let webs = req.body.Web;
    let since = req.body.sin;
    let spet = req.body.Spet;
    let filename1 = "";
    let filename2 = ""

    if (req.files != null) {
        filename1 = req.body.Email + "-" + req.files.ppic1.name;
        const path1 = process.cwd() + "/public/uploads/" + filename1;
        req.files.ppic1.mv(path1);
        console.log("File Uploaded Successfullyy");
    }
    else
        filename1 = req.body.hdn1;
    if (req.files != null) {
        filename2 = req.body.Email + "-" + req.files.ppic2.name;
        const path2 = process.cwd() + "/public/uploads/" + filename2;
        req.files.ppic2.mv(path2);
        console.log("File Uploaded Successfullyy");
    }
    else
        filename2 = req.body.hdn2;

    mysql.query("update sprofile set name=?,contact=?,address=?,city=?,website=?,since=?,selpets=?,idpic=?,shelpic=? where emailid=?", [name, cont, add, city, webs, since, spet, filename1, filename2, email], function (err) {
        if (err == null)
            resp.send("Record Updated Successfully");
        else
            resp.send(err.message);
    });
})
app.get("/change-s-password", function (req, resp) {
    let email = req.query.pEmail;
    let oldpass = req.query.oldpass;
    let newpass = req.query.newpass;
    let conpass=req.query.conpass;

    let data = [email, oldpass, newpass];
    mysql.query("select * from users where emailid=? and password=?", data, function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else if (table.length == 1) {
            if (newpass==conpass) {
                if (table[0].utype == "Shelter") {
                    var data = [newpass, email];
                    mysql.query("update users set password=? where emailid=?", data, function (err, result) {
                        if (err != null)
                            resp.send(err.toString());
                        else
                            resp.send("Change Password successfully......");
                    });
                }
                else {
                    resp.send("U R Not Shelter");
                }
            }
            else {
                resp.send("Password Not Match");
            }
        }
        else
            resp.send("Invalid (Plz Check Email Or Old Password)");
    })
});

app.get("/change-o-password", function (req, resp) {
    let email = req.query.pEmail;
    let oldpass = req.query.oldpass;
    let newpass = req.query.newpass;
    let conpass=req.query.conpass;

    let data = [email, oldpass, newpass];
    mysql.query("select * from users where emailid=? and password=?", data, function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else if (table.length == 1) {
            if (newpass==conpass) {
                if (table[0].utype == "Owner") {
                    var data = [newpass, email];
                    mysql.query("update users set password=? where emailid=?", data, function (err, result) {
                        if (err != null)
                            resp.send(err.toString());
                        else
                            resp.send("Change Password successfully......");
                    });
                }
                else {
                    resp.send("U R Not Owner");
                }
            }
            else {
                resp.send("Password Not Match");
            }
        }
        else
            resp.send("Invalid (Plz Check Email Or Old Password");
    })
});


app.all("/db-profile-showall", function (req, resp) {
    mysql.query("select * from users", function (err, restWalaTable) {
        resp.send(restWalaTable);
    })

})
app.get("/block-user", function (req, resp) {
    var data = [req.query.emailid];
    mysql.query("update users set status=0 where emailid=?", data, function (err, table) {
        if (err)
            resp.send(err.sqlMsg);
        else
            resp.json(table);
    })
});
//==================================================

app.get("/activate-user", function (req, resp) {
    let data = [req.query.emailid];
    mysql.query("update users set status=1 where emailid=?", data, function (err, table) {
        if (err)
            resp.send(err.sqlMsg);
        else
            resp.json(table);
    })
});

app.get("/shelter-admin", function (req, resp) {
    mysql.query("select * from sprofile", function (err, restWalaTable) {
        console.log(err);
        if (err)
            resp.send(err.sqlMessage);
        else
            resp.send(restWalaTable);
    })

})

app.get("/delete-shelter", function (req, resp) {
    let dataAry = [req.query.emailid];

    mysql.query("delete from sprofile where emailid=?", dataAry, function (err, table) {
        if (err)
            resp.send(err.sqlMessage);
        else
            if (table.affectedRows == 1)
                resp.send("Deleted");
            else
                resp.send("Invalid ID");

    })
})

app.get("/owner-admin", function (req, resp) {
    mysql.query("select * from oprofile", function (err, restWalaTable) {
        console.log(err);
        if (err)
            resp.send(err.sqlMessage);
        else
            resp.send(restWalaTable);
    })

})
app.get("/delete-owner", function (req, resp) {
    let dataAry = [req.query.emailid];

    mysql.query("delete from oprofile where emailid=?", dataAry, function (err, table) {
        if (err)
            resp.send(err.sqlMessage);
        else
            if (table.affectedRows == 1)
                resp.send("Deleted");
            else
                resp.send("Invalid ID");

    })
})
app.get("/fetch-all-cities", function (req, resp) {
    mysql.query("select distinct city from sprofile", function (err, table) {

        if (err)
            resp.send(err.sqlMsg);
        else
            resp.send(table);

    })
})
//==================================================

app.get("/fetch-all-shelter", function (req, resp) {
    var data = [req.query.city];
    mysql.query("select *from sprofile where city=? ", data, function (err, table) {

        if (err)
            resp.send(err.sqlMsg);
        else
            resp.send(table);
    });
});
//==================================================

app.get("/moreInfo", function (req, resp) {
    var data = [req.query.emailid];
    mysql.query("select * from sprofile where emailid=?", data, function (err, table) {
        if (err)
            resp.send(err.sqlMessage);
        else
            resp.send(table);

    });

});