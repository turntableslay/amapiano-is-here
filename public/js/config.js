/* ============================================================
   AMAPIANO IS HERE — 2027 SIGN-UP PAGE CONTENT
   Edit this file to update the site. No other code changes needed.
   ============================================================ */

window.AIH = {
  /* ---------- Links ---------- */
  links: {
    instagram: "https://www.instagram.com/amapianoishere/",
    presenter: "https://www.globalbouncepresents.com",
    email: "hello@amapianoishere.com"           // TODO: confirm booking / partnership email
  },

  /* ---------- Spotify ---------- */
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/4maK1El66HhKIRw3vQvmN6",

  /* ---------- Sign-up form ----------
     "/api/subscribe" = the Cloudflare Pages Function in /functions/api/subscribe.js.
     Or paste a Formspree / other form endpoint URL.
     listTag is sent with every sign-up so you can segment the 2027 list in your CRM. */
  formEndpoint: "/api/subscribe",
  listTag: "aih-2027-interest",

  /* ---------- Who's played the room (scrolling names) ---------- */
  names: {
    headliners: ["Major League DJz", "Daliwonga", "DJ Lag", "Mohogany", "Zyah Belle"],
    residents: ["Nayiram", "Kholo", "DXN P", "Supa CDQ", "Anzo", "Nazo"],
    guests: ["DJ Solo", "Godfather", "Lace Cadence", "DJ NGL", "DJ CYA"]
  },

  /* ---------- Photo wall ----------
     One mixed set of photos, shown as counter-scrolling rows.
     Photos are dealt across the rows in list order, so mix colours and shapes as you go.
     Each photo lives in assets/photos/ in two sizes: <name>-800.jpg and <name>-1600.jpg.
     Add one with { photo: "<name>", w, h, alt } (w/h = the 800px file's size).
     Clips: { clip: "assets/clips/<file>.mp4", poster: "assets/clips/<file>.jpg", alt } */
  galleryRows: 3,
  gallery: [
    { photo: "beam-crowd", w: 641, h: 800, alt: "A projector beam cutting through haze over a red-lit crowd", caption: "Peak time" },
    { photo: "blue-faces", w: 800, h: 533, alt: "Smiling faces in blue light near the front", caption: "Front row" },
    { photo: "mldjz-green", w: 600, h: 800, alt: "Major League DJz under green lights with their backdrop behind", caption: "Major League DJz, The Crocodile" },
    { photo: "mic-backdrop", w: 800, h: 533, alt: "Host on the mic, finger raised, Amapiano Is Here logo behind", caption: "On the mic" },
    { photo: "flag-wave", w: 600, h: 800, alt: "A South African flag waving over dancers, one man with his arm up", caption: "Hands up" },
    { photo: "laughing", w: 800, h: 534, alt: "Friends laughing together in the middle of the crowd", caption: "Siyabonga" },
    { photo: "decks-b2b", w: 641, h: 800, alt: "Two DJs in caps working Pioneer decks, light trails across the frame", caption: "Back to back" },
    { photo: "room-beams", w: 800, h: 534, alt: "Crowd under orange beams with a South African flag raised", caption: "Flags up early" },
    { photo: "green-fan", w: 600, h: 800, alt: "A dancer in green light wearing goggles, a fan open behind her", caption: "Fans out" },
    { photo: "cheering", w: 800, h: 534, alt: "Two friends cheering with arms out on the dance floor", caption: "That one" },
    { photo: "mldjz-red", w: 640, h: 800, alt: "Major League DJz behind the decks under red light", caption: "Major League DJz" },
    { photo: "curls", w: 800, h: 534, alt: "A dancer smiling with her hand in her curls", caption: "Still going" },
    { clip: "assets/clips/stage-dance-2.mp4", poster: "assets/clips/stage-dance-2.jpg", alt: "Dancers on stage under red lights, then the crowd", caption: "On stage" },
    { photo: "balcony-room", w: 800, h: 533, alt: "A packed floor seen from the balcony, red stage lights and a busy bar", caption: "From the balcony" },
    { photo: "blue-arm-up", w: 641, h: 800, alt: "A dancer in blue light with one arm raised, Crocodile wristband on", caption: "One more" },
    { photo: "dj-backdrop", w: 800, h: 533, alt: "A DJ performing in front of the Amapiano Is Here logo projection", caption: "In front of the logo" },
    { photo: "flags-triptych", w: 640, h: 800, alt: "Three frames: a dancer on stage with South African flags, friends dancing, a crowd waving flags", caption: "Mzansi in the building" },
    { photo: "stage-balloon", w: 800, h: 533, alt: "DJ on stage above a crowd, a gold number balloon in the room", caption: "Stage left" }
  ]
};
