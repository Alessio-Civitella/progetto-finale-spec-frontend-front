import type { Carne } from "../types";

const FAV_KEY = "favourites";

export function getFavourites(): Carne[] {
  const saved = localStorage.getItem(FAV_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function isFavourite(id: string): boolean {
  return getFavourites().some(c => c.id === id);
}

export function addFavourite(carne: Carne): void {
  const favs = getFavourites();
  if (!favs.some(c => c.id === carne.id)) {
    favs.push(carne);
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }
}

export function removeFavourite(id: string): void {
  let favs = getFavourites();
  favs = favs.filter(c => c.id !== id);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}
