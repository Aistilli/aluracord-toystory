import { Box, Button, Text, TextField, Image } from "@skynexui/components";

export default function ChatPage() {
  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage:
          "url(https://virtualbackgrounds.site/wp-content/uploads/2020/09/toy-story-andys-room-wallpaper.jpeg)",
        // "url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
      }}
    ></Box>
  );
}
