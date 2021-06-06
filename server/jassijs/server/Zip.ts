import Filesystem from "jassijs/server/Filesystem";
import fs = require('fs');

export function zip(req, res) {
    var url = req.query.path;
    let pos = url.lastIndexOf("/");
    var name = (pos === -1 ? "data" : url.substring(pos + 1));
  /*  new Filesystem().zipFolder("./../" + url, "/tmp/" + name + ".zip").then((data) => {
      if (data !== undefined) {
        res.status(500).send(data["message"]);
        return;
      }
      res.sendFile("/tmp/" + name + ".zip", function (err) {
        try {
          fs.unlinkSync("/tmp/" + name + ".zip");
        } catch (e) {
          console.log("error removing ", "/tmp/" + name + ".zip");
        }
      });
    });*/
  }