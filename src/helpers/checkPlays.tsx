function checkPlay(ia: string, user: string) {
  if (ia === user) {
    return "Empate";
  }
  if (
    (ia === "Papel" && user === "Piedra") ||
    (ia === "Piedra" && user === "Tijera") ||
    (ia === "Tijera" && user === "Papel")
  ) {
    return "IA gana"; // IA gana en este caso
  }
  return "Usuario gana";
}

export default checkPlay;
