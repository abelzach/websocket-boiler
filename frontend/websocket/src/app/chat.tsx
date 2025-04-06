"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const Chat: React.FC = () => {
  const [msg, setMsg] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket: Socket = io("http://localhost:3000");
    setSocket(newSocket);

    // Clean up function
    return () => {
        newSocket.close();
    };
  }, []);

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket) {
        socket.emit("chat-msg", msg);
        setMsg("");
    }
  };

  return (
    <div>
      <form onSubmit={sendMsg}>
        <input
          type="text"
          value={msg}
          required
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message"
          className=" mb-2 p-4 text-2xl font-medium text-white dark:text-white"
        />
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
