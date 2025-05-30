"use client";
import axios from "axios";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from './zustand/useAuthStore';

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {updateAuthName} = useAuthStore();

  const signUpFunc = async (event: any) => {
    console.log("signUpFunc called");
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/signup",
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.message === "Username already exists") {
        alert("Username already exists");
        updateAuthName(username);
        chatPage(event);
      } else {
        updateAuthName(username);
        chatPage(event);
      }
    } catch (error) {
      console.log("Error in signup function : ", (error as any)?.message);
    }
  };

  const loginFunc = async (event: any) => {
    console.log("LoginFunc called");
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      updateAuthName(username);
      chatPage(event);
    } catch (error) {
      console.log("Error in signup function : ", (error as any)?.message);
    }
  };

  const chatPage = (e: any) => {
    e.preventDefault();
    router.push("/chat");
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                required
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-x-1">
            <button
              type="submit"
              onClick={signUpFunc}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
            <button
              type="submit"
              onClick={loginFunc}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
