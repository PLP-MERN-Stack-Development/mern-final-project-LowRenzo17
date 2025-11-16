import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, MessageSquare } from 'lucide-react';

interface VideoConsultationProps {
  appointmentId: string;
  roomId: string;
  isDoctor: boolean;
  patientName?: string;
  doctorName?: string;
  onEndCall: () => void;
}

export default function VideoConsultation({
  appointmentId,
  roomId,
  isDoctor,
  patientName,
  doctorName,
  onEndCall,
}: VideoConsultationProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initializeMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera or microphone. Please check your permissions.');
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
          <p className="text-sm">
            {isDoctor ? `Patient: ${patientName}` : `Dr. ${doctorName}`}
          </p>
        </div>

        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {showChat && (
          <div className="absolute right-4 bottom-24 w-96 h-96 bg-white rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <p className="text-sm text-gray-600 text-center">Chat functionality coming soon</p>
            </div>
            <div className="p-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 py-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center gap-4">
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          <button
            onClick={toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition"
            title="End call"
          >
            <Phone className="w-6 h-6 rotate-135" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition"
            title="Toggle chat"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
