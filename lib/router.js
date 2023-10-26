"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
var crypto_1 = __importDefault(require("crypto"));
var express_1 = require("express");
var mongoose_1 = __importDefault(require("mongoose"));
var multer_1 = __importDefault(require("multer"));
var multer_gridfs_storage_1 = require("multer-gridfs-storage");
var path_1 = __importDefault(require("path"));
mongoose_1.default.connect(process.env.MONGO_URI);
var conn = mongoose_1.default.connection;
// Init gfs
var gfs;
conn.once('open', function () {
    // Init stream
    gfs = new mongoose_1.default.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
});
// Create storage engine
var storage = new multer_gridfs_storage_1.GridFsStorage({
    url: process.env.MONGO_URI,
    file: function (req, file) {
        return new Promise(function (resolve, reject) {
            crypto_1.default.randomBytes(16, function (err, buf) {
                if (err) {
                    return reject(err);
                }
                var filename = buf.toString('hex') + path_1.default.extname(file.originalname);
                var fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                };
                resolve(fileInfo);
            });
        });
    },
});
exports.uploadMiddleware = (0, multer_1.default)({ storage: storage });
exports.default = (0, express_1.Router)()
    .post('/', exports.uploadMiddleware.single('file'), function (req, res) {
    res.json({ file: req.file });
})
    .get('/:filename', function (req, res) {
    gfs
        .find({ filename: req.params.filename })
        .toArray()
        .then(function (files) {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist',
            });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    })
        .catch(function (err) {
        res.status(404).json({
            err: 'No files found',
        });
    });
});
