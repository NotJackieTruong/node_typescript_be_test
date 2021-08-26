export {}
// import {Schema} from 'mongoose'
import * as mongoose from 'mongoose'
const jwt = require('jsonwebtoken')
const Buffer = require('buffer').Buffer

// type CustomSchema = mongoose.Schema
interface CustomSchema extends mongoose.Schema {}

class Utils {
  static getIpAddress(interfaces: any): string {
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
  static generateJwt(data: Object, privateKey: string = process.env.PRIVATE_KEY!, algorithm: string = 'HS256', options: Object = {}): string {
    let token = jwt.sign(data, privateKey, {algorithm, expiresIn: 60 * 60, ...options})
    return token
  }

  static verifyJwt(token: string, privateKey: string = process.env.PRIVATE_KEY!) {
    try {
      let decodedToken = jwt.verify(token, privateKey)
      return decodedToken
    } catch (e) {
      return null
    }
  }

  static queryTime(Schema: CustomSchema, operation: string) {
    Schema.pre(operation, function (this: any) {
      this._startTime = Date.now();
    });

    Schema.post(operation, function (this: any) {
      if (this._startTime != null) {
        console.log(`${operation} query time: ${Date.now() - this._startTime}ms`);
      }
    });
  }

  static escapeRegex(text: string):string{
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
  }

  static getFileExtension(base64Data:string){
    const type = base64Data.split(';')[0].split('/')[1];
    return type
  }

  static convertBase64ToBuffer(base64String:String){
    let imageData = base64String.replace(/^data:image\/\w+;base64,/, "")
    let buffer = Buffer.from(imageData, 'base64')
    return buffer
  }
}

module.exports = Utils
