
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: app for CapyTalk client
 */

import { RouterProvider } from 'react-router-dom';
import { Router } from './router';
import io from "socket.io-client";

const socket = io("http://localhost:3333");

function App() {

  const router = Router();

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
