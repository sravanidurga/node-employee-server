// const accountsettingRepository = require('../../DataAccess/accountSetting.repo');
var fs = require('fs');
const { writeFileSync } = require('fs')
const { generateKeyPairSync } = require('crypto')
var crypto = require("crypto");
const assymetricCrypto = require('asymmetric-crypto') 
var path = require("path");
var fs = require("fs");
const passphrase = "mySecret"
class EncryptionService {

    async getHash(name) {
        var crypto = require('crypto');
        var hash = crypto.createHash('sha256').update(name).digest('base64');
        return hash;

    }
    async generateKeys(){
        const myKeyPair = assymetricCrypto.keyPair();
        const theirKeyPair = assymetricCrypto.keyPair();
        return [myKeyPair,theirKeyPair];    
    }

    async encryptWithPublicKey(text, receiverPublicKey, senderPrivateKey){
        const encrypted = assymetricCrypto.encrypt(text, receiverPublicKey, senderPrivateKey)
        return encrypted;    
    }

    async decryptWithPrivateKey(encrypted,receiverPrivateKey, senderPublicKey){
        const decrypted = assymetricCrypto.decrypt(encrypted.data, encrypted.nonce, senderPublicKey, receiverPrivateKey)
        return decrypted;    
    }

}

module.exports = EncryptionService;