import { classes } from "jassijs/remote/Classes";
import { db } from "jassijs/remote/Database";
import registry from "jassijs/remote/Registry";
import { DBManager } from "./DBManager";
import { TypeORMListener } from "./TypeORMListener";
import {EventSubscriber} from "typeorm";
import { myfs ,exists} from "./NativeAdapter";


export function extendDBManager(){
      //create Admin User if doesn't a user exists 
      DBManager.prototype["hasLoaded"] = async function () {
        var User = await classes.loadClass("jassijs.security.User");
        //@ts-ignore
        var us =<any> User.findOne();
        if (us) {
            us = new User();
            us.email = "admin";
            us.password = "jassi";
            us.isAdmin = true;
            await us.save();
        }

    }
    DBManager.prototype["login"] = async function (context, user, password) {
        try {
            var User = await classes.loadClass("jassijs.security.User");
            var ret = await this.connection().manager.createQueryBuilder().
                select("me").from(User, "me").addSelect("me.password").
                andWhere("me.email=:email", { email: user });

            var auser = await ret.getOne();
            if (!auser || !password)
                return undefined;
            if (auser.password === password) {
                delete auser.password;
                return auser;
            }
        } catch (err) {
            err=err;
        }
        return undefined;
    }
    //@ts-ignore
    DBManager["getConOpts"] = async function () {
        var dbclasses = []; 
        const initSqlJs = window["SQL"];
        const SQL = await window["SQL"]({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => `https://sql.js.org/dist/${file}`
        });

        var dbobjects = await registry.getJSONData("$DBObject");
        var dbfiles = [];
        for (var o = 0; o < dbobjects.length; o++) {
            var clname = dbobjects[o].classname;
            try {
                dbfiles.push(dbobjects[o].filename.replace(".ts", ""));
                dbclasses.push(await classes.loadClass(clname));
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        //@ts-ignore
        DBManager.clearMetadata();
        db.fillDecorators();
        var tcl = await classes.loadClass("jassijs.server.TypeORMListener");
       //@ts-ignore 
        new EventSubscriber()(tcl);
        var Filesystem = await classes.loadClass("jassijs.server.Filesystem");
       
        var data=undefined;
        if(await exists("./client/__default.db"))
             data=await myfs.readFile("./client/__default.db","binary",false);
      
        var opt = {
            database: data,
            type: "sqljs",
            subscribers: [TypeORMListener],
            "entities": dbclasses
        };
        return opt;
    }
}