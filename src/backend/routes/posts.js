const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const postController = require('../controllers/posts');



router.post("",checkAuth, extractFile, postController.createPost);


router.put("/:id",
checkAuth,
extractFile,
  postController.updatePost
  );

router.get("/:id", postController.getSinglePost);

router.delete("/:id",
checkAuth, postController.deletePost
 );

router.get('', postController.getPosts);

module.exports = router;
