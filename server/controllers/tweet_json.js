import fs from "fs";
import path from "path";
import axios from 'axios';

const dbPath = "http://localhost:3001/";

export const createTweet = async (req, res) => {
  try {
    const newTweet = req.body;
    const response = await axios.post(`${dbPath}tweets`, newTweet);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error writing to the database");
  }
};

export const deleteTweet = async (req, res) => {
  try {
    const response = await axios.delete(`${dbPath}tweets/${req.params.id}`);
    if (response.status === 200) {
      res.status(200).send("Tweet deleted");
    } else {
      res.status(404).send("Tweet not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting from the database");
  }
};

export const likeOrDislike = async (req, res) => {
  try {
    const tweet = await axios.get(`${dbPath}tweets/${req.params.id}`);
    if (tweet.data) {
      const userIndex = tweet.data.likes.indexOf(req.body.id);
      if (userIndex === -1) {
        tweet.data.likes.push(req.body.id);
        res.status(200).send("Tweet liked");
      } else {
        tweet.data.likes.splice(userIndex, 1);
        res.status(200).send("Tweet disliked");
      }
      await axios.put(`${dbPath}tweets/${req.params.id}`, tweet.data);
    } else {
      res.status(404).send("Tweet not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating the database");
  }
};

export const getAllTweets = async (req, res) => {
  try {
    const response = await axios.get(`${dbPath}tweets`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading from the database");
  }
};

export const getUserTweets = async (req, res) => {
  try {
    const response = await axios.get(`${dbPath}tweets`);
    const userTweets = response.data.filter(
      (tweet) => tweet.userId === req.params.id
    );

    if (userTweets.length > 0) {
      res.status(200).json(userTweets);
    } else {
      res.status(404).send("No tweets found for this user");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading from the database");
  }
};

export const getExploreTweets = async (req, res) => {
  try {
    const response = await axios.get(`${dbPath}tweets`);
    const exploreTweets = response.data.filter(
      (tweet) => tweet.likes && tweet.likes.length > 0
    );

    if (exploreTweets.length > 0) {
      res.status(200).json(exploreTweets);
    } else {
      res.status(404).send("No tweets found for exploration");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading from the database");
  }
};

