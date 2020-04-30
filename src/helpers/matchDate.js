
const matchDateHelper = (datetime) => {
  date = new Date(datetime * 1000)
  return {
    "year": date.getFullYear(),
    "month": date.getMonth(),
    "day": date.getDate(),
  }
}

module.exports = { matchDateHelper }