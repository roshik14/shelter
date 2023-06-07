const REQUEST = new Request("../materials/pets.json");

export const getCards = async () => {
  const result = await fetch(REQUEST);
  return result.json();
}; 
