const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.static("public/image"));

app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://shre1234:landmera1234@todolistlal.kzgjv.mongodb.net/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};
const listSchema = {
  name: String,
  items: [itemsSchema]
};
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const options = {
  weekday: 'long',
};
const today = new Date();
const TODAY = today.toLocaleDateString("en-US", options);

app.get("/", function(req, res) {
  Item.find(function(err, results) {
    res.render("list", {
      title: TODAY,
      items: results
    });
  });
});

app.post("/", function(req, res) {
  const nayaKamm = new Item({
    name: req.body.newItem
  });
  if (req.body.button == TODAY) {
    nayaKamm.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: req.body.button
    }, function(err, list) {

      list.items.push(nayaKamm);
      list.save();
      res.redirect("/" + req.body.button);
    });
  }
});


app.get("/:joBoleyWo", function(req, res) {
  const joBoleyWo = _.capitalize(req.params.joBoleyWo);

  List.findOne({
    name: joBoleyWo
  }, function(err, list) {
    if (!err) {
      if (!list) {
        const list = new List({
          name: joBoleyWo
        });
        list.save();
        res.redirect("/" + joBoleyWo);
      } else {
        res.render("list", {
          title: list.name,
          items: list.items
        });
      }
    }
  });
});


app.post("/delete", function(req, res) {
  const id = req.body.checkbox;
  const title = req.body.title;
  if (title == TODAY) {
    Item.findByIdAndRemove(id, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });

  } else {

    List.findOneAndUpdate({
      name: title
    }, {
      $pull: {
        items: {
          _id: id
        }
      }
    }, function(err, results) {
      if (!err) {
        res.redirect("/" + title);
      }
    });

  }



});

app.listen(3000 || process.env.PORT, function() {
  console.log("Server started at port 3000!! ");
});
