import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

import { useNavigate ,Link } from 'react-router-dom';
function VideoCallRoom() {
  const { roomId } = useParams();

  const myMeeeting = async (element) => {
    const appID = 717379121;
    const serverSecret = "e36785affd1ec4871b332e709cb05f4b";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Manzil"
    );

    const zc=ZegoUIKitPrebuilt.create(kitToken)
    zc.joinRoom({
        container:element,
        sharedLinks:[{
            name:'Copy Link',
            url: `http://localhost:3000/provider-videocall/${roomId}`

        }],
        scenario:{
            mode:ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton:true
    })
  };

  return <div className="d-flex flex-column align-items-center justify-content-center">
    <div ref={myMeeeting} className="mt-24 "/>

    <a href="/homepage" className="home mt-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
       Back To Home
      </a>
  </div>;
}

export default VideoCallRoom;