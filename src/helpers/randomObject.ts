function collectRandomObject() {
  const objects = [
    { id: 1, name: "Piedra", img: "src/assets/piedra-icono.png" },
    { id: 2, name: "Papel", img: "src/assets/papel-icono.png" },
    { id: 3, name: "Tijera", img: "src/assets/tijera-icono.png" },
  ];
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  return objects.find((object) => object.id === randomNumber);
}

export default collectRandomObject;
