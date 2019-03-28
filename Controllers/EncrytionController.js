var Router = require('./basecontroller');
const middleware = require("../Middleware");
const RouteStub = require('../Common/routestub');
const EncryptionService = require("../Services/Encryption.service");
const asyncWrapper = middleware.asyncWrapper;

//var fs = require('fs');

class EncryptionController extends Router {
    constructor(routePath, app) {
        super(routePath, app);
        this.Service = new EncryptionService();
    }

    get services() {
        return [
            // Property Routes
            new RouteStub('GET', '/get-hash', 'getHash'),
            new RouteStub('GET', '/generate-keys', 'generateKeys'),
            new RouteStub('GET', '/encrypt-with-public-key', 'encryptWithPublicKey'),
            new RouteStub('GET', '/decrypt-with-private-key', 'decryptWithPrivateKey')
        //     new RouteStub('POST','/add-employee','addEmployee'),
        //     new RouteStub('POST','/update-employee','updateEmployee'),
        //     new RouteStub('POST','/delete-employee','deleteEmployee'),
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
        const data = await asyncWrapper("Failed to Encrypt", this.Service.encryptStringWithRsaPublicKey,req.query.toEncrypt,'public.pem');
        console.log(data);
        res.status(data.statusCode).send(data);
    }

    async decryptWithPrivateKey(req,res){
        const data = await asyncWrapper("Failed to Decrypt", this.Service.decryptStringWithRsaPrivateKey,req.query.toDecrypt,'private.pem');
        console.log(data);
        res.status(data.statusCode).send(data);
    }
    // async addEmployee(req, res) {
    //     const data = await asyncWrapper("Failed to Add Employee", this.Service.addEmployee,req.body);
    //     res.status(data.statusCode).send(data);
    // }
    // async updateEmployee(req, res) {
    //     const data = await asyncWrapper("Failed to Update Employee", this.Service.updateEmployee,req.body);
    //     res.status(data.statusCode).send(data);
    // }
    // async deleteEmployee(req, res) {
    //     const data = await asyncWrapper("Failed to Delete Employee", this.Service.deleteEmployee,req.body);
    //     res.status(data.statusCode).send(data);
    // }

 
}

module.exports = EncryptionController;