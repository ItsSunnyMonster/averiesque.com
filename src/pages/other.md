---
layout: ../layouts/MarkdownBaseLayout.astro
title: Other Page
hideTitle: true
---

# The Luckiest Bug

Something kind of incredible happened when I was solving [Advent of Code 2025 Day 2](https://adventofcode.com/2025/day/2).
**Do not read this if you haven't done it yet and you still want to give it a try.**
Essentially, I read the part-1 instructions wrong, but ended up writing a bug that outputted correct outputs anyway.

You can read the code for it [here](https://github.com/ItsSunnyMonster/aoc2025/blob/master/day2/main.c).

## The Problem and My Approach

To simplify, the problem involved checking integers between some given intervals for 'invalid IDs'.
Part one of the problem stated that invalid IDs are integers that consist of some sequence of digits repeated _twice_, and twice only.
However, I missed the 'twice' part, and thought it had to be an integer that is made up of some sequence of digits repeated _any number of times_.

So, I wrote some code that mmapped the input data into virtual memory so that I can use functions like `memchr` to quickly parse through it.
Then I parsed the number strings into `uint64_t`s through `strtol`, so that I can loop through each number in the intervals to check for repeats.

Of course, the repeats occurred at decimal level, so I converted each number into binary coded decimals, so that I can instead use some bitwise magic
to check for repeated sequences of nibbles.

## The Bug

The function of interest is as follows:

```c
bool shift_and_check(uint8_t step, uint64_t mask, uint8_t digits_len,
                     uint64_t bcd) {
  // Shift through the data by `step` nibbles each time, checking
  // if they equal the last `step` nibbles
  for (uint8_t shift = step; shift < digits_len; shift += step) {
    uint64_t shifted = bcd >> shift * 4;
    if ((shifted & mask) != (bcd & mask))
      return false;

    // Decrease the number of remaining digits to process.
    digits_len -= step;
  }

  // After we are done, we will still have one step worth of nibbles
  // left unshifted, since if we do shift it over it will just be all 0s
  digits_len -= step;

  // If there are any more nibbles left over, that means the number had
  // one last section that was smaller than the step size, which meant
  // it couldn't be made of entirely repeating parts.
  return digits_len == 0;
}
```

This function is called for different step sizes. For example, we first call this function with
`step = 1`, to check if the repeating sequence is 1 digit long. Then we try 2, etc. etc.
For each step size, we step through the whole number to check if the digits are always repeating.
Remember, at this point I still think that it's repeating _any number of times_. However, this code
produced the correct results for part 1, which needed numbers that repeat twice. So I just thought
my code was correct, and moved on to part 2.

This is when I realised I've messed up, since I seemingly have implemented what part 2 wants, which is
some sequence of digits repeated _any number of times_, but somehow got part 1 correct. I thought maybe
I was lucky and my part 1 and part 2 answers would be the same. But it wasn't.

So I got suspicious and went back to check my code.

Do you see the problem yet?

Well, it took me a while to figure it out, but I eventually did. Turns out, instead of making another variable for
the number of digits left unchecked, I simply decremented the `digits_len` parameter instead. In my mind, this worked
because it wasn't modifying the original value passed in, so it won't cause a problem. But what I have forgotten
was that `digits_len` was also used in the for loop condition. This meant that for a string like `949494`,
the `digits_len` would be `6` to begin with. Then, we shift right by `2`, and then decrement `digits_len` by `2`.
This results in `digits_len = 4` for the next iteration, where `shift` would now have increased to `4` as well.
At this point, the loop will terminate early, because `shift` was no longer less than `digits_len`. Then, we subtract
another `step` from `digits_len`, which will now equal to `2`, which is not `0`. So now the function thinks there are
still unprocessed digits left over which cannot be matched, and so it returns `false`.

This effectively means that any string that wasn't made up of two identical halves, the loop will exit early and
mark the string as invalid. Thus, it produces the part-1 behaviour of outputting only strings that have only two repeating
parts, and not any number of times.

So of course, to pass part two, all I had to do was fix this bug, and it works as expected.

## What Have I Learned

Well. I need to learn to read clearly, as if I didn't make this super lucky bug, I would've had to spend ages debugging why
my code wasn't working before I think to reread the instructions.

This is the one bug that I was thankful for in my programming career.
