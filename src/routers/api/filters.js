export function filterDeleted(records) {
  return records.filter(record => records.deletedAt === null)
}