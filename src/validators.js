import makeResponse from './makeResponse'

// Validation functions ---------------------------

export const isEnoughNumbers = (picksString) => {
  if (picksString.length >= 7 && picksString.length <= 14) {
    return makeResponse("success", "")
  } else {
    return makeResponse("failed", "Invalid number of digits. There must be between 7 and 14 numbers in this string.")
  }
}

export const areAllUnique = (picks) => {
  var picks = picks.sort()
  for (var index = 0; index < picks.length; index ++) {
    if (picks[index] == picks[index + 1]) {
      return makeResponse("failed", "This number is duplicated: " + picks[index])
    }
  }
  return makeResponse("success", "")
}

export const areAllValidSizes = (picks) => {
  for (var index = 0; index < picks.length; index ++) {
    if (picks[index] < 1 || picks[index] > 59) {
      return makeResponse("failed", "This lotto pick is out of range: " + picks[index])
    }
  }
  return makeResponse("success", "")
}