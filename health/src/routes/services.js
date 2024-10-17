import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"
import { serviceRegister, logInService, logoutService, updateService, deleteService, getAllServices, getAllServicesId } from '../controller/service.controller.js'

const router = Router();
router.route("/registerService").post(serviceRegister)
router.route('/logInService').post(logInService)
router.route('/logoutService').get(verifyJWT, logoutService)
router.route("/updateService").patch(verifyJWT, updateService)
router.route("/deleteService").delete(verifyJWT, deleteService)
router.route("/getService").post(verifyJWT, getAllServicesId)
router.route("/getAllService").get(verifyJWT, getAllServices)

export default router