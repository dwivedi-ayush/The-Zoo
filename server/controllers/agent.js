import Agent from "../models/Agent.js";
import { handleError } from "../error.js";

export const getAgent = async (req, res, next) => {
    try {
      
    
      const agent = await Agent.findOne({alias:req.params.alias});
      res.status(200).json(agent);
      
    } catch (err) {
      next(err);
    }
  };