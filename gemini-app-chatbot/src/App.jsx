import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationContext, setConversationContext] = useState([]);

  const surpriseOptions = [
    "Which game won the latest game awards?",
    "What is pineapple on pizza?",
    "How do you make beef pizza?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: conversationContext, // Send conversation context to API
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();

      console.log(data);

      // Update chat history for display
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        { role: "user", parts: [value] },
        { role: "model", parts: [data] },
      ]);

      // Update context for API
      setConversationContext((oldContext) => [
        ...oldContext,
        { role: "user", parts: [value] },
        { role: "model", parts: [data] },
      ]);

      setValue(""); // Reset input
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later (:");
    }
  };

  const clearChat = () => {
    setConversationContext([]); // Reset conversation context
    setError(""); // Clear any error message
  };

  return (
    <>
      <div className="app">
        <p>
          What do you want to know?
          <button className="surprise" onClick={surprise}>
            Surprise me!
          </button>
        </p>
        <div className="input-container">
          <input
            type="text"
            value={value}
            placeholder="When is Christmas?"
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={getResponse}>Ask Me</button>
          <button onClick={clearChat}>Clear Context</button>
        </div>
        {error && <p>Error: {error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, index) => (
            <div key={index}>
              <p className="answer">
                <strong>{chatItem.role}:</strong> {chatItem.parts}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
