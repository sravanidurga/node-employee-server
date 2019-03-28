// const accountsettingRepository = require('../../DataAccess/accountSetting.repo');
var fs = require('fs');
const { writeFileSync } = require('fs')
const { generateKeyPairSync } = require('crypto')
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
const passphrase = "mySecret"
class EncryptionService {

    async getHash(name) {
        var crypto = require('crypto');
        var hash = crypto.createHash('sha256').update(name).digest('base64');
        return hash;

    }

    async verifyHash(hash, name) {

    }




async encryptStringWithRsaPublicKey(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

 async decryptStringWithRsaPrivateKey (toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toDecrypt, "base64");
    try{
    //var decrypted1 = crypto.privateDecrypt(privateKey, buffer);
    const decrypted = crypto.privateDecrypt(
        {
            key: fs.readFileSync(relativeOrAbsolutePathtoPrivateKey, 'utf8'),
            passphrase: passphrase,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        buffer,
              
    )
    return decrypted.toString("utf8");
    }
    catch(ex){
        console.log(ex);
        
    }
    
};



 async generateKeys() {
    const { publicKey, privateKey } = generateKeyPairSync('rsa',
        {
            modulusLength: 4096,
            namedCurve: 'secp256k1',
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: passphrase
            }
        });

    writeFileSync('private.pem', privateKey)
    writeFileSync('public.pem', publicKey)
}

//generateKeys();

// let a = encryptStringWithRsaPublicKey("hello", "public.pem")
// let b = decryptStringWithRsaPrivateKey(a, "private.pem");
// console.log(b)
}

module.exports = EncryptionService;