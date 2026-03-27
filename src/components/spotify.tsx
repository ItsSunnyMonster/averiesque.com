// SPDX-FileCopyrightText: 2025 SunnyMonster
//
// SPDX-License-Identifier: AGPL-3.0-or-later

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";

function formatDuration(ms: number) {
  let seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const minutes1 = minutes & 60;
    return `${hours}:${minutes1.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function Skeleton() {
  return (
    <>
      <div className="w-20 h-20 rounded-md bg-surface1 animate-pulse"></div>
      <div className="flex flex-col flex-1 justify-between w-full items-center smnav:items-stretch gap-2">
        <div className="h-6 flex gap-3 max-smnav:hidden">
          <div className="w-60 bg-surface1 animate-pulse rounded-md"></div>
          <div className="w-20 bg-surface1 animate-pulse rounded-md"></div>
          <div className="w-40 bg-surface1 animate-pulse rounded-md"></div>
        </div>
        <div className="h-6 rounded-md bg-surface1 animate-pulse w-4/5 smnav:hidden"></div>
        <div className="h-6 rounded-md bg-surface1 animate-pulse w-full"></div>
      </div>
    </>
  );
}

function ProgressBar({
  progressMs,
  durationMs,
  paused,
}: {
  progressMs: number;
  durationMs: number;
  paused: boolean;
}) {
  const [progress, setProgress] = useState(progressMs);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (Math.floor(prev) + 1000 <= Math.floor(durationMs))
            return (prev += 1000);
          else return prev;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    setProgress(progressMs);
  }, [progressMs]);

  return (
    <div className="relative h-8 flex items-center mx-14">
      <div className="absolute right-[calc(100%+10px)] text-[.8em] text-overlay2">
        {formatDuration(progress)}
      </div>
      <div
        style={
          {
            "--progress": `calc(100% - ${(progress / durationMs) * 100}%)`,
          } as React.CSSProperties
        }
        className={`relative bg-surface2 h-1 flex-1 rounded-full
                             before:absolute before:top-0 before:left-0 before:bottom-0 before:right-[--progress] before:rounded-full before:bg-yellow`}
      ></div>
      <div className="absolute left-[calc(100%+10px)] text-[.8em] text-overlay2">
        {formatDuration(durationMs)}
      </div>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SpotifyInner() {
  return <Skeleton />;

  const { data, error } = useSWR("/api/now-playing", fetcher, {
    refreshInterval: (data) => {
      if (data && data.isPlayingNow) {
        return 1000;
      }
      return 5000;
    },
    compare: (a, b) => {
      return a?.lastUpdate === b?.lastUpdate;
    },
  });

  if (!data || error) {
    return <Skeleton />;
  }

  return (
    <>
      <div className="w-20 h-20 min-w-20 min-h-20 relative rounded-md overflow-hidden self-center">
        <Image
          width={80}
          height={80}
          src={data.albumCoverImg}
          alt="Album Cover"
          className={`absolute inset-0 w-20 h-20 rounded-md transition-all ${data.isPaused ? "blur-[1px] contrast-50 brightness-125 dark:contrast-100 dark:brightness-75" : ""}`}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          className={`w-16 max-w-16 h-16 max-h-16 absolute inset-2 fill-base dark:fill-text ${data.isPaused ? "opacity-70" : "opacity-0"}`}
        >
          <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z" />
        </svg>
      </div>
      <div className="flex flex-col flex-1 gap-2 justify-between w-full smnav:items-stretch min-w-0">
        <div className="flex items-center flex-wrap gap-2 min-w-0 max-smnav:justify-center flex-grow-0">
          {data.isPlayingNow && (
            <span className="text-overlay2 text-center">Now Listening To:</span>
          )}
          <div className="flex items-center flex-wrap gap-2 min-w-0 max-smnav:justify-center flex-grow-0">
            <a
              href={data.trackLink}
              className="underlined external leading-snug min-w-0 flex"
              target="_blank"
            >
              <div className="max-w-full truncate">{data.trackName}</div>
            </a>
            <div className="max-smnav:text-center">
              {data.artists.map(
                (artist: { link: string; name: string }, index: number) => (
                  <span key={artist.name}>
                    <a
                      href={artist.link}
                      className="text-overlay2 hover:underline underline-offset-4"
                      target="_blank"
                    >
                      {artist.name}
                    </a>
                    {index !== data.artists.length - 1 && (
                      <span className="text-overlay2">{", "}</span>
                    )}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        {data.isPlayingNow ? (
          <ProgressBar
            progressMs={data.progressMs}
            durationMs={data.durationMs}
            paused={data.isPaused}
          />
        ) : (
          <p className="text-overlay2 max-smnav:text-center">
            Last played on Spotify
          </p>
        )}
      </div>
    </>
  );
}

export function Spotify() {
  return (
    <div className="not-prose rounded-lg bg-surface0 p-5 flex gap-5 smnav:flex-row smnav:items-stretch flex-col items-center justify-center transition-colors">
      <SpotifyInner />
    </div>
  );
}
