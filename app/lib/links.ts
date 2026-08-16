export const LINKS = {
  spotify:
    "https://open.spotify.com/artist/0xXkuHzIgsvT7a00POWMIK?si=E4RShAnQTe6HyvLjyAuZuA",
  appleMusic:
    "https://music.apple.com/us/artist/sam-suen/1561994926",
  instagram: "https://www.instagram.com/samsuenofficial/",
  /**
   * Fan Discord. This must be a never-expiring, unlimited-use invite —
   * Discord's default invites die after 7 days, which would quietly turn
   * every placement on the site into a dead end.
   */
  discord: "https://discord.gg/ZyWebMkbTZ",
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
  /**
   * DistroKid HyperFollow. Before release day this is a pre-save — one tap
   * adds the track to the listener's library the moment it drops. After
   * release the same URL becomes a normal "listen on any platform" page,
   * so it never needs swapping out.
   */
  presave:
    "https://distrokid.com/hyperfollow/samsuenandbasu/efforts-and-sincerity?ref=release",
  soundcloud:
    "https://soundcloud.com/sam-suen-746400269/efforts-and-sincerity",
  spotify: "",
  appleMusic: "",
} as const;
