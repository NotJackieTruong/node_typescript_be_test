"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const Buffer = require('buffer').Buffer;
class Utils {
    static getIpAddress(interfaces) {
        for (let devName in interfaces) {
            let iFace = interfaces[devName];
            for (let i = 0; i < iFace.length; i++) {
                let alias = iFace[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                    return alias.address;
            }
        }
        return '0.0.0.0';
    }
    // expiresIn: second
    static generateJwt(data, privateKey = process.env.PRIVATE_KEY, algorithm = 'HS256', options = {}) {
        let token = jwt.sign(data, privateKey, Object.assign({ algorithm, expiresIn: 60 * 60 }, options));
        return token;
    }
    static verifyJwt(token, privateKey = process.env.PRIVATE_KEY) {
        try {
            let decodedToken = jwt.verify(token, privateKey);
            return decodedToken;
        }
        catch (e) {
            return null;
        }
    }
    static queryTime(Schema, operation) {
        Schema.pre(operation, function () {
            this._startTime = Date.now();
        });
        Schema.post(operation, function () {
            if (this._startTime != null) {
                console.log(`${operation} query time: ${Date.now() - this._startTime}ms`);
            }
        });
    }
    static escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    static getFileExtension(base64Data) {
        const type = base64Data.split(';')[0].split('/')[1];
        return type;
    }
    static convertBase64ToBuffer(base64String) {
        let imageData = base64String.replace(/^data:image\/\w+;base64,/, "");
        let buffer = Buffer.from(imageData, 'base64');
        return buffer;
    }
}
module.exports = Utils;
//# sourceMappingURL=utils.js.map