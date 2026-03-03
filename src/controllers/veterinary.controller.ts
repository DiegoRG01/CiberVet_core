import { v4 as uuidv4 } from "uuid";

let fakeVets = [
  {
    id: uuidv4(),
    nombre: "Dr. Pérez",
  },
];

export const getAllVeterinaries = async (req, res) => {
  res.json(fakeVets);
};