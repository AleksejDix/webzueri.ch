
import admin from 'firebase-admin';

const cert = process.env.NODE_ENV === "development"
  ? process.env.firebase_admin_private_key.replace(/\\n/g, '\n')
  : Buffer.from(process.env.firebase_admin_private_key, 'base64').toString().replace(/\\n/g, '\n')

const config = {
  "type": "service_account",
  "project_id": "web-zuri",
  "private_key_id": "775ec7ac5a696e73b62f49e04852ec66fab6ac73",
  "private_key": cert,
  "client_email": "firebase-adminsdk-fbxi5@web-zuri.iam.gserviceaccount.com",
  "client_id": "117094198197846344766",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbxi5%40web-zuri.iam.gserviceaccount.com"
}

export default admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: `https://${config.project_id}.firebaseio.com`
});
