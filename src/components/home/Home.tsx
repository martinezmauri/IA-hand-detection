import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import React, { useState } from "react";

export const Home: React.FC = () => {
  const [nameUser, setNameUser] = useState({ name: "" });
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/game", { state: { nameUser: nameUser.name } });
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNameUser({ name: value });
  };

  return (
    <div>
      <section className={styles.title}>
        <h1>
          Piedra <br /> Papel <br /> o <br /> Tijera
        </h1>
        <input
          type="text"
          placeholder="Nombre..."
          className={styles.inputUser}
          value={nameUser.name}
          onChange={(event) => handleChangeName(event)}
        />
        <button className={styles.buttonPlay} onClick={handleRedirect}>
          Jugar!
        </button>
      </section>
    </div>
  );
};
