const mongoose = require('mongoose');
const Camera = require('./models/cameraModel');

async function seedCameras() {
  await mongoose.connect(`${process.env.MONGO_URI}`);

  await Camera.deleteMany({});
  await Camera.insertMany([
    {
      cameraID: "cam1",
      name: "Room (iPad Mock)",
      vendor: "iPad RTSP App",
      rtspURL: "rtsp://192.168.18.180/stream", 
      go2rtcStreamKey: "cam_ipad"
    },
    {
      cameraID: "cam2",
      name: "Room (iPhone Mock)",
      vendor: "iPhone RTSP App",
      rtspURL: "rtsp://192.168.18.28/stream", 
      go2rtcStreamKey: "cam_iphone"
    },
    // {
    //   cameraID: "cam2",
    //   name: "Room (iPad Mock)",
    //   vendor: "iPad RTSP App",
    //   rtspURL: "rtsp://192.168.18.180/stream", 
    //   go2rtcStreamKey: "cam_ipad"
    // },
    {
      cameraID: "cam3",
      name: "Room (iPad Mock)",
      vendor: "iPad RTSP App",
      rtspURL: "rtsp://192.168.18.180/stream", 
      go2rtcStreamKey: "cam_ipad"
    },
    {
      cameraID: "cam4",
      name: "Room (iPad Mock)",
      vendor: "iPad RTSP App",
      rtspURL: "rtsp://192.168.18.180/stream", 
      go2rtcStreamKey: "cam_ipad"
    }
  ]);

  console.log('[Seed] Dummy camera registry inserted!');
  process.exit(0);
}

seedCameras();