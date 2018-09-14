const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// const keys = require('../../config/keys');

// load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// load profile model
const Profile = require('../../models/Profile');

// load user model
const User = require('../../models/User');

const jwtAuth = passport.authenticate('jwt', { session: false });

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', jwtAuth, (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

// @route   GET api/profile/all
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(400).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(400).json('There are no profiles'));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  const handle = req.params.handle;
  Profile.findOne({ handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.profile = 'There is no profile for this user';
        res.status(400).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(400).json('There is no profile for this user'));
});

// @route   GET api/profile/user/:id
// @desc    Get profile by handle
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  const user = req.params.user_id;
  Profile.findOne({ user })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(400).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(400).json('There is no profile for this user'));
});

// @route   POST api/profile
// @desc    Create or Edit user profile
// @access  Private
router.post('/', jwtAuth, (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // check validation
  if (!isValid) {
    // return any errors with 400 status
    return res.status(400).json(errors);
  }
  // get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // skills split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  // social links
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;

  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      // update
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));
    } else {
      // create

      // check if handle exists
      Profile.findOne({ handle: profileFields.handle }).then((profile) => {
        if (profile) {
          errors.handle = 'Handle alreay exists';
          res.status(400).json(errors);
        }

        // save profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});

// @route   POST api/profile/experience
// @desc    add experience to profile
// @access  Private
router.post('/experience', jwtAuth, (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // check validation
  if (!isValid) {
    // return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then((profile) => {
    console.log(profile);
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    // Add to experience array
    profile.experience.unshift(newExp);

    profile.save().then(profile => res.json(profile));
  });
});

// @route   POST api/profile/education
// @desc    add education to profile
// @access  Private
router.post('/education', jwtAuth, (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // check validation
  if (!isValid) {
    // return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then((profile) => {
    console.log(profile);
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    // Add to experience array
    profile.education.unshift(newEdu);

    profile.save().then(profile => res.json(profile));
  });
});
module.exports = router;
