import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import Banner from "./componentes/Banner";
import Formulario from "./componentes/Formulario";
import Rodape from "./componentes/Rodape";
import Time from "./componentes/Time";
import { BiHide } from "react-icons/bi";
import { MdPreview } from "react-icons/md";
import "./App.css";

function App() {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7070/times")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setTimes(dados);
      });
  }, []);

  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/colaboradores")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setColaboradores(dados);
      });
  }, []);

  function deletarColaborador(id) {
    setColaboradores(
      colaboradores.filter((colaborador) => colaborador.id !== id)
    );
  }

  function mudarCorDoTime(cor, id) {
    setTimes(
      times.map((time) => {
        if (time.id === id) {
          time.cor = cor;
        }
        return time;
      })
    );
  }

  function cadastrarTime(novoTime) {
    setTimes([...times, { ...novoTime, id: uuidv4() }]);
  }

  function resolverFavorito(id) {
    setColaboradores(
      colaboradores.map((colaborador) => {
        if (colaborador.id === id) {
          colaborador.favorito = !colaborador.favorito;
        }
        return colaborador;
      })
    );
  }

  const [mostraFormulario, setMostraFormulario] = useState(
    <Formulario
      cadastrarTime={cadastrarTime}
      times={times.map((time) => time.nome)}
      aoCadastrar={(colaborador) =>
        setColaboradores([...colaboradores, colaborador])
      }
    />
  );

  function ocultarFormulario() {
    setMostraFormulario("");
  }

  function mostrarFormulario() {
    setMostraFormulario(
      <Formulario
        cadastrarTime={cadastrarTime}
        times={times.map((time) => time.nome)}
        aoCadastrar={(colaborador) =>
          setColaboradores([...colaboradores, colaborador])
        }
      />
    );
  }

  return (
    <div>
      <Banner />
      {mostraFormulario}
      <BiHide
        size={45}
        className="ocultar"
        onClick={() => ocultarFormulario()}
      />
      <MdPreview
        size={45}
        className="mostrar"
        onClick={() => mostrarFormulario()}
      />
      <section className="times">
        <h1>Minha organização</h1>
        {times.map((time, indice) => (
          <Time
            aoFavoritar={resolverFavorito}
            mudarCor={mudarCorDoTime}
            key={indice}
            time={time}
            colaboradores={colaboradores.filter(
              (colaborador) => colaborador.time === time.nome
            )}
            aoDeletar={deletarColaborador}
          />
        ))}
      </section>
      <Rodape />
    </div>
  );
}

export default App;
