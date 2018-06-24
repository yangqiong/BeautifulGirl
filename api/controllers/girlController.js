const mongoose = require('mongoose');
const Girl = require("../models/girlModel");

exports.list_all = async function(req, res){
    let pageCount = 10;
    let page = req.query.page || 0;
    let girls = await Girl.find({},{},{ skip: pageCount * page, limit: pageCount }).exec();
    girls = girls.map(function(girl){
        return {
            img_count: girl.imgs.length,
            _id: girl._id,
            poster: girl.poster
        }
    })
    res.json(girls);
}

exports.get_a_girl_imgs = async function(req, res){
    let girl = await Girl.find({_id: req.query._id}).limit(50).exec();
    res.json(girl);
}