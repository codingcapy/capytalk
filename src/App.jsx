import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
import ChatRoomPage from "./pages/ChatRoomPage";

const socket = io("http://localhost:3005");

function App() {
  return(
    <ChatRoomPage />
  )
}

export default App;
