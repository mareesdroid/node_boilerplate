const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");


/**
 * For encryption
 * use this function to get a encrypted credentials
 * start encrypting ur credentials whenever add new one and update encrypted credential to your env
 */
// AES.encrypt(textToEncrypt, secetPhrase).toString()

/**
 * use this function to get decrypted credentials
 */
// AES.decrypt(textToDecrypt, secetPhrase).toString(CryptoJS.enc.Utf8)


module.exports = {
  env: 'prod',
  port: `port number here`,
  mongoose: {
    url: `mongodb://${AES.decrypt(`Encrypted db host here`, `Secret phrase here`).toString(CryptoJS.enc.Utf8)}:${AES.decrypt(`Encrypted db pass here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8)}@${AES.decrypt(`Encrypted db ip here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8)}:${AES.decrypt(`Encrypted db port here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8)}/${AES.decrypt(`Encrypted db name here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8)}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: AES.decrypt(`Encrypted jwt secret here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8),
    accessExpirationMinutes: `Encrypted expire time here`,
    refreshExpirationDays: `Encrypted jwt expiration days here`,
    resetPasswordExpirationMinutes: `Encrypted reset password expiration here`,
    resetPatternExpirationMinutes: `Encrypted reset pattern expiration here`,
    verifyEmailExpirationMinutes: `Encrypted verify email expiration here`,
  },
  email: {
    smtp: {
      host: AES.decrypt(`Encrypted smtp host here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8),
      port: parseInt(AES.decrypt(`Encrypted smtp port here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8)),
      auth: {
        user: AES.decrypt(`Encrypted smtp username here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8),
        pass: AES.decrypt(`Encrypted smtp pass here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8)
      },
    },
    from: AES.decrypt(`Encrypted db host here`, 'Secret phrase here').toString(CryptoJS.enc.Utf8)
  },
};
