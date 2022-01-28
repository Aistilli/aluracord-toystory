import {
  Box,
  Button,
  Text,
  TextField,
  Image,
  Icon,
} from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyMTc1NiwiZXhwIjoxOTU4ODk3NzU2fQ.61lt15vaatLpTCFETDjRP32w_5D1Qbfjy2HLkTDORkE";
const SUPABASE_URL = "https://btcixiwruciyeiivtfip.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });
  }, []);

  /*
// Usuário
- usuário digita no campo textarea
- aperta enter para enviar
- tem que adicionar o texto na listagem

// Dev
- [] campo criado
- [] vamos usar o onchange, usa o useState (ter if para caso seja enter pra limpar a variável)
- [] Lista de mensagens
*/
  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de: "AIstilli",
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem]) //tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
      .then(({ data }) => {
        setListaDeMensagens([data[0], ...listaDeMensagens]);
      });

    setMensagem("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url(https://virtualbackgrounds.site/wp-content/uploads/2020/09/toy-story-andys-room-wallpaper.jpeg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.primary[941],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.primary[942],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          {/* <MessageList mensagens={[]} /> */}

          <MessageList mensagens={listaDeMensagens} />
          {/* {listaDeMensagens.map((mensagemAtual) => {
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.de}: {mensagemAtual.texto}
              </li>
            );
          })} */}

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.primary[960],
                marginRight: "12px",
                color: appConfig.theme.colors.primary[945],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          variant="heading5"
          styleSheet={{
            color: appConfig.theme.colors.primary["930"],
          }}
        >
          Chat
        </Text>
        <Button
          variant="primary"
          colorVariant="warning"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  console.log("MessageList", props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              color: appConfig.theme.colors.primary[930],
              hover: {
                backgroundColor: appConfig.theme.colors.primary[940],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text
                tag="strong"
                styleSheet={{
                  color: appConfig.theme.colors.primary[930],
                }}
              >
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.primary[930],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>

              {/* <Icon
                name={"FaTrash"}
                styleSheet={{
                  marginLeft: "15px",
                  width: "15px",
                  height: "15px",
                  color: appConfig.theme.colors.primary["950"],
                  hover: {
                    color: "white",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={(event, id) => {
                  event.preventDefault();
                  const apagaElementoDaLista =
                    props.mensagens.listaDeMensagens.filter(
                      () => mensagem.id !== id
                    );
                  setListaDeMensagens(apagaElementoDaLista);
                }}
              /> */}
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
