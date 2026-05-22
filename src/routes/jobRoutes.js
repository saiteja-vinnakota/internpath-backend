import express from "express";

import {

  create,
  getAll,
  getOne,
  update,
  remove,

} from "../controllers/jobController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import authorizeRoles
from "../middleware/roleMiddleware.js";

import {
  ROLES
} from "../constants/roles.js";

import validate
from "../middleware/validateMiddleware.js";

import {

  createJobSchema,
  updateJobSchema

} from "../validators/jobValidator.js";

import {
  idParamsSchema
} from "../validators/commonValidator.js";


const router =
  express.Router();




// Public Routes

router.get(
  "/",
  getAll
);




router.get(

  "/:id",

  validate(
    idParamsSchema
  ),

  getOne
);




// Recruiter Protected Routes

router.post(

  "/",

  protect,

  authorizeRoles(
    ROLES.RECRUITER
  ),

  validate(
    createJobSchema
  ),

  create
);




router.put(

  "/:id",

  protect,

  authorizeRoles(
    ROLES.RECRUITER
  ),

  validate(
    updateJobSchema
  ),

  update
);




router.delete(

  "/:id",

  protect,

  authorizeRoles(
    ROLES.RECRUITER
  ),

  validate(
    idParamsSchema
  ),

  remove
);


export default router;