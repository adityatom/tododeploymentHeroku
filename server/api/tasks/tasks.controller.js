'use strict';

var Tasks = require('./tasks.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var socketio = require('socket.io-client')(config.backendurl)

var validationError = function(res, err) {
  return res.status(422).json(err);
}

/**
 * @api {get} /  Get list of Tasks restriction: 'admin'
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName index
 * @apiGroup Tasks
 * @apiSuccess {array}  Get list of Taskss  
 * @apiError 500-InternalServerError SERVER error.
 */
exports.index = function(req, res) {
  Tasks.find({}).populate('createdBy','name email').sort({ updatedAt: -1 }).exec(function (err, Taskss) {
    if(err) return res.status(500).send(err);
    res.status(200).json(Taskss);
  });
};




/**
 * @api {post} /  Create  New Tasks
 * @apiName create
 * @apiGroup Tasks
 * @apiSuccess {json}   token
 * @apiError 500-InternalServerError SERVER error.
 */
exports.create = function (req, res, next) {
  req.body.createdBy=req.user.id
  var newTasks = new Tasks(req.body);
  newTasks.save(async function(err, Task) {
   var doc= await  Tasks.populate(Task,{path:"createdBy",select:"name email"})
  socketio.emit('task:save', doc); // socket emiting when user create

    if (err) return validationError(res, err);
    res.status(200).json(Task);
  });
};

/**
 * @api {delete} /:id     Delete selected restriction: 'admin'
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName destroy
 * @apiGroup Tasks
 * @apiSuccess {string} no content
 * @apiError 500-InternalServerError SERVER error.
 */
exports.update = function(req, res) {
  Tasks.findOneAndUpdate({_id:req.params.id},req.body,{new:true}).exec(async function(err, Task) {
    if(err) return res.status(500).send(err);
    if(Task){
      var doc= await  Tasks.populate(Task,{path:"createdBy",select:"name email"})
  socketio.emit('task:update', doc); // socket emiting when user create
      return res.status(200).json(Task);
    }
  });
};

/**
 * @api {delete} /:id     Delete selected restriction: 'admin'
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName destroy
 * @apiGroup Tasks
 * @apiSuccess {string} no content
 * @apiError 500-InternalServerError SERVER error.
 */
exports.destroy = function(req, res) {
  Tasks.findByIdAndRemove(req.params.id, function(err, Tasks) {
    if(err) return res.status(500).send(err);
    if(Tasks){
      var id={
        taskid:Tasks._id,
        message:"delete"
      }
  socketio.emit('task:delete', id); // socket emiting when user create

      return res.status(204).send('No Content');
    }
  });
};



/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
