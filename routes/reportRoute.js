import express from "express";
import { addReport, getAllReport,deleteAllReport, getOnceReport/*, deleteOnceReport,UpdateReport*/} from "../controllers/reportController.js";
const router = express.Router();

router
.route("/")
.post(addReport)
.get(getAllReport)
.delete(deleteAllReport);


/*router
.route("/:_id")
.get(getOnceReport)
.delete(deleteOnceReport)
.put(UpdateReport);*/

export default router;