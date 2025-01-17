import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebasekey/firebasekey";

const usuario = {
    email: 'ecschiullo@gmail.com',
    password: '123456'
}

async function authtDatabase() {
  const auth = getAuth(app)

  signInWithEmailAndPassword(auth, usuario.email, usuario.password)
  .then((userCredential) => {
    // Signed in 
    const user = 'User';
    // ...
    return user
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    return `${errorCode}, ${errorMessage}`
  });
}


export default authtDatabase