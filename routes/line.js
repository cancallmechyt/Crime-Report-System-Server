const express = require('express');
const router = express.Router();

// Importing functions for LINE messaging
const { Sendmessage, SendWelcome, SetRichMenuUser, SetRichMenuPolice, SetRichMenuDefault, SendFlexEmergency } = require("../modules/line");

router.post("/success/:lineid", Sendmessage); // Send Message on Success
router.post("/welcome", SendWelcome); // Send Welcome Message
router.post("/richmenuuser", SetRichMenuUser); // Set Rich Menu for User
router.post("/richmenupolice", SetRichMenuPolice); // Set Rich Menu for Police
router.post("/richmenudefault", SetRichMenuDefault); // Set Default Rich Menu
router.post("/emergency", SendFlexEmergency); // Send Emergency Flex Message 

module.exports = router;
