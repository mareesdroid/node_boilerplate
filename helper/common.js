'use strict';

const Speakeasy = require("speakeasy")
const dot = require('dot-object');
const requestIp = require('request-ip');
const aws = require('aws-sdk');
const fs = require('fs');
const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");


exports.generateRandomNumber = function () {
  let text = "";
  let possible = "0123456789";
  for (let i = 0; i < 7; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
/**
 * upload image to bucket
 */
exports.awsUpload = async (req) => {
  const generateRandomNumber = () => {
    let text = "";
    let possible = "0123456789";
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  try {
    const s3 = new aws.S3({ accessKeyId: AES.decrypt('aws access key here', 'secret phrase here').toString(CryptoJS.enc.Utf8), secretAccessKey: AES.decrypt('aws secret key here', 'secret phrase here').toString(CryptoJS.enc.Utf8) })
    let gnum = generateRandomNumber();
    let file = fs.readFileSync(req.file.path);
    let params = { Bucket: "boiler", Body: file, Key: gnum + req.file.originalname, ACL: "public-read" };
    const resp = await s3.upload(params).promise()
    return {
      ...resp,
      success: true
    }
  } catch (e) {
    console.info(e)
    console.info(e.toString())
    console.error(e)
    return {
      success: false,
      error: e
    }
  }
}


exports.randomString = function (len) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


exports.killServer = function (time) {
  setTimeout(() => {
    process.exit(1)
  }, time)
}


exports.getCurrentIp = (req) => {
  return requestIp.getClientIp(req); // on localhost > 127.0.0.1
}

exports.convertObjectToDotString = function (obj) {
  return dot.dot(obj)
}


exports.getIp = function (req) {
  let ip = req.ip
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }
  return ip
}


/**
 * 
 */
exports.generateOTP = async (secret) => {
  return Speakeasy.time({
    secret: secret,
    encoding: "base32",
    step: 600,//10 mins
    window: 0
  })
}

exports.validateOTP = async (secret, token) => {
  return Speakeasy.time.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    step: 600,//10 mins
    window: 0
  })
}
