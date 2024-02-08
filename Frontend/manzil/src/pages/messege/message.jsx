import React, { useState,useRef,useEffect } from 'react';
import { baseUrl,user } from '../../utilits/constants';
import axios from 'axios';
import ContactListAPI from '../../api/ContactListApi';
import CreateChatRoomAPI from '../../api/CreateChatRoomAPI';
import GetChatMessages from '../../api/GetChatMessages';
import MessageSeenAPI from '../../api/MessageSeenAPI';
import { AiOutlineSend } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
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
  const navigate=useNavigate()

  console.log(profiles, "my profiles");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        };

        const r = await axios.get(baseUrl+user,config)
        setusers(r.data)
        const result = await ContactListAPI();
        setProfiles(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [ trigger]);

  useEffect(() => {
    let messageListener;
    if (ws) {
      console.log("ws is here");
      messageListener = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log(message,"lkju");
        setTrigger(true);
        // Scroll to the last message
        chatMessagesContainerRef.current.scrollTop =
          chatMessagesContainerRef.current.scrollHeight;
      };
      ws.addEventListener("message", messageListener);
    }
    console.log("kkkk");
    return () => {
      if (ws) {
        ws.removeEventListener("message", messageListener);
      }
    };
  }, [ws, trigger]);

  const handleSendMessage = () => {
    if (ws && inputMessage.trim() !== "") {
      ws.send(JSON.stringify({ message: inputMessage }));
      setInputMessage("");
      setTrigger(false);
    }
  };

  const joinChatroom = async (userId) => {
    try {
      const data = await CreateChatRoomAPI(userId);
      const room_id=data.id
      const accessToken = t;
      const websocketProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${room_id}/?token=${accessToken}`;

      console.log(wsUrl);
   
      

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
        console.log(message);
      };

      setWs(newChatWs);
       setHasJoinedChatroom(true); 
    } catch (error) {
      console.error(error);
    }
    setSelectedProfile(userId);
  };

  // if (!isAuthenticated  && user === null) {
  //   return <Navigate to="/" />;
  // }

  console.log(messages,"mess");

   const createRoom = async () => {
    const { value: roomId } = await Swal.fire({
      title: "Create a Room",
      text: "Enter a Room ID",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Create",
    });
    if (roomId) {
      navigate(`/provider-videocall/${roomId}`);
      console.log('roomid:', roomId);
    }
    
  }; 

  return (
    <div className='flex items-center justify-between '>
     {selectedProfile && (
    <div className=" bg-gray-200 p-4 rounded-lg mb-4 shadow-md">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Chatting with {selectedProfile.username}
        </h2>
      </div>
      
    </div>
  )}
      <div className=" ml-96 flex w-4/6 pt-36 ">
 
        <div className="w-3/5 p-4 ">
        <button className="bg-red-400 text-white px-2 py-2 hover:bg-red-600 focus:outline-none mt-2 ml-3 rounded-md" onClick={() => createRoom()}><FontAwesomeIcon icon={faVideo}/>
        </button>
          {/* Chat Messages Container */}
          <div
        
            className="bg-teal-100 p-4 rounded-lg shadow-xl h-5/6 overflow-y-auto "
            ref={chatMessagesContainerRef}
          >
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mt-4 ${
                  message.sender_email === user.email
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {message.sender_email !== user.email && (
                    <div className="h-10 w-10 rounded-full bg-gray-300">
                      <img
                        src={`${baseUrl}${message.sender_profile_pic}`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  
                  )}
                  <div>{message.sender_name}</div>
                  <div className="max-w-xs p-3 rounded-lg shadow-xl bg-blue-200">
                    <p className="text-sm">{message.message || message.content}</p>
                    <span className="text-xs text-gray-500 leading-none">
                      {message.created} ago
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Input Field for Sending Messages */}
          {hasJoinedChatroom && (
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-auto p-2 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Type your message..."
                />
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white shadow-md transition duration-150 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="button"
                  onClick={handleSendMessage}
                >
                  <AiOutlineSend />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-2/5 p-4">
          {/* List of Chat Profiles */}
          <div className="bg-white p-4 rounded-lg shadow-xl">
            {profiles
              ? profiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => {
                      joinChatroom(profile.id);
                      setTrigger(true);
                    }}
                    className={`flex items-center p-3 cursor-pointer ${
                      selectedProfile === profile.id ? "bg-purple-100" : "bg-gray-100"
                    } rounded-lg mb-4 shadow-md`}
                  >
                    <div className="h-14 w-14 rounded-full bg-gray-300">
                      <img
                        src={`${baseUrl}${profile.profile_pic}`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow ml-3">
                      <h5 className="text-sm font-medium leading-tight text-gray-800">
                        {profile.username}
                      </h5>
                    </div>
                    {profile.unseen_message_count > 0 && (
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full">
                          {profile.unseen_message_count}
                        </div>
                      )}
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};


export default MessageApp;
