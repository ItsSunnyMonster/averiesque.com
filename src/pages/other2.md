---
layout: ../layouts/MarkdownBaseLayout.astro
title: "My Programming Journey"
---

My experiences with programming has always been extremely chaotic. I never settled on one programming language until Rust,
and so I simply kept bouncing around all sorts of different areas of programming on all sorts of different languages.

So, in this post, I will outline my entire journey with programming as much as I can remember, and I will write a hello world snippet
for all the languages I have used. (This is also an excuse to test out the syntax highlighting of code blocks on this site.)

## The Start

When I was a kid, I knew that there were two operating systems: Windows and macOS. I didn't know Linux existed back then because
my parents didn't allow me to use computers and phones most of the time so I was extremely information-deprived. I grew up in China,
so I was sort of patriotic back then, and I soon realised that China didn't have their own operating system. (They do, I just didn't
know.) So I started dreaming about making an operating system, and because I was Chinese, it would make it "the first Chinese-made OS".
Again, because I was information-deprived, I had no clue how programming works, but I did think that it involved a lot of maths.
This weird dream of mine did prompt me to learn more maths, which I guess is a very good thing.

## Scratch

When I was 11, I moved to New Zealand with my parents. The school I went to was "BYOD" (bring your own device), and so my parents couldn't
ban me from using devices anymore. Which means, I got less information-deprived!!

My school had this thing called "Day T", which was a day every week where each teacher hosted a class about some topic like coding, or chess,
where if you were interested in it, you can go to these classes and learn about these things. Since I virtually had no hobbies nor interests
at that time, and motivated by my dream to make an OS some day, I picked programming for both of my option slots.

I remember being extremely nervous about it, because I keep thinking that programming would be really hard, even too hard for me to understand.
But my worries were completely unneeded, as the teacher there introduced all of us to [Scratch](https://scratch.mit.edu).

For those of you who don't know, Scratch is a visual programming "language" designed to help kids or even beginner programmers to get into programming
without having to go through a steep learning curve at the start. Naturally, I started spending **a lot** of time on Scratch, because it was just so fun
dragging blocks together and having them do things. I spent around a year and a half just doing Scratch and nothing else, because I was still convinced
that the "real" programming that involves writing code was still some impenetrable magic.

Here's the hello world snippet in Scratch:

![Scratch Hello World](../assets/scratch.png)

Oh man this is giving me **_SO_** much nostalgia...

## C++

During my Scratch days, I knew of the existence of C and C++, and I have actually tried them a few times. I followed some ancient C tutorial on some
Chinese website and they recommended a really weird IDE which I don't rememebr the name of. But the phrasing on that website was not clear at all,
and so it just further confirmed that "real" programming languages are impenetrable and too hard for me to understand.

Fast forward to August of 2020, I was stuck in a hotel isolating after coming back to New Zealand after the pandemic. My English had improved a lot
by that point, and I already watched a lot of YouTube videos. So I just decided, you know what? I will search up a C++ tutorial on YouTube and see
how I do. So I came across [Kody Simpson's C++ tutorials](https://www.youtube.com/playlist?list=PLfu_Bpi_zcDOtpXhhxL-P1wu0VkwNRXwC) and followed it
eagerly. And to my surprise, it was not hard to learn at all. It just felt like Scratch except you write lines of code instead of dragging blocks
together. Of course, there were some weird concepts that I didn't know about in Scratch like pointers or the fact that arrays are not like lists
on Scratch which can grow in length.

Unfortunately, his C++ tutorials were never finished. So by this point I had learned all the basics of text-based programming in C-like languages,
but I was clearly still not good enough to write real programs with it, as all I knew how to write was contrived console apps.

Here's a Hello World snippet in C++:

```cpp
#include <iostream>

int main() {
  std::cout << "Hello World!" << std::endl;
}
```

## Unity & C\#

After letting the YouTube algorithm do its thing, I go recommended a video from [Brackeys](https://www.youtube.com/@Brackeys), which introduced me to Unity.
I still so vividly remember the level of excitement I felt when I first opened Unity. I've always been wondering how 3D games work after starting to do Scratch,
as there is seemingly no way you can make 3D games on Scratch. (There was, you just had to render things with the pen tool but that was way beyond me back then).
Unity felt like Scratch but 3D. My brain swirled as I realised all the things I could now do. So I followed the Unity tutorials by Brackeys, and learned C# and
object oriented programming in general. I had so much fun just creating random things in Unity. I even made a small and also broken game to submit to a school
project. It was **AMAZING**. I think it was my first exposure to a more complicated system made up of many different parts.

Here's a snippet of hello world in Unity:

```cs
using UnityEngine;

public class HelloWorld : MonoBehaviour {
  private void Start() {
    Debug.Log("Hello World!");
  }
}
```

Obviously now that I learned Unity, using C# for other things is trivial. So I experimented with stuff like WPF to make desktop apps or just made some
more complex console apps now that I understand how parts fit together in programming.

So here's a snippet of hello world in C#:

```cs
using System;

public class App {
  public static void Main(string[] args) {
    Console.WriteLine("Hello World!");
  }
}
```

## Web Dev

Eventually I asked myself the question, wouldn't it be cool if I learned to make a website?

So I did. HTML, CSS, JavaScript, all the goodness of web dev. It was pretty easy to learn compared to Unity and C#,
so I very quickly started making websites.

Here's an interesting anecdote. By this point I've gone to another school, and a good friend of my from my old school
lost the password to his Discord account. Unfortunately he didn't managed to make a new Discord account after our emails
from our school got deleted, so we lost contact. Ages and ages later, we both realised that we could still communicate
through our Scratch profiles almost at the same time, so I tried sending my Discord details through, but Scratch didn't
allow me to. Since I was literally learning web dev at the same time, I made a simple webpage which contained my information
I deployed it and sent the link on the Scratch profile. Indirectly, my web dev knowledge made it possible for us to get in contact
again.

But anyway, here's a Hello World snippet in HTML and JavaScript. (How do you do Hello World in CSS??)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Hello World!</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>
```

```js
const p = document.querySelector("p");

p.innerText = "Hello World!";
```

Of course getting into web dev means exploring all the different things that comes with it, like React, Electron, or even discord bots with node.js. But I never
got so far as to make a complete project in those. Although, I did make a website detailing the inner workings of dams for a school
project. You can find it [here](https://allaboutdams.netlify.app).

## Python

The first version of this post actually didn't contain this because I never really sat down and followed a Python tutorial. But I did use Python
sometimes to write small scripts or even a script that generated a JSON which can then be loaded on to a website to generate one of those racing
bar graph videos of the message counts of every member in my Discord server.

Oh! I also switched to Linux a few times before being forced to switch back because it just so happened that my computer kept crashing Linux, because
of some driver bug I think. But while I was using Linux, I used a tiling window manager called [qtile](https://qtile.org/) which is configured with Python.

So here's hello world in python:

```py
def main():
  print("Hello World!")


if __name__ == "__main__":
  main()
```

## Haskell

This is another one of those languages I briefly touched but never learned. I used this language because I was experimenting with different tiling
window managers, and Haskell is used to configure XMonad.

Here's hello world in Haskell:

```hs
main :: IO()
main = do
  print ("Hello World!")
```

## C++ Again and OpenGL

Unity did not answer my question of "how are 3D games made". How did Unity render the 3D shapes?

Well it's around this time that I discovered the existence of OpenGL. I followed the OpenGL tutorials made by
[The Cherno](https://www.youtube.com/playlist?list=PLlrATfBNZ98foTJPJ_Ev03o2oq3-GGOS2) and then later his Game Engine series.
It got me back into C++, and this time I finally learned the fundamentals of it and really understood it. Stuff like pointers, heap allocations,
etc. etc. This is really when I first got introduced to writing more complex programs.

## Lua

Similar to Python, I didn't include this in the first version of this post because I don't actually know Lua that well. But I did say I will include
every language I have touched, so I'll have to include this. A CMake alternative is Premake, which used Lua files to define the build process.

Here's hello world in Lua:

```lua
print("Hello World!")
```

## Java and Kotlin

I soon discovered a channel called [ThinMatrix](https://www.youtube.com/@ThinMatrix), who had a OpenGL tutorial series but in Java. I knew
Minecraft was written in Java, so I was very keen to try it out. I soon discovered how nice Java is to work with because of its packaging system
and also its platform-independent nature. So I started to write an OpenGL abstraction library in Java, before porting it to Kotlin because it looked
cool and unique.

Here's hello world in both languages:

```java
class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
```

```kt
// Functions are defined as "fun"! How fun!
fun main(args : Array<String>) {
  println("Hello World!")
}
```

## Assembly, C and OSes

I mentioned at the very start of this post that my initial motivation to start programming was because I wanted to make OSes.
I eventually remembered that and searched up tutorials on how to make an OS.

This involved learning assembly and C. I eventually realised that making OSes myself from scratch was probably not a practical
thing to do anyway.

And to be honest, I have already forgotten everything I learned about Assembly, and searching online about hello world didn't
give me much information. So here's hello world in C only:

```c
#include <stdio.h>

int main(void) {
  printf("Hello World!");
}
```

## Rust

I... I got bored of Unity. Since I learned OpenGL, I always wanted to make a game without an engine, but writing the OpenGL
code myself took way too long and I always just gave up after just a little bit of code writing. So I experimented with a
bunch of game frameworks, which weren't engines, but also saved me time by writing the lower level graphics API code for me.
I tried out MonoGame, and I eventually ended up having to make an Entity Component System for it, which led me down the rabbit
hole of ECS's. This landed me on the excellent [Bevy Engine](https://bevyengine.org), which introduced me to Rust. I have heard
of Rust before as a memory safe version of C++ that also didn't use garbage collection, but I never bothered to learn it before
Bevy. I learned Rust through Bevy, and it was the best experience I had with learning a programming language. Unlike C++, where I
had to mess around with CMake or Premake to build the dependencies, with Rust, there is Cargo which made dependencies so much easier
to work with. The memory safe nature of Rust also meant I didn't have to spend ages debugging a crash because I was too stupid and didn't
realise I left a dangling pointer.

Here's the final Hello World of this post:

```rust
fn main() {
  println!("Hello World!");
}
```

Of course, because of my history of "language hopping", I will definitely explore more languages. The likely next languages I will explore are
Go and Zig. They look pretty interesting to me. But for now, Rust is what I'm using for my current projects.

That's it, Bye!!
