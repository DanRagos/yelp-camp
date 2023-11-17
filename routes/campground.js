const express = require('express');
const router = express.Router();
const catchAsync = require ('../utils/catchAsync');
const Campground = require('../models/campground');
const {validateCampground, isAuthor, isLoggedIn} = require('../middleware/middleWare')
const campgrounds = require ('../controllers/campgrounds');


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground ));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync (campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync (campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (campgrounds.renderEditForm));




module.exports = router;
