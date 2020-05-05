// convert the number from DB to string for client
const statusToString = (status) => {
  const statusKey = {
    1: 'Pending',
    2: 'Accepted',
    3: 'Declined',
    4: 'Completed',
    5: 'Cancelled'
  }
  return statusKey[status]
}

module.exports = {
  statusToString
}