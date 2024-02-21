import express from "express";
import { addReclamation, getAllReclamation,deleteAllReclamation,getOnceReclamation, deleteOnceReclamation,UpdateReclamation} from "../controllers/reclamationControlles.js";
const router = express.Router();

router
.route("/")
.post(addReclamation)
.get(getAllReclamation)
.delete(deleteAllReclamation);


router
.route("/:_id")
.get(getOnceReclamation)
.delete(deleteOnceReclamation)
.put(UpdateReclamation);

export default router;