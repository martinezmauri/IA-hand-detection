import React, { useEffect, useRef, useState } from "react";
import { checkPaper, checkScissors, checkFist } from "../../helpers/checkHands";
import * as handpose from "@tensorflow-models/handpose";
import styles from "./Game.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import collectRandomObject from "../../helpers/randomObject";
import checkPlay from "../../helpers/checkPlays";
import * as motion from "motion/react-client";

const Game = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [result, setResult] = useState<string>("");
  const [ganador, setGanador] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [handIA, setHandIa] = useState(collectRandomObject());
  const [turn, setTurn] = useState(1);
  const [isDetecting, setIsDetecting] = useState(true);

  let { nameUser } = location.state;
  if (nameUser === "") {
    nameUser = "Invitado";
  }

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await handpose.load();
      setModel(loadedModel);
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

  const predictionCounts: Record<"Piedra" | "Papel" | "Tijera", number> = {
    Piedra: 0,
    Papel: 0,
    Tijera: 0,
  };

  const nextTurn = () => {
    setTurn((prevTurn) => prevTurn + 1);
    setHandIa(collectRandomObject());
    setGanador(""); // Reinicia el ganador para el nuevo turno
    setResult(""); // Reinicia el resultado del usuario
    setIsDetecting(true);
  };

  const detectHands = async () => {
    if (
      !model ||
      !videoRef.current ||
      !canvasRef.current ||
      !isDetecting ||
      ganador
    )
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!ctx) {
      console.error("No se pudo obtener el contexto del canvas.");
      return;
    }
    const predictionLimit = 10;
    const predictions = await model.estimateHands(video);
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
          if (isPaper) predictionCounts.Papel++;
          if (isScissors) predictionCounts.Tijera++;
          if (isFistClosed) predictionCounts.Piedra++;

          const totalPredictions =
            predictionCounts.Piedra +
            predictionCounts.Papel +
            predictionCounts.Tijera;

          if (totalPredictions >= predictionLimit) {
            const mostFrequentPrediction = (
              Object.keys(predictionCounts) as Array<
                keyof typeof predictionCounts
              >
            ).reduce((a, b) =>
              predictionCounts[a] > predictionCounts[b] ? a : b
            );
            if (!result) {
              setResult(mostFrequentPrediction);
              console.log(mostFrequentPrediction);
            }
            setResult(mostFrequentPrediction);

            predictionCounts.Piedra = 0;
            predictionCounts.Papel = 0;
            predictionCounts.Tijera = 0;

            if (!handIA?.name) {
              return;
            }
            const ganador = checkPlay(handIA?.name, mostFrequentPrediction);
            setGanador(ganador);
            console.log(ganador);

            setIsDetecting(false);
          }
        }
      });
    }

    requestAnimationFrame(detectHands);
  };

  useEffect(() => {
    if (model && isDetecting) {
      detectHands();
    }
  }, [model, isDetecting]);

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div>
      <div className={styles.header}>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          className={styles.buttonBack}
          onClick={handleRedirect}
        >
          <img src="src/assets/back.png" alt="" />
        </motion.button>
      </div>
      <section className={styles.hero}>
        <div className={styles.containerIA}>
          <h1>IA</h1>
          <video
            ref={videoRef}
            id="video"
            autoPlay
            playsInline
            style={{ position: "absolute", width: "0", height: "0" }}
          ></video>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
            className={styles.containerCameraIA}
          >
            <img src={handIA?.img} alt="" />
            <h2> {handIA?.name}</h2>
          </motion.div>
          {ganador && (
            <button className={styles.nextTurnButton} onClick={nextTurn}>
              Cambiar
            </button>
          )}
        </div>

        <motion.img
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
          src="src/assets/vs-icono.png"
          alt=""
          className={styles.imgVS}
        />
        <div className={styles.containerUser}>
          <h1>{nameUser}</h1>
          <div className={styles.containerCamera}>
            <canvas
              ref={canvasRef}
              id="output"
              className={styles.cameraUser}
            ></canvas>
          </div>
          <div className={styles.electionUser}>
            <h1>Has elegido: {result}</h1>
          </div>
        </div>
      </section>
      <section className={styles.winContainer}>
        <h1>Ganador: {ganador}</h1>
      </section>
    </div>
  );
};

export default Game;
