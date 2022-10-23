const router = require("express")();
const {
  getRandomUser,
  getAllUsers,
  saveAUser,
  deleteAUser,
  updateAUser,
  bulkUpdateUsers,
} = require("../controllers/user.controller");

router.get("/random", getRandomUser);
router.get("/all", getAllUsers);
router.post("/save", saveAUser);
router.delete("/delete/:id", deleteAUser);
router.patch("/update/:id", updateAUser);
router.patch("/bulk-update", bulkUpdateUsers);

module.exports = router;
