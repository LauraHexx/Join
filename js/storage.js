const STORAGE_TOKEN = "7UZ5X5I5WB9QXP3A4FQ3A68EKW7UFS8COHLKQ15J";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Sets an item in the storage.
 * @param {string} key - The key for the item.
 * @param {any} value - The value to be stored.
 * @returns {Promise<object>} A Promise that resolves to the response JSON object.
 * @async
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * Retrieves the value of an item from the storage.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} A Promise that resolves to the value of the item.
 * @throws {string} Throws an error if the item with the specified key is not found.
 * @async
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}
