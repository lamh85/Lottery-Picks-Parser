# Lottery-Picks-Parser

## Instructions for Installation
1. `git clone` this repo.
2. Open this file in your browser: `./bin/index.html`.

## The logical flow between the JS files

The source code is in the `./src` folder. The compiled code is in `./bin/bundle.js`. The following refers to the source code.

1. `index.js` is the main point of contact between the UI and the logic that searches for lottery picks. The file sanitizes the user's input and sends that data to `baseProcessor.js`
2. `baseProcessor.js` loops through the array of strings. Each iteration calls the `stringProcessor.js` file. See next section on how this file works.
3. The results flow back to `baseProcessor.js`. This file returns the results to `index.js` which renders the HTML.

## How does the app determine if a string has valid lotto picks - How `stringProcessor.js` works

This section only looks at the `stringProcessor.js` file.

Take this string for example:
`4938532894754`

First, we need to determine how many single-digit lotto picks are in this string:

> 13 total digits - 7 (minimum possible digits in a string of lotto picks) = 6

> Therefore, there must be 6 lotto picks that have two digits.

> 7 lotto picks - 6 double-digit picks = 1 single-digit pick

**The lotto picks in this example must have *exactly* one single-digit pick:**

Then we need to make a list: Which of these numbers `4938532894754` **must** be the single-digit lotto pick?

* The first position (4) could be a single because the remaining 12 could form 6 double-digit numbers.
* The second position (9) will **not** work because that would make the first position (4) a single-digit pick. Therefore, we would have **two** single-digit lotto picks. But we already determined that this example **must** contain only one single-digit pick.
* The second last position (5) is invalid for the same reason.

With this logic, we produce an array of possible positions for single-digit picks (using zero-index): `0, 2 (but not 1), ... 10 (but not 11), 12`

Then we parse the string by using the above list to tell us where to produce a single-digit pick:

* `0 (the first number is the single-digit)` -> **4**, 93, 85, 32, 89, 47, 54
* `2 (the third number is the single-digit)` -> 49, 38, **5**, 32, 89, 47, 54
* and so forth

The above produces an array of sets of lotto picks:
`[4, 93, 85, 32, 89, 47, 54], [49, 38, 5, 32, 89, 47, 54] ...`

But as the app makes the list of these sets, it also validates the picks:

* Each pick should be between 1 and 49.
* No duplicates allowed.

As soon as the app finds a _valid_ set, it will stop producing sets of lotto picks.

### But what if there is more than one single-digit pick?

Here is a string of 12 digits: `493853289475`

**There must be 2 single-digit lotto picks.**

We need to list all the possible parsing scenarios.

* Positions `0` and `1` can be in the same scenario because that would leave 10 digits which forms 5 double-digit picks.
* Positions `0` and `2` _cannot_ be in the same scenario because that would produce a third single-digit pick using position `1`.
* A scenario can have `0` and `3` because a double-digit would be formed by positions `1` and `2`.
* And so forth.

The parsing scenarios would look like this:
`[0, 1], [0, 3] ... [10, 11] (the previous 10 digits would produce 5 double-digit picks)`

## Code Design and Principles

**Single responsibility principle** - Use small JS functions that are focused on one small task.

**Make one file responsible for one general task.** However, we cannot have too many small files. I tried that, and encountered Stack Overflow errors because there were too many function calls.

Use **comments** to identify a group of functions as related.

**Alternate between solving the problem and validating the data. Don't save all the validation until the end.** Validation reduces the amount of data that each step processes. For example, when the app is parsing the string of numbers using the parsing scenarios, the app skips to the next scenario if the current scenario encounters an invalid lotto pick.

**Take full advantage of skipping code: `break`, `continue`, `return`, etc.** The app uses these statements for the same reason as above: prevent unnecessary persisting of invalid lotto picks.