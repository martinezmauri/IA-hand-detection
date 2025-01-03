import React, { useState, DragEvent, useEffect } from "react";
import styles from "./Slide.module.css";

interface Option {
  id: string;
  src: string;
  alt: string;
}

const options: Option[] = [
  { id: "piedra", src: "src/assets/Piedra.png", alt: "Piedra" },
  { id: "papel", src: "src/assets/Papel.png", alt: "Papel" },
  { id: "tijera", src: "src/assets/Tijera.png", alt: "Tijera" },
];

export const Slide: React.FC = () => {
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({
    piedra: { x: 100, y: 0 },
    papel: { x: 200, y: 0 },
    tijera: { x: 270, y: -5 },
  });
  const [draggedImage, setDraggedImage] = useState<Option | null>(null); // Estado para la imagen seleccionada

  // Manejar el inicio del arrastre
  const handleDragStart = (
    event: DragEvent<HTMLImageElement>,
    image: Option
  ): void => {
    setDraggedImage(image); // Guardar la imagen arrastrada
    event.dataTransfer.setData(
      "text/plain",
      `${event.clientX},${event.clientY}`
    );
  };

  // Permitir que el área reciba el arrastre
  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  // Manejar el soltar la imagen en el área
  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const [startX, startY] = event.dataTransfer.getData("text").split(",");
    const deltaX = event.clientX - parseInt(startX, 10);
    const deltaY = event.clientY - parseInt(startY, 10);

    if (draggedImage) {
      setPositions((prevPositions) => ({
        ...prevPositions,
        [draggedImage.id]: {
          x: prevPositions[draggedImage.id].x + deltaX,
          y: prevPositions[draggedImage.id].y + deltaY,
        },
      }));
    }
  };

  return (
    <div
      className={styles.slideContainer}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Renderizar las tres imágenes con posiciones distintas */}
      {options.map((image) => (
        <img
          key={image.id}
          src={image.src}
          alt={image.alt}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, image)}
          style={{
            position: "absolute",
            left: `${positions[image.id].x}px`,
            top: `${positions[image.id].y}px`,
            cursor: "grab",
          }}
        />
      ))}
    </div>
  );
};
