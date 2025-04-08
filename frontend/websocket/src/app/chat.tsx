"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const Chat: React.FC = () => {
    const [msg, setMsg] = useState<string>("");
    const [msgs, setMsgs] = useState<any>([]);
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
        setMsgs([...msgs, msg]);
        setMsg("");
    }
  };
useEffect(() => {
    if (socket) {
        socket.on("chat-msg", (message: string) => {
            setMsgs((prevMsgs: string[]) => [...prevMsgs, message]);
        });
    }
    return () => {
        if (socket) {
            socket.off("chat-msg");
        }
    };
}, [socket]);
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 w-2/3">
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {msgs.map((message: string, index: React.Key) => (
                <div
                    key={index}
                    className={`p-3 rounded-lg text-white ${
                        (index as number) % 2 === 0
                            ? "bg-blue-500 self-start"
                            : "bg-gray-700 self-end"
                    } max-w-xs break-words`}
                >
                    {message}
                </div>
            ))}
        </div>
        <form
            onSubmit={sendMsg}
            className="flex items-center p-4 bg-gray-200 dark:bg-gray-800"
        >
            <input
                type="text"
                value={msg}
                required
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="ml-4 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Send
            </button>
        </form>
    </div>
  );
};

export default Chat;
