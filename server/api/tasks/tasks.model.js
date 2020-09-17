'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var config = require('../../config/environment');
var TaskSchema = new Schema({
  name: { type: String, maxlength: [40, 'name must be less than or equals to 40 characters'] },
  expiry:Date,
  status:String,
  createdBy :{type:Schema.Types.ObjectId,ref:'User'},
  active: { type: Boolean, required: true, default: true },
}, { timestamps: true });




module.exports = mongoose.model('Tasks', TaskSchema);
