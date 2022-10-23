import Dexie from "dexie"

export const db = new Dexie("ayoBDB")
db.version(1).stores({
  categories: "++id, title, position",
  bookmarks: "++id, category, position",
})
export default db
