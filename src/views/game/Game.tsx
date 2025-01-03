import React, { useEffect, useRef, useState } from "react";
import { checkPaper, checkScissors, checkFist } from "../../helpers/checkHands";
import "@tensorflow/tfjs"; // Importar la librería TensorFlow.js
import * as handpose from "@tensorflow-models/handpose";
import styles from "./Game.module.css";

const Game = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await handpose.load(); // Cargar el modelo HandPose
      setModel(loadedModel); // Guardar el modelo en el estado
    };

    loadModel();
  }, []);

  const setupCamera = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    }
  };

  useEffect(() => {
    setupCamera();
  }, []);

  const detectHands = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return; // Verifica si el modelo está cargado

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!ctx) {
      console.error("No se pudo obtener el contexto del canvas.");
      return;
    }

    // Estimar las manos en el video
    const predictions = await model.estimateHands(video);

    // Limpiar y redibujar el video en el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
      predictions.forEach((hand) => {
        const { landmarks } = hand;

        if (landmarks) {
          landmarks.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          });

          const isFistClosed = checkFist(landmarks);
          const isScissors = checkScissors(landmarks);
          const isPaper = checkPaper(landmarks);
          if (isPaper) {
            setResult("Papel");
            console.log(result);
          }
          if (isScissors) {
            setResult("Tijera");
            console.log("¡Tijera detectada!");
          }
          if (isFistClosed) {
            setResult("Piedra");
            console.log("¡Puño cerrado detectado!");
          }
        }
      });
    }

    // Llamar nuevamente para continuar con la detección de manos
    requestAnimationFrame(detectHands);
  };

  useEffect(() => {
    if (model) {
      detectHands();
    }
  }, [model]); // Ejecutar solo cuando el modelo esté cargado

  return (
    <div className={styles.hero}>
      <div className={styles.containerIA}>
        <h1>IA</h1>
        <video
          ref={videoRef}
          id="video"
          autoPlay
          playsInline
          style={{ position: "absolute", width: "0", height: "0" }}
        ></video>
        <div className={styles.containerCameraIA}>
          <img src="src/assets/Papel.png" alt="" />
        </div>
        <h1>Resultado: Papel</h1>
      </div>
      <img src="src/assets/vs.png" alt="" className={styles.imgVS} />
      <div className={styles.containerUser}>
        <div>
          <h1>Usuario 1</h1>
        </div>
        <div className={styles.containerCamera}>
          <canvas
            ref={canvasRef}
            id="output"
            className={styles.cameraUser}
          ></canvas>
        </div>
        <h1>Capturando: {result}</h1>
      </div>
    </div>
  );
};

export default Game;
