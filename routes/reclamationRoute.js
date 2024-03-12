import express from "express";
import { addReclamation,getByType, getAllReclamation,deleteAllReclamation, getOnceReclamation, deleteOnceReclamation,UpdateReclamation} from "../controllers/reclamationController.js";
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
router
route("/:type")
.get(getByType)


export default router;