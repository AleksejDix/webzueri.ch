import admin from '../services/firebase/admin-init.js'
const cookieParser = require('cookie-parser')();
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const db = admin.firestore()
db.settings({timestampsInSnapshots: true})

const getDocByUID = async (collection, uid) => await db.collection(collection).doc(uid).get()

export default async function (req, res, next) {
  const token = await getIdTokenFromRequest(req, res)
  if (token) await addDecodedIdTokenToRequest(token, req)
  next();
}

function getIdTokenFromRequest(req, res) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    return Promise.resolve(req.headers.authorization.split('Bearer ')[1]);
  }
  return new Promise(function(resolve) {
    cookieParser(req, res, () => {
      if (req.cookies && req.cookies.__webzurich) {
        console.log('Found "__webzurich" cookie');
        // Read the ID Token from cookie.
        resolve(req.cookies.__webzurich);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Returns a Promise with the Decoded ID Token and adds it to req.user.
 */
const addDecodedIdTokenToRequest = async (token, req) => {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(token)
    if (!decodedIdToken) return req
    console.log('ID Token correctly decoded');
    req.user = decodedIdToken;

    // console.error('Error while verifying Firebase ID token:', error);

    const doc = await db.collection('users').doc(decodedIdToken.uid).get()
    if (!doc && !doc.exists) return req
    console.log('User profile was found');
    req.profile = doc.data()

    return req
  } catch (error) {
    console.log(error)
  }
}
