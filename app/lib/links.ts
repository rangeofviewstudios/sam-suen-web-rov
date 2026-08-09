export const LINKS = {
  spotify:
    "https://open.spotify.com/artist/0xXkuHzIgsvT7a00POWMIK?si=E4RShAnQTe6HyvLjyAuZuA",
  appleMusic:
    "https://music.apple.com/us/artist/sam-suen/1561994926",
  instagram: "https://www.instagram.com/samsuenofficial/",
  email: "mailto:contact@rovstudios.com",
  rovStudios: "https://www.rovstudios.com/",
} as const;

/**
 * The current release, surfaced on /early (the SMS funnel destination).
 *
 * Before release day this points at SoundCloud only. On release day, fill
 * in the Spotify and Apple track URLs — the page renders whichever links
 * are present, so it needs no code change beyond adding them here.
 */
export const NEW_RELEASE = {
  title: "Efforts and Sincerity",
  releaseDate: "2026-08-14",
  soundcloud:
    "https://soundcloud.com/sam-suen-746400269/efforts-and-sincerity",
  spotify: "",
  appleMusic: "",
} as const;
