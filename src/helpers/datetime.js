
const dateTimeHelper = (datetime) => {
  date = new Date(datetime * 1000)
  let months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  let month = months[date.getMonth()]
  let minutes = date.getMinutes()
  if (minutes == 0)  minutes = '00'
  return {
    "year": date.getFullYear(),
    "month": month,
    "day": date.getDate(),
    "hour": date.getHours(),
    "minutes": minutes
  }
}

module.exports = { dateTimeHelper }