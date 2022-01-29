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
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagemEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (respostaLive) => {
      adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
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

    const subscription = escutaMensagemEmTempoReal((novaMensagem) => {
      setListaDeMensagens((valorAtualDaLista) => {
        return [novaMensagem, ...valorAtualDaLista];
      });
    });
    return () => {
      subscription.unsubscribe();
    };
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
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem]) //tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
      .then(({ data }) => {});

    setMensagem("");
  }

  function handleDeletaMensagem(mensagemAtual) {
    supabaseClient
      .from("mensagens")
      .delete()
      .match({ id: mensagemAtual.id })
      .then(({ data }) => {
        const listaDeMensagensFiltrada = listaDeMensagens.filter((mensagem) => {
          return mensagem.id != data[0].id;
        });
        setListaDeMensagens(listaDeMensagensFiltrada);
      });
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

          <MessageList
            mensagens={listaDeMensagens}
            handleDeletaMensagem={handleDeletaMensagem}
          />
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
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                // console.log(
                //   "[USANDO O COMPONENTE] Salva esse sticker no banco"
                // );
                handleNovaMensagem(`:sticker: ${sticker}`);
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

  const handleDeletaMensagem = props.handleDeletaMensagem;
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        // color: appConfig.theme.colors.neutrals["000"],
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
              wordBreak: "break-word",
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

              <Icon
                name={"FaTrash"}
                styleSheet={{
                  marginLeft: "5px",
                  width: "15px",
                  height: "15px",
                  color: appConfig.theme.colors.primary["950"],
                  hover: {
                    color: "white",
                  },
                  display: "inline-block",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  handleDeletaMensagem(mensagem);
                }}
              />
            </Box>
            {/* Condicional: {mensagem.texto.startsWith(":sticker:").toString()} */}
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image src={mensagem.texto.replace(":sticker:", "")} />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
