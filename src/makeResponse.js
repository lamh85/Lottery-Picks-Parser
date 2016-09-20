// Standarized response JSON ----------------------

var makeResponse = (status, reason) => {
  return {
    status: status,
    reason: reason
  }
}

export default makeResponse