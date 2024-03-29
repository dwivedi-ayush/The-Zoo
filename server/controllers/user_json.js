import fs from "fs";
import path from "path";
import axios from 'axios';

const dbPath = "http://localhost:3001/";

export const getAllUsers = async (req, res) => {
  try {
    const response = await axios.get(`${dbPath}users`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching users");
  }
};

export const getUser = async (req, res) => {
  try {
    const response = await axios.get(`${dbPath}users/${req.params.id}`);
    if (response.data) {
      res.status(200).json(response.data);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user");
  }
};

export const update = async (req, res) => {
  try {
    const response = await axios.put(`${dbPath}users/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

export const deleteUser = async (req, res) => {
  try {
    await axios.delete(`${dbPath}users/${req.params.id}`);
    res.status(200).send("User deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};

export const follow = async (req, res) => {
  try {
    const response = await axios.post(`${dbPath}users/${req.params.id}/follow`, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error following user");
  }
};

export const unFollow = async (req, res) => {
  try {
    const response = await axios.post(`${dbPath}users/${req.params.id}/unfollow`, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error unfollowing user");
  }
};

