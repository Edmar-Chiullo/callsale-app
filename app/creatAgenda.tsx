// Tipagem para uma tarefa
interface Tarefa {
    descricao: string;
    dataHora: Date;
  }
  
  // Função para adicionar tarefas à lista
  const adicionarTarefa = (descricao: string, dataHora: string, lista: Tarefa[]): void => {
    lista.push({ descricao, dataHora: new Date(dataHora) });
  };
  
  // Função para ordenar as tarefas pela data e hora
  const ordenarTarefas = (lista: Tarefa[]): void => {
    lista.sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());
  };
  
  // Função para exibir as tarefas ordenadas (exemplo: console.log)
  const exibirAgenda = (lista: Tarefa[]): void => {
    console.log("Agenda Ordenada:");
    lista.forEach((tarefa) => {
      console.log(`${tarefa.descricao} - ${tarefa.dataHora.toLocaleString()}`);
    });
  };
  
  // Exemplo de uso com Next.js (SSR ou API Handler)
  const agenda: Tarefa[] = [];
  
  // Adicionando tarefas
  adicionarTarefa("Tarefa 1", "2024-12-11T12:30", agenda);
  adicionarTarefa("Tarefa 2", "2024-12-11T11:00", agenda);
  adicionarTarefa("Tarefa 3", "2024-12-10T10:00", agenda);
  
  // Ordenando tarefas
  ordenarTarefas(agenda);
  
  // Exibindo tarefas ordenadas
  exibirAgenda(agenda);
  
  export default function Home() {
    return (
      <div>
        <h1>Agenda Ordenada</h1>
        <ul>
          {agenda.map((tarefa, index) => (
            <li key={index}>
              {tarefa.descricao} - {tarefa.dataHora.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  