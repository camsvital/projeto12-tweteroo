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

  const foundUser = users.find((user) => user.username === username);

  if (tweet !== "" && username !== undefined) {
    if (!foundUser) {
      res.status(401).send("Esse usuário não está cadastrado");
      return;
    }

    const body = {
      username: username,
      tweet: tweet,
    };

    tweets.push(body);
    res.status(201).send("OK");
  }

  res.status(400).send("Todos os campos são obrigatórios!");
});

app.get("/tweets", (req, res) => {
  const page = Number(req.query.page);

  if (page <= 0) {
    return res.status(400).send("Informe uma página válida!");
  }

  if (page === undefined || page === 1) {
    return res.send(tweets.slice(-10).reverse());
  }

  const start = page * -10;
  const end = (page - 1) * -10;
  res.send(tweets.slice(start, end).reverse());
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const userTweet = tweets.filter((t) => t.username === username);
  res.status(200).send(userTweet);
});

app.listen(5000);
