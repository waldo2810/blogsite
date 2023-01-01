require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");

//#region DB stuff

//! Connect to DB
mongoose.connect(process.env.MONGOURL);
//! Create Schema
const postSchema = new mongoose.Schema({ title: String, content: String });
//! Create Model
const Post = mongoose.model("Post", postSchema);
//! Default Documents
const post1 = {
  title: "day 1",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent diam eros, vehicula vitae bibendum non, elementum at diam. Integer feugiat tempor ligula, sed interdum neque bibendum id. Nunc rutrum felis eget ante sodales, non congue nulla dapibus. Curabitur quis efficitur ex. Nam ac dapibus diam. Aliquam ullamcorper lorem velit, in mollis ex venenatis posuere. Nam tincidunt mi sit amet neque facilisis, eu maximus metus mollis. Integer sit amet arcu non tortor laoreet fermentum. Vestibulum aliquam viverra eleifend. Integer urna tellus, convallis id laoreet sed, condimentum in nibh. Etiam semper ligula id elit consectetur posuere. Nullam semper erat iaculis dolor ultrices, ac luctus ante pellentesque. Maecenas et malesuada sem. Morbi imperdiet, metus eget ullamcorper laoreet, erat purus viverra neque, vel tempor sapien elit at augue. Vestibulum maximus erat eu imperdiet placerat. Duis vel felis sed eros suscipit malesuada. Sed ligula quam, tempus vitae interdum bibendum, auctor non enim. Nam non vulputate massa. Pellentesque semper mi quam, vel accumsan nisl feugiat varius. Sed consequat sed nunc id fermentum. Fusce turpis lacus, facilisis et blandit eu, porta ut quam. Donec aliquet efficitur massa. Duis faucibus sem lectus, in venenatis massa iaculis non. Duis in diam eget nisi blandit pulvinar feugiat eget tortor. Donec.",
};
const post2 = {
  title: "day 2",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent diam eros, vehicula vitae bibendum non, elementum at diam. Integer feugiat tempor ligula, sed interdum neque bibendum id. Nunc rutrum felis eget ante sodales, non congue nulla dapibus. Curabitur quis efficitur ex. Nam ac dapibus diam. Aliquam ullamcorper lorem velit, in mollis ex venenatis posuere. Nam tincidunt mi sit amet neque facilisis, eu maximus metus mollis. Integer sit amet arcu non tortor laoreet fermentum. Vestibulum aliquam viverra eleifend. Integer urna tellus, convallis id laoreet sed, condimentum in nibh. Etiam semper ligula id elit consectetur posuere. Nullam semper erat iaculis dolor ultrices, ac luctus ante pellentesque. Maecenas et malesuada sem. Morbi imperdiet, metus eget ullamcorper laoreet, erat purus viverra neque, vel tempor sapien elit at augue. Vestibulum maximus erat eu imperdiet placerat. Duis vel felis sed eros suscipit malesuada. Sed ligula quam, tempus vitae interdum bibendum, auctor non enim. Nam non vulputate massa. Pellentesque semper mi quam, vel accumsan nisl feugiat varius. Sed consequat sed nunc id fermentum. Fusce turpis lacus, facilisis et blandit eu, porta ut quam. Donec aliquet efficitur massa. Duis faucibus sem lectus, in venenatis massa iaculis non. Duis in diam eget nisi blandit pulvinar feugiat eget tortor. Donec.",
};

const defaultPosts = [post1, post2];

//#endregion

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const port = 3000 || process.env.PORT;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  //! Retrieve posts from db
  Post.find((err, postsFound) => {
    //! Check for errors
    if (err) {
      console.log(err);
    } else {
      //! If no error then check if there are posts
      if (postsFound.length === 0) {
        //! If no post then insert the default one to db
        Post.insertMany(defaultPosts, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("\nDefault posts inserted to blogDB");
          }
        });
        res.redirect("/");
      } else {
        //! If there are posts then just render homepage with them
        res.render("home", { introParagraph: homeStartingContent, posts: postsFound });
      }
    }
  });
});

app.get("/posts/:postname", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postname.trim());

  Post.findOne({ title: requestedTitle }, (err, foundPost) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("post", {
        title: _.capitalize(foundPost.title),
        content: _.capitalize(foundPost.content),
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    introParagraph: aboutContent,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    introParagraph: contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const postTitle = req.body.postTitle.trim();
  const postContent = req.body.postText.trim();

  const post = { title: _.lowerCase(postTitle), content: _.lowerCase(postContent) };

  Post.create(post);

  res.redirect("/");
});

app.listen(port, function () {
  console.log("Server started on port", port);
});
