import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "../db.json");

export const getAllUsers = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    res.status(200).json(db.users);
  });
};

export const getUser = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const user = db.users.find((user) => user._id === req.params.id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  });
};

export const update = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const userIndex = db.users.findIndex((user) => user._id === req.params.id);

    if (userIndex !== -1) {
      db.users[userIndex] = { ...db.users[userIndex], ...req.body };

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing to db.json");
          return;
        }
        res.status(200).json(db.users[userIndex]);
      });
    } else {
      res.status(404).send("User not found");
    }
  });
};

export const deleteUser = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const userIndex = db.users.findIndex((user) => user._id === req.params.id);

    if (userIndex !== -1) {
      db.users.splice(userIndex, 1);

      // Optionally, remove all tweets associated with the user
      db.tweets = db.tweets.filter((tweet) => tweet.userId !== req.params.id);

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing to db.json");
          return;
        }
        res.status(200).send("User deleted");
      });
    } else {
      res.status(404).send("User not found");
    }
  });
};

export const follow = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const user = db.users.find((user) => user._id === req.params.id);
    const currentUser = db.users.find((user) => user._id === req.body.id);

    if (user && currentUser && !user.followers.includes(req.body.id)) {
      user.followers.push(req.body.id);
      currentUser.following.push(req.params.id);

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing to db.json");
          return;
        }
        res.status(200).send("User followed");
      });
    } else {
      res.status(403).send("Cannot follow this user");
    }
  });
};

export const unFollow = (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading db.json");
      return;
    }

    const db = JSON.parse(data);
    const user = db.users.find((user) => user._id === req.params.id);
    const currentUser = db.users.find((user) => user._id === req.body.id);

    if (user && currentUser && user.followers.includes(req.body.id)) {
      const followerIndex = user.followers.indexOf(req.body.id);
      const followingIndex = currentUser.following.indexOf(req.params.id);

      user.followers.splice(followerIndex, 1);
      currentUser.following.splice(followingIndex, 1);

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing to db.json");
          return;
        }
        res.status(200).send("User unfollowed");
      });
    } else {
      res.status(403).send("Cannot unfollow this user");
    }
  });
};

