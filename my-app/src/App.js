// // 2. Import dependencies DONE
// // 3. Setup webcam and canvas DONE
// // 4. Define references to those DONE
// // 5. Load posenet DONE
// // 6. Detect function DONE
// // 7. Drawing utilities from tensorflow DONE
// // 8. Draw functions DONE

import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [intervalID, setIntervalID] = React.useState(null);
  const [buttonText, setButtonText] = React.useState("Start recording");

  const screenshot = React.useCallback(() => {
    // TOOD: send screenshot to pose detection pipeline
    const imageSrc = webcamRef.current.getScreenshot(); // png as string
    let timestamp = Date.now();
    console.log(timestamp, typeof imageSrc);
  }, [webcamRef]);

  let record = false;
  const toggleRecord = () => {
    record = !record;
    if (record && intervalID === null) {
      setIntervalID(setInterval(screenshot, 100));
      setButtonText("Stop recording");
      console.log("Started recording");
    } else {
      clearInterval(intervalID);
      setIntervalID(null);
      setButtonText("Start recording");
      console.log("Stopped recording");
    }
  };



  
  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5,
    });
    //
    setInterval(() => {
      detect(net);
    }, 300);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  runPosenet();


  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          audio={false}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            
          }}
        />

<div className="button-container">
  <button onClick={screenshot}>Capture photo</button>
  <button onClick={toggleRecord}>{buttonText}</button>
</div>

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;



// function CustomWebcam() {
//   const webcamRef = React.useRef(null);
//   const [intervalID, setIntervalID] = React.useState(null);
//   const [buttonText, setButtonText] = React.useState("Start recording");

//   const screenshot = React.useCallback(() => {
//     // TOOD: send screenshot to pose detection pipeline
//     const imageSrc = webcamRef.current.getScreenshot(); // png as string
//     let timestamp = Date.now();
//     console.log(timestamp, typeof imageSrc);
//   }, [webcamRef]);

//   let record = false;
//   const toggleRecord = () => {
//     record = !record;
//     if (record && intervalID === null) {
//       setIntervalID(setInterval(screenshot, 100));
//       setButtonText("Stop recording");
//       console.log("Started recording");
//     } else {
//       clearInterval(intervalID);
//       setIntervalID(null);
//       setButtonText("Start recording");
//       console.log("Stopped recording");
//     }
//   };

//   return (
//     <>
//       <Webcam
//         audio={false}
//         height={512}
//         width={512}
//         mirrored={true}
//         ref={webcamRef}
//         screenshotFormat="image/png"
//       />
//       <button onClick={screenshot}>Capture photo</button>
//       <button onClick={toggleRecord}>{buttonText}</button>
//     </>
//   );
// }

// export default CustomWebcam;