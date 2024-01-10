import React, { useState,useRef,useEffect } from 'react';
import { baseUrl,user } from '../../utilits/constants';
import axios from 'axios';
import ContactListAPI from '../../api/ContactListApi';
import CreateChatRoomAPI from '../../api/CreateChatRoomAPI';
import GetChatMessages from '../../api/GetChatMessages';
import MessageSeenAPI from '../../api/MessageSeenAPI';


const MessageApp = () => {

  const [profiles, setProfiles] = useState([]);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  const chatMessagesContainerRef = useRef(null);
  const [hasJoinedChatroom, setHasJoinedChatroom] = useState(false);
  const t = localStorage.getItem('jwtToken')
  const [users,setusers ]= useState(null)
  // Sample list of people
  useEffect(() => {
    console.log("first useefect")
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        };

        const r = await axios.get(baseUrl+user,config)
        const result = await ContactListAPI();
        console.log(result,"resulttttt");
        setusers(r.data)
        setProfiles(result);
        console.log(result,"result");
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("mesage listener usefeect")
    let messageListener;
    if (ws) {
      messageListener = (event) => {
        const message = JSON.parse(event.data);
        // setMessages((prevMessages) => [...prevMessages, message]);
        // setTrigger(true);
        // Scroll to the last message
        chatMessagesContainerRef.current.scrollTop =
          chatMessagesContainerRef.current.scrollHeight;
      };
      ws.addEventListener("message", messageListener);
    }
    return () => {
      if (ws) {
        ws.removeEventListener("message", messageListener);
        ws.close()
      }
    };
  }, [ws]);

  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && inputMessage.trim() !== "") {
      console.log(inputMessage,"input messagee")
      ws.send(JSON.stringify({ message: inputMessage }));
      console.log("message send")
      setInputMessage("");
      setTrigger(false);

    }
  };


  const joinChatroom = async (userId) => {
    try {
      console.log("joined",userId);
      const data = await CreateChatRoomAPI(userId);
      const accessToken = localStorage.getItem("jwtToken");
      const websocketProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
        
      const wsUrl = `${websocketProtocol}//127.0.0.1:8000/ws/chat/api/${data.id}/?token=${accessToken}`;
      
      

      const newChatWs = new WebSocket(wsUrl);
      setTrigger(false);

      newChatWs.onopen = async () => {
        console.log("Chatroom WebSocket connection opened");
        const previousMessages = await GetChatMessages(data.id);
        setMessages(previousMessages);
        await MessageSeenAPI(userId);
        
        setProfiles((prevProfiles) => {
          return prevProfiles.map((profile) => {
            if (profile.id === data.id) {
              return { ...profile, unseen_message_count: 0 };
            }
            return profile;
          });
        });
        // Scroll to the last message
        chatMessagesContainerRef.current.scrollTop =
          chatMessagesContainerRef.current.scrollHeight;
      };

      newChatWs.onclose = () => {
        console.log("Chatroom WebSocket connection closed");
      };

      newChatWs.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);

        console.log(message);
      };

      setWs(newChatWs);
       setHasJoinedChatroom(true); 
    } catch (error) {
      console.error(error);
      
    }
    setSelectedProfile(userId);
  };


  const [selectedPerson, setSelectedPerson] = useState(null);

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    joinChatroom(person.id);
      setTrigger(true);
  
      
   
  };

  return (
<div className="flex items-center justify-center h-screen ">
  <div className="flex ml-80 mr-80 border border-gray-300 rounded-md shadow-md">
    {/* Left side - List of people */}
    <div className="flex-2 h-full border-r border-gray-300 p-4 items-center justify-between mb-4">
      <h2 className="text-xl font-bold mb-4">People</h2>
      <ul>
        {profiles.map((person) => (
          <li
            key={person.id}
            onClick={() => handlePersonClick(person)}
            className="cursor-pointer hover:bg-gray-100 py-2"
          >
            {person.username}
          </li>
        ))}
      </ul>
    </div>

    {/* Right side - Message box */}
    <div className="flex-0 p-4">
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4">Chat Box</h2>
        {selectedPerson ? (
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-2">Chatting with {selectedPerson.username}</h3>

            {/* Your message components or chat history can go here */}
            <div className="flex-1 overflow-y-auto">
              {/* Placeholder for chat history */}
              <div className="mb-2">
                <span className="font-semibold">{selectedPerson.name}:</span> Hi there!
              </div>
              {/* Add more message components as needed */}
            </div>

            {/* Text field and send button */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="border rounded-md p-2 flex-1"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a person to start chatting.</p>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default MessageApp;
