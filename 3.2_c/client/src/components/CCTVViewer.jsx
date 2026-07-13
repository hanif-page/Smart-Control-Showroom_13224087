import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`; // later, Change to Cloudflare Tunnel URL in production setup
const GO2RTC_URL = `${import.meta.env.VITE_CAMERA_URL}`; // Base URL for your go2rtc server

function CameraTile({ camera }) {
    // Construct the go2rtc URL. 
    // Adjust `camera.src` based on the exact property your API returns (e.g., cam_ipad)
    const streamId = camera.go2rtcStreamKey;
    const streamUrl = `${GO2RTC_URL}/stream.html?src=${streamId}`;

    return (
        <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700">
            {/* Camera Header */}
            <div className="p-2 bg-gray-800 text-gray-200 text-sm font-semibold truncate flex items-center justify-between">
                <span>{camera.name || `Camera ${camera.cameraID}`}</span>
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    LIVE
                </span>
            </div>
            
            {/* Video Player Container */}
            <div className="relative w-full aspect-video bg-black">
                <iframe
                    src={streamUrl}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={camera.name || "CCTV Stream"}
                />
            </div>
        </div>
    );
}

export default function CCTVViewer() {
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/cctv`)
        .then((res) => setCameras(res.data.cameras))
        .catch((err) => console.error('[CCTVViewer] Failed to load cameras:', err));
    }, []);

    if (cameras.length === 0) {
        return <p className="text-sm text-gray-400">No cameras registered!</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-4">
        {cameras.map((cam) => (
            <CameraTile key={cam.cameraID} camera={cam} />
        ))}
        </div>
    );
}