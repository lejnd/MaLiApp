import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';

export default {
    // 加密
    encrypt(word, keyStr, ivStr) {
        let key = CryptoJS.enc.Utf8.parse(keyStr);   // key Utf8转码
        let iv = CryptoJS.enc.Utf8.parse(ivStr);   // iv Utf8转码
        let srcs = CryptoJS.enc.Utf8.parse(word);   // 加密字符串 Utf8转码
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {    // AES CBC加密
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        // let str = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        // return Base64.encode(str);
        // 将加密后的数据转换成 Base64
        const base64Cipher = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        // 处理 Android 某些低版的BUG
      //   const resultCipher = base64Cipher.replace(/\+/g,'-').replace(/\//g,'_');
        // 返回加密后的经过处理的 Base64
        return base64Cipher;
    },
    encrypt2(word, keyStr, ivStr) {
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let iv = CryptoJS.enc.Utf8.parse(ivStr);
        var encrypted = CryptoJS.AES.encrypt(word, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString()        
    },
    //解密
    decrypt(word, keyStr, ivStr) {
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let iv = CryptoJS.enc.Utf8.parse(ivStr);
        let base64 = CryptoJS.enc.Base64.parse(Base64.decode(word));
        let src = CryptoJS.enc.Base64.stringify(base64);
        var decrypt = CryptoJS.AES.decrypt(src, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },
    // ECB加密
    /**
     * 生成密钥字节数组, 原始密钥字符串不足128位, 补填0.
     */
    fillKey(key) {
        const filledKey = Buffer.alloc(128 / 8);
        const keys = Buffer.from(key);
        if (keys.length < filledKey.length) {
            filledKey.map((b, i) => filledKey[i] = keys[i]);
        }
        return filledKey;
    },
    encryptECB(word, keyStr) {
        let key = CryptoJS.enc.Utf8.parse(this.fillKey(keyStr));
        let data = CryptoJS.enc.Utf8.parse(word);
        const cipher = CryptoJS.AES.encrypt(data, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          });
          // 将加密后的数据转换成 Base64
          const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
          // 处理 Android 某些低版的BUG
        //   const resultCipher = base64Cipher.replace(/\+/g,'-').replace(/\//g,'_');
          // 返回加密后的经过处理的 Base64
          return base64Cipher;
    },
}