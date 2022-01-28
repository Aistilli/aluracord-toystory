import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";

function Title(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>
        {`
          ${Tag} {
            color: ${appConfig.theme.colors.primary["930"]};
            font-size: 24px;
            font-weight: 900;
          }
        `}
      </style>
    </>
  );
}

// function HomePage() {
//   return (
//     <div>
//       <GlobalStyle />

//       <Title tag="h2">Boas vindas de volta!</Title>
//       <h2>Discord - Alura Matrix</h2>
//     </div>
//   );
// }

// export default HomePage;

export default function PaginaInicial() {
  const [username, setUsername] = React.useState("");
  const roteamento = useRouter();
  const [githubUser, setGithubUser] = React.useState("");

  const handleUserError = (object) => {
    object.src = "https://cdn9.pngable.com/t/12/13/21/2Wr32G3nJ6/toy-story.jpg";
  };

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then((resposta) => {
        if (!resposta.ok) {
          throw Error("Não foi possível fazer a requisição");
        }
        return resposta.json();
      })
      .then((data) => {
        setGithubUser(data);
      })
      .catch((erro) => {
        console.log(erro.message);
      });
  }, [username]);

  return (
    <>
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
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.primary["940"],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (event) {
              event.preventDefault();
              if (username === "") {
                return;
              }
              // console.log("Clicou!");
              roteamento.push("/chat");
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text
              variant="body3"
              styleSheet={{
                fontWeight: 700,
                fontSize: 3,
                marginBottom: "32px",
                color: appConfig.theme.colors.primary["930"],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              onChange={function (event) {
                // Onde está o valor?
                const valor = event.target.value;
                //Trocar o valor da variável
                // através do React e avise quem precisa
                setUsername(valor);
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.primary["945"],
                  mainColor: appConfig.theme.colors.primary["980"],
                  mainColorHighlight: appConfig.theme.colors.primary["945"],
                  backgroundColor: appConfig.theme.colors.primary["960"],
                },
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.primary["930"],
                mainColor: appConfig.theme.colors.primary["950"],
                mainColorLight: appConfig.theme.colors.primary["930"],
                mainColorStrong: appConfig.theme.colors.primary["970"],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.primary["980"],
              border: "2px solid",
              borderColor: appConfig.theme.colors.primary["945"],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              onError={({ currentTarget }) => handleUserError(currentTarget)}
              src={`https://github.com/${username}.png`}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.primary["945"],
                backgroundColor: appConfig.theme.colors.primary["960"],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <li>
                <Text
                  variant="body4"
                  styleSheet={{ color: appConfig.theme.colors.primary["945"] }}
                >
                  {" "}
                  {githubUser.name}{" "}
                </Text>
              </li>
              <li>
                <Text
                  variant="body4"
                  styleSheet={{ color: appConfig.theme.colors.primary["945"] }}
                >
                  {" "}
                  {githubUser.location}{" "}
                </Text>
              </li>
              <li>
                <a
                  variant="body4"
                  style={{
                    border: "solid 1px grey",
                    padding: "0px 5px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: appConfig.theme.colors.primary["945"],
                    backgroundColor: appConfig.theme.colors.primary["960"],
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                  href={githubUser.html_url}
                >
                  {" "}
                  Go to Git
                </a>
              </li>
            </ul>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
