function collectRandomObject() {
  const objects = [
    { id: 1, name: "Piedra", img: "src/assets/Piedra.png" },
    { id: 2, name: "Papel", img: "src/assets/Papel.png" },
    { id: 3, name: "Tijera", img: "src/assets/Tijera.png" },
  ];
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  return objects.find((object) => object.id === randomNumber);
}

export default collectRandomObject;
