import express from "express";
import { addReclamation,getByType, getAllReclamation,deleteAllReclamation, deleteOnceReclamation,UpdateReclamation} from "../controllers/reclamationController.js";
const router = express.Router();


router
.route("/")
.post(addReclamation)
.get(getAllReclamation)
.delete(deleteAllReclamation);


router
.route("/:_id")
.delete(deleteOnceReclamation)
.put(UpdateReclamation);
router
.route("/type/:type")
.get(getByType);



export default router;