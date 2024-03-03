import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "../db.json");

export const createTweet = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const newTweet = req.body;
    db.tweets.push(newTweet);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing to db.json");
        return;
      }
      res.status(200).json(newTweet);
    });
  });
};

export const deleteTweet = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const tweetIndex = db.tweets.findIndex(
      (tweet) => tweet._id === req.params.id
    );

    if (tweetIndex !== -1) {
      db.tweets.splice(tweetIndex, 1);
      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing to db.json");
          return;
        }
        res.status(200).send("Tweet deleted");
      });
    } else {
      res.status(404).send("Tweet not found");
    }
  });
};

export const likeOrDislike = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const tweet = db.tweets.find((tweet) => tweet._id === req.params.id);

    if (tweet) {
      const userIndex = tweet.likes.indexOf(req.body.id);
      if (userIndex === -1) {
        tweet.likes.push(req.body.id);
        res.status(200).send("Tweet liked");
      } else {
        tweet.likes.splice(userIndex, 1);
        res.status(200).send("Tweet disliked");
      }

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing to db.json");
          return;
        }
      });
    } else {
      res.status(404).send("Tweet not found");
    }
  });
};

export const getAllTweets = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    res.status(200).json(db.tweets);
  });
};

export const getUserTweets = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const userTweets = db.tweets.filter(
      (tweet) => tweet.userId === req.params.id
    );

    if (userTweets.length > 0) {
      res.status(200).json(userTweets);
    } else {
      res.status(404).send("No tweets found for this user");
    }
  });
};

export const getExploreTweets = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const exploreTweets = db.tweets.filter(
      (tweet) => tweet.likes && tweet.likes.length > 0
    );

    if (exploreTweets.length > 0) {
      res.status(200).json(exploreTweets);
    } else {
      res.status(404).send("No tweets found for exploration");
    }
  });
};

