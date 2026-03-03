import { v4 as uuidv4 } from "uuid";

let fakePatients = [
  {
    id: uuidv4(),
    nombre: "Firulais",
    especie: "Perro",
    raza: "Labrador",
  },
];

export const getAllPatients = async (req, res) => {
  res.json(fakePatients);
};

export const createPatient = async (req, res) => {
  const newPatient = {
    id: uuidv4(),
    ...req.body,
  };

  fakePatients.push(newPatient);
  res.status(201).json(newPatient);
};