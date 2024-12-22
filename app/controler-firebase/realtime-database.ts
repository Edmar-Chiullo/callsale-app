import { getDatabase, connectDatabaseEmulator, set, ref, onValue } from "firebase/database";
import { app } from "./firebasekey/firebasekey";

// createde instance of db realtime-databse
const database = getDatabase(app);

if (process.env.NODE_ENV === "development") {
  connectDatabaseEmulator(database, "127.0.0.1", 9000); // Porta padrão para Realtime Database
}

// Gravar dados em um lugar especifico usando o método set().
// O método set() (altera todos os dados abaixo na árvore como uma atualizção) 
// Usar set() substitui os dados no local especificado, incluindo quaisquer nós filhos.
export function writeUserData(userId:number, name:string, email:string) {
    set(ref(database, 'users/' + userId), {
      username: name,
      email: email,
    });
  }
// OnValue executa um ouvinte que retorna os valores apartetir da ramificassão no banco de dados.
// Uma vez executado o onValue fica observando e qualquer alteração executada apartir do ponto implantado "users/" retorna a atualização.
// Caso não exista dados onValue retorna false para o método 'exists()' e null quando você chamar 'val()'  
export async function listenerData() {
    let data
    const user = ref(database, 'users/');
    onValue(user, (snapshot) => {
      data = snapshot.val();    
    })

    return data 
}

