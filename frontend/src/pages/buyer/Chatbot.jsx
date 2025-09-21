import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbarBuyer/Navbar";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your LOCALUP marketplace assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState(null); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(async () => {
      const response = await generateBotResponse(inputText);
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickReply = (text) => {
    setInputText(text);
    handleSendMessage();
  };

  const generateBotResponse = async (message) => {
    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/chat", {
        message,
        context,
      });
      setContext(res.data.context || null);
      return res.data.response || "I’m here to help! Could you rephrase?";
    } catch (error) {
      console.error("Chatbot error:", error.message);
      return "Oops! Something went wrong. Please try again later.";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-20 flex justify-center">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
          <div className="px-4 sm:px-6 py-3 bg-gray-900 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 ring-2 ring-gray-900"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    LOCALUP Assistant
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-400">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 sm:mb-5 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="flex-shrink-0 mr-2 sm:mr-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[70%] sm:max-w-xs md:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm ${
                    message.sender === "user"
                      ? "bg-gray-800 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {message.timestamp}
                  </p>
                  {message.text}
                </div>

                {message.sender === "user" && (
                  <div className="flex-shrink-0 ml-2 sm:ml-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex-shrink-0 mr-2 sm:mr-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-gray-200 rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "400ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="mt-4 sm:mt-6">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Try asking me about:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    "How do I list an item?",
                    "How to make a purchase?",
                    "Track my order",
                    "Payment info",
                    "Shipping details",
                    "Return policy",
                    "Contact support",
                  ].map((text, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(text)}
                      className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 flex items-center justify-center shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 sm:px-6 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center">
              <button className="p-1 sm:p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 mr-1 sm:mr-2 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent pr-10 sm:pr-12 placeholder-gray-500 text-xs sm:text-sm"
                />
                <button className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1 text-gray-600 hover:text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={inputText.trim() === ""}
                className="ml-1 sm:ml-3 p-2 sm:p-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
