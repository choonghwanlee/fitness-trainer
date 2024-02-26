import React from "react";
import Webcam from "react-webcam";

function CustomWebcam() {
  const webcamRef = React.useRef(null);
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

  return (
    <>
      <Webcam
        audio={false}
        height={512}
        width={512}
        mirrored={true}
        ref={webcamRef}
        screenshotFormat="image/png"
      />
      <button onClick={screenshot}>Capture photo</button>
      <button onClick={toggleRecord}>{buttonText}</button>
    </>
  );
}

export default CustomWebcam;
