import { useNavigate } from "react-router-dom";
import { Slide } from "../itemSlide/Slide";
import styles from "./Home.module.css";
import React from "react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/game");
  };
  return (
    <div>
      <section className={styles.title}>
        <img src="/src/assets/PiedraPapeloTijera.png" alt="" />
        <input
          type="text"
          placeholder="Nombre..."
          className={styles.inputUser}
        />
        <button className={styles.buttonPlay} onClick={handleRedirect}>
          Jugar!
        </button>
      </section>
    </div>
  );
};
