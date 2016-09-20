import makeResponse from './makeResponse'

// Validation functions ---------------------------

const isEnoughNumbers = (picksString) => {
  if (picksString.length >= 7 && picksString.length <= 14) {
    return makeResponse("success", "")
  } else {
    return makeResponse("failed", "Invalid number of digits. There must be between 7 and 14 numbers in this string.")
  }
}

const areAllUnique = (picks) => {
  var picks = picks.sort()
  for (var index = 0; index < picks.length; index ++) {
    if (picks[index] == picks[index + 1]) {
      return makeResponse("failed", "This number is duplicated: " + picks[index])
    }
  }
  return makeResponse("success", "")
}

const areAllValidSizes = (picks) => {
  for (var index = 0; index < picks.length; index ++) {
    if (picks[index] < 1 || picks[index] > 59) {
      return makeResponse("failed", "This lotto pick is out of range: " + picks[index])
    }
  }
  return makeResponse("success", "")
}

const validateEachPick = (picks) => {
  var validationResult = areAllUnique(picks)
  if (validationResult.status == "failed") {
    return validationResult
  }

  validationResult = areAllValidSizes(picks)
  if (validationResult.status == "failed") {
    return validationResult
  }
  return makeResponse("success", "Yes, you can make valid lotto picks.")
}

// Make markers -------------------------------------

const recursiveMarkersMaker = (lastMarkersList, maxPosition, minimumSpace, markersList, markerListsArray) => {
  var clonedMarkersList = markersList.slice(0)
  var markerListsArray = markerListsArray

  var oldPosition = clonedMarkersList[clonedMarkersList.length - 1]
  var newPosition = clonedMarkersList[clonedMarkersList.length - 1] + minimumSpace
  if (newPosition <= maxPosition) {
    clonedMarkersList[clonedMarkersList.length - 1] = newPosition
    markerListsArray.push(clonedMarkersList)

    recursiveMarkersMaker(lastMarkersList, maxPosition, minimumSpace, clonedMarkersList, markerListsArray)
  // Move the right-most marker
  } else if (clonedMarkersList[0] != lastMarkersList[0]) {
    // Find the right-most marker that has not been moved to final position yet
    var foundRightMostNumber = false
    for (var rightMostFinder = clonedMarkersList.length - 2; rightMostFinder >= 0; rightMostFinder --) {
      if (clonedMarkersList[rightMostFinder] != lastMarkersList[rightMostFinder]) {
        foundRightMostNumber = true
        break
      }
    }
    if (foundRightMostNumber == true) {
      var newPosition = clonedMarkersList[rightMostFinder] + minimumSpace

      if (newPosition <= maxPosition) {
        // Set the subsequent numbers as consecutive
        for (var remainingIndices = rightMostFinder + 1; remainingIndices < clonedMarkersList.length; remainingIndices ++) {
          clonedMarkersList[remainingIndices] = clonedMarkersList[remainingIndices-1] + 1
        }

        markerListsArray.push(clonedMarkersList)
        recursiveMarkersMaker(lastMarkersList, maxPosition, minimumSpace, clonedMarkersList, markerListsArray)
      }
    }
  }
  // Cannot move any more markers. Return the full array.
  return markerListsArray
}

const markersMakerBase = (picksString, numberOfSingleDigits) => {
  var maxPosition = picksString.length - 1

  var indexCounter = 0
  var firstMarkersList = []
  var lastMarkersList = []
  while (indexCounter <= numberOfSingleDigits - 1) {
    firstMarkersList[indexCounter] = indexCounter
    lastMarkersList[numberOfSingleDigits - 1 - indexCounter] = maxPosition - indexCounter
    indexCounter ++
  }
  return recursiveMarkersMaker(lastMarkersList, maxPosition, 2, firstMarkersList, [firstMarkersList])
}

// Easy Answers -----------------------------------------

const allAreSingleDigits = (picksString) => {
  var picks = picksString.match(/.{1}/g)
  var validationResult = validateEachPick(picks)
  if (validationResult.status == "success") {
    return makeResponse("success", picks)
  } else {
    return makeResponse("failed", "Cannot make valid lotto picks with this string.")
  }
}

const allAreDoubleDigits = (picksString) => {
  var picks = picksString.match(/.{1,2}/g)
  var validationResult = validateEachPick(picks)
  if (validationResult.status == "success") {
    return makeResponse("success", picks)
  } else {
    return makeResponse("failed", "Cannot make valid lotto picks with this string.")
  }
}

// Parse string by using the markers -------------------------

const stringHasValidPicks = (picksString, markerListsArray) => {
  var parsedString = []

  for (var listsIndex = 0; listsIndex < markerListsArray.length; listsIndex ++) {
    var stringIndex = 0
    // Parse whole string
    while (stringIndex < picksString.length) {
      // Should parse out one digit
      if (markerListsArray[listsIndex].includes(stringIndex)) {
        var pick = picksString[stringIndex]
        if (pick >= 1 && pick <= 59 && !parsedString.includes(pick)) {
          parsedString.push(pick)
          stringIndex ++
        } else {
          parsedString = []
          break // Stop parsing this string and proceed to next string
        }
      // Should parse out two digits
      } else {
        var pick = picksString[stringIndex] + picksString[stringIndex+1]
        if (pick >= 1 && pick <= 59 && !parsedString.includes(pick)) {
          parsedString.push(pick)
          stringIndex += 2
        } else {
          parsedString = []
          break // Stop parsing this string and proceed to next string
        }
      } // End parsing one pick
    } // End parsing whole string

    if (parsedString.length == 7) {
      return makeResponse("success", parsedString)
    }

  } // End testing all parsing patterns

  return makeResponse("failed", "Cannot find a parsing pattern that produces valid lotto picks")
}

// Run this function ------------------------------------------

const baseFunction = (input) => {
  var picksString = input.toString()

  var lengthValidationResult = isEnoughNumbers(picksString)
  if (lengthValidationResult.status == "failed") {
    return lengthValidationResult.reason
  }

  var numberOfDoubleDigits = picksString.length - 7

  if (numberOfDoubleDigits == 0) {
    var hasLottoPicks = allAreSingleDigits(picksString)
  } else if (numberOfDoubleDigits == 7) {
    var hasLottoPicks = allAreDoubleDigits(picksString)
  } else {
    var markerListsArray = markersMakerBase(picksString, 7 - numberOfDoubleDigits)
    var hasLottoPicks = stringHasValidPicks(picksString, markerListsArray)
  }

  if (hasLottoPicks.status == "success") {
    var pickNumbersMessage = ""

    for (var index = 0; index < hasLottoPicks.reason.length; index ++) {
      pickNumbersMessage += hasLottoPicks.reason[index]
      if (index < hasLottoPicks.reason.length - 1) {
        pickNumbersMessage += ", "
      }
    }

    return "Yes, this string of numbers can produce valid lottery picks. The picks are " +pickNumbersMessage
  } else {
    return "This string of numbers cannot produce a full set of lottery picks."
  }
}

export default baseFunction