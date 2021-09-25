const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware');

