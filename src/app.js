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
});

app.get("/tweets", (req, res) => {
  const {page} = req.query
  const tweetSended = []
  let counter = 0

  console.log(page)

  if (page !== undefined){
      if(page > 0){
          for(let i = (tweets.length - 1) - (page-1)*10; counter < 10 && i >= 0; i--){
              tweetSended.push(tweets[i])
              counter ++
          }
          res.status(200).send(tweetSended)
          return
      }else{
          res.status(400).send("Informe uma página válida!")
          return
      }
  }
  
  for(let i = tweets.length - 1; counter < 10 && i >= 0; i--){
      tweetSended.push(tweets[i])
      counter ++
  }
  res.status(200).send(tweetSended)
  
})

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const userTweet = tweets.filter(t => t.username.toLowerCase() == username.toLowerCase());
  res.status(200).send(userTweet);
});

app.listen(5000);

