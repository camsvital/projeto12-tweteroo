import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;

  if (username !== "" && avatar !== "") {
    users.push({ username: username, avatar: avatar });
    res.status(201).send("OK");
    return;
  }
  res.status(400).send("Todos os campos são obrigatórios!");
});

app.post("/tweets", (req, res) => {
  const { tweet, username } = req.body;

  const foundUser = users.find((u) => u.username === username);

  if (!foundUser) {
    res.status(401).send("Usuário não cadastrado");
    return;
  }

  const body = {
    username: username,
    tweet: tweet,
  };

  tweets.push(body);
  res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  let userTweets = tweets
    .slice(-10)
    .reverse()
    .map((tweet) => {
      const user = users.find((u) => u.username === tweet.username);
      if (u) {
        return {
          ...tweet,
          avatar: user.avatar,
        };
      }
      return tweet;
    });

  res.send(userTweets);
});


app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const userTweet = tweets.filter((t) => t.username === username);
  res.status(200).send(userTweet);
});

app.listen(5000);
