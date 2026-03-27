// SPDX-FileCopyrightText: 2025 SunnyMonster
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Metadata } from "next";
import { Spotify } from "../components/spotify";
import Birthday from "../components/birthday";

export const metadata: Metadata = {
  title: "Home | sunny_monster",
};

export default function Page() {
  return (
    <>
      <blockquote>
        <strong>Note</strong>: As you can see this website is a bit outdated and
        a bit broken. I'm currently quite busy, but once I do have time I will
        rewrite this website to make it better (hopefully) and at least fix the
        issues.
      </blockquote>
      <h1>Home</h1>
      <p>
        Hi, I&#39;m SunnyMonster, <Birthday /> creationer and (almost)
        everything-enthusiast from New Zealand. Welcome to my site!
      </p>
      <h2>Music</h2>
      <Spotify />
      <blockquote>
        also yes of course the colour scheme is catppuccin. it&#39;s the best
        colour scheme, <del>you can&#39;t</del> change my mind.
      </blockquote>
    </>
  );
}
