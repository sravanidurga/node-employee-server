var Router = require('./basecontroller');
const middleware = require("../Middleware");
const RouteStub = require('../Common/routestub');
const EncryptionService = require("../Services/Encryption.service");
const asyncWrapper = middleware.asyncWrapper;
var multer = require('multer');

//var fs = require('fs');

class EncryptionController extends Router {
    constructor(routePath, app) {
        super(routePath, app);
        this.Service = new EncryptionService();
    }

    
    get imageMulter() {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './ServerFiles')
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now())
            }
        })

        var upload = multer({
            storage: storage
        }).array('image');

        return upload;
    }


    get services() {
        return [
            // Property Routes
            new RouteStub('GET', '/get-hash', 'getHash'),
            new RouteStub('GET', '/generate-keys', 'generateKeys'),
            new RouteStub('POST', '/encrypt-with-public-key', 'encryptWithPublicKey','imageMulter'),
            new RouteStub('POST', '/decrypt-with-private-key', 'decryptWithPrivateKey')
         ];
    }

      async getHash(req, res) {
        const data = await asyncWrapper("Failed to Get Hash", this.Service.getHash,req.query.name);
        console.log(data);
        res.status(data.statusCode).send(data);
    }

    async generateKeys(req,res){
        const data = await asyncWrapper("Failed to Generate Keys", this.Service.generateKeys);
        console.log(data);
        res.status(data.statusCode).send(data);
    }

    async encryptWithPublicKey(req,res){
        // const data = await asyncWrapper("Failed to Encrypt", this.Service.encryptWithPublicKey,req.body.text,req.body.receiverPublicKey,req.body.senderPrivateKey);
        // console.log(data);
        // res.status(data.statusCode).send(data);
        if (req.files) {
            const data = await asyncWrapper("Failed to Encrypt", this.Service.encryptWithPublicKey, JSON.parse(req.body.data), req.files[0]);
            res.status(data.statusCode).send(data);

        } else {
            const data = await asyncWrapper("Failed to Encrypt", this.Service.encryptWithPublicKey, JSON.parse(req.body.data), "");
            res.status(data.statusCode).send(data);
        }
    }

    // async decryptWithPrivateKey(req,res){
    //     const data = await asyncWrapper("Failed to Decrypt", this.Service.decryptWithPrivateKey,req.body.encrypted,req.body.receiverPrivateKey,req.body.senderPublicKey);
    //     console.log(data);
    //     res.status(data.statusCode).send(data);
    // }
    async decryptWithPrivateKey(req,res){
        const data = await asyncWrapper("Failed to Decrypt", this.Service.decryptWithPrivateKey,req.body);
        console.log(data);
        res.status(data.statusCode).send(data);
    }

}

module.exports = EncryptionController;