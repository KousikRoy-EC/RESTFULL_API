//BUILDING AN RESTFULL API FROM SCRATCH

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const e = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")

  .get((req, res) => {
    Article.find(function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Your Articles Published Sucessfully");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Deleted Sucessfully");
      } else {
        res.send(err);
      }
    });
  });

//////for specific articles

app.route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("Sorry No such articles found");
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Articles Removed Sucessfully");
      } else {
        res.send(err);
      }
    });
  })

  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { upsert: true },
      function (err, Updated) {
        if (err) {
          res.send(500, { error: err });
        } else {
          res.send("Succesfully saved.");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { content: req.body.content },
      { upsert: true },
      function (err, Updated) {
        if (err) {
          res.send(500, { error: err });
        } else {
          res.send("Succesfully saved.");
        }
      }
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
