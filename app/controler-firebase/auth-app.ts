import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebasekey/firebasekey";

export default async function AppAuth(email:string, senha:string) {
    const auth = getAuth(app)
    signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
       const user = userCredential.user
       console.log(user.email)
    })
    .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message            
    });    
}