/* Vérifie que le titre contient AU MOINS un caractère latin
   (ASCII ou accentué), pour éliminer les titres en cyrillique, kanji, etc.) */
export const isTitleReadable = (title: string): boolean =>
  /[A-Za-zÀ-ÿ]/.test(title);

/* Vérifie qu’un item TMDb possède un poster ET un titre lisible */
export const isItemDisplayable = (item: {
  poster_path?: string;
  name?: string;
  title?: string;
  original_name?: string;
}): boolean => {
  const hasPoster = !!item.poster_path;
  const readable = isTitleReadable(
    item.name || item.title || item.original_name || ""
  );
  return hasPoster && readable;
};
