# Lottery-Picks-Parser

## Instructions for Installation
1. Clone this repo.
2. Open in your browser: `./bin/index.html`.

## The logical flow between JS files

The source code is in the `./src` folder. The compiled code is in `./bin/bundle.js`. The following refers to the source code.

1. `index.js` is the main point of contact between the UI and the logic that searches for lottery picks. The file sanitizes the user's input and sends the series of digits to `baseProcessor.js`
2. `baseProcessor.js` loops through each series. Each iteration calls the `stringProcessor.js` file. See next section on how this file works.
3. The results flow back to `baseProcessor.js`, and this file returns the results to `index.js`, which renders the HTML.

## How does the app determine if a series has valid lotto pics - How `stringProcessor.js` works

This section only looks at the `stringProcessor.js` file.

Take this series for example:
`4938532894754`

First, we need to determine how many single-digit lotto picks are in this series. There are 13 digits in our example. If we need exactly 7 picks, then **the series must have one single-digit pick:**

> 13 - 7 (minimum digits in series) = 6 digits must be used to form double-digit picks

> 7 - 6 = 1 single-digit pick

Then we need to make a list of possible positions in the series that could be a single digit.

* The first position (4) could be a single because the remaining 12 would be double-digit picks.
* The second position (9) will not work because that would make the first position (4) a single-digit pick. As we already determined, this series can only have one single-digit pick.
* The second last position (5) is invalid for the same reason.

With this logic, we produce an array of possible positions for single-digit picks (using zero-index): `0, 2 (but not 1), ... 10 (but not 11), 12`

Then we parse the series by using the above list to tell us where to produce a single-digit pick:

* `0` -> 4, 93, 85, 32, 89, 47, 54
* `2` -> 49, 38, 5, 32, 89, 47, 54
* and so forth

The above produces an array of sets of lotto picks:
`[4, 93, 85, 32, 89, 47, 54], [49, 38, 5, 32, 89, 47, 54] ...`

But as the app makes the list of these sets, it also validates the picks:

* Each pick should be between 1 and 49.
* No duplicates allowed.

As soon as the app finds a _valid_ set, it will stop producing sets of lotto picks.

### But what if there is more than one single-digit pick?

Here is a series of 12 digits: `493853289475`

**There must be 2 single-digit lotto picks.**

We need to list all the possible parsing scenarios.

* Positions `0` and `1` can be in the same scenario because that would leave 10 digits which forms 5 double-digit picks.
* Positions `0` and `2` _cannot_ be in the same scenario because that would produce a third single-digit pick.
* A scenario can have `0` and `3` because a double-digit would be formed by `1` and `2`.
* And so forth.

The parsing scenarios would look like this:
`[0, 1], [0, 3] ... [10, 11] (the previous 10 digits would produce 5 double-digit picks)`