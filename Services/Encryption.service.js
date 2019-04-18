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
    async generateKeys() {
        const myKeyPair = assymetricCrypto.keyPair();
        const theirKeyPair = assymetricCrypto.keyPair();
        return [myKeyPair, theirKeyPair];
    }

    // async encryptWithPublicKey(text, receiverPublicKey, senderPrivateKey){
    //     const encrypted = assymetricCrypto.encrypt(text, receiverPublicKey, senderPrivateKey)
    //     return encrypted;    
    // }

    async encryptWithPublicKey(data, fileData) {
        return new Promise((resolve, reject) => {
            let fileType = "";
            let fileName = "";
            fileType = fileData.mimetype;
            fileName = fileData.filename;

            fs.readFile('./ServerFiles/' + fileName, 'utf8', async function readFileCallback(err, text) {
                if (err) {
                    console.log(err);
                    reject({ Message: "Failed to Encrypt" });
                } else {
                    const encrypted = assymetricCrypto.encrypt(text, data.receiverPublicKey, data.senderPrivateKey)
                    // return encrypted; 
                    fs.writeFile('./ServerFiles/' + fileName, JSON.stringify(encrypted), 'utf8', async function readFileCallback(err, data) {
                        if (err) {
                            console.log(err);
                            reject({ Message: "Failed to Encrypt" });
                        } else {
                            console.log("Successfully written");
                            resolve({ Message: "Successfully Encrypted",fileName:fileName });
                        }
                    }); // write it back 
                }
            });
        });   
    }

    // async decryptWithPrivateKey(encrypted, receiverPrivateKey, senderPublicKey) {
    //     const decrypted = assymetricCrypto.decrypt(encrypted.data, encrypted.nonce, senderPublicKey, receiverPrivateKey)
    //     return decrypted;
    // }

    async decryptWithPrivateKey(data) {
        // const decrypted = assymetricCrypto.decrypt(encrypted.data, encrypted.nonce, senderPublicKey, receiverPrivateKey)
        // return decrypted;
        return new Promise((resolve, reject) => {
            fs.readFile('./ServerFiles/' + data.fileName, 'utf8', async function readFileCallback(err, text) {
                if (err) {
                    console.log(err);
                    reject({ Message: "Failed to Decrypt" });
                } else {
                    var encryptedData = JSON.parse(text);
                    const decrypted = assymetricCrypto.decrypt(encryptedData.data, encryptedData.nonce, data.senderPublicKey, data.receiverPrivateKey)
                    // return encrypted; 
                    fs.writeFile('./ServerFiles/' + data.fileName+"-decrypted", JSON.stringify(decrypted), 'utf8', async function readFileCallback(err, text) {
                        if (err) {
                            console.log(err);
                            reject({ Message: "Failed to Decrypt" });
                        } else {
                            console.log("Successfully written");
                            resolve({ Message: "Successfully Decrypted",fileName:data.fileName+"-decrypted" });
                        }
                    }); // write it back 
                }
            });
        });  
    }

}

module.exports = EncryptionService;