"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../zustand/useAuthStore";
import { useUsersStore } from "../zustand/useUsersStore";
import axios from "axios";
import { UseChatRecieverStore } from "../zustand/useChatReceiver";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";

const Chat: React.FC = () => {
  const [msg, setMsg] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const { receiver, updateReceiverName } = UseChatRecieverStore();
  const { authName } = useAuthStore();
  const { users, updateUsers } = useUsersStore();
  const { chatMsgs, updateChatMsgs } = useChatMsgsStore();

  const getUserData = async () => {
    const res = await axios.get("http://localhost:5000/users", {
      withCredentials: true,
    });
    console.log(res.data);
    updateUsers(res.data);
  };

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket: Socket = io("http://localhost:3000", {
      query: {
        username: authName,
      },
    });
    setSocket(newSocket);

    newSocket.on(
      "chat-msg",
      (message: { text: string; sender: string; receiver: string }) => {
        console.log("Received message:", message);
        updateChatMsgs((prevMsgs) => [
          ...prevMsgs,
          { ...message, right: message.sender === authName },
        ]);
      }
    );

    getUserData();

    // Clean up function
    return () => {
      newSocket.close();
    };
  }, [authName, updateChatMsgs]);

  useEffect(() => {
    const getMsgs = async () => {
      const res = await axios.get("http://localhost:3000/msgs", {
        params: {
          sender: authName,
          receiver: receiver,
        },
        withCredentials: true,
      });
      if (res.data.length !== 0) {
        updateChatMsgs(() =>
          res.data.map((msg: any) => ({
            ...msg,
            right: msg.sender === authName,
          }))
        );
      } else {
        updateChatMsgs(() => []);
      }
    };
    if (receiver) {
      updateChatMsgs(() => []);
      getMsgs();
    }
  }, [receiver, authName, updateChatMsgs]);

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msgToBeSent = {
      text: msg,
      sender: authName,
      receiver: receiver,
    };

    if (socket) {
      socket.emit("chat-msg", msgToBeSent);
      updateChatMsgs((prevMsgs) => [
        ...prevMsgs,
        { ...msgToBeSent, right: true },
      ]);
      setMsg("");
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.off("chat-msg");
      }
    };
  }, [socket]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-1/3 bg-green-700 dark:bg-green-700 text-white overflow-y-auto">
        <div className="p-4 text-lg font-bold border-b border-green-500">
          Chats
        </div>
        <div className="space-y-2">
          {users.map((user: any, index: number) =>
            user?.username !== authName ? (
              <div
                key={index}
                onClick={() => updateReceiverName(user?.username)}
                className={`p-3 cursor-pointer hover:bg-green-500 dark:hover:bg-green-600 border-b border-green-500 ${
                  receiver === user?.username
                    ? "bg-green-500 dark:bg-green-600"
                    : ""
                }`}
              >
                {user?.username}
              </div>
            ) : null
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col h-screen bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center justify-center p-4 bg-green-600 text-white text-lg font-semibold shadow-md">
          {receiver ? (
            <p>
              Chatting with <span className="font-bold">{receiver}</span>
            </p>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {chatMsgs.map((message: any, index: any) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-white ${
                message.right
                  ? "bg-green-500 self-end ml-auto"
                  : "bg-gray-700 self-start mr-auto"
              } max-w-xs break-words`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={sendMsg}
          className="flex items-center p-4 bg-gray-200 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600"
        >
          <input
            type="text"
            value={msg}
            required
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a message"
            className="flex-grow p-3 rounded-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="ml-4 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
