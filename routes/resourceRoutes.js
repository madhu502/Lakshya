const router = require("express").Router();
const resourceController = require("../controllers/resourceControllers");
const { authGuard, adminGuard } = require("../middleware/authGuard");
// const { authGuard, adminGuard } = require("../middleware/authGuard");

router.post("/add_resource", resourceController.addResource);

//fetch all resources
router.get("/get_all_resource", resourceController.getAllResources);

//fetch single resources
router.get(
  "/get_single_resource/:id",

  resourceController.getSingleResource
);

//delete resources
router.delete(
  "/delete_resource/:id",

  resourceController.deleteResource
);

// update resources
router.put(
  "/update_resource/:id",

  resourceController.updateResource
);

//resource pagination
router.get("/pagination", resourceController.paginationResources);

module.exports = router;
