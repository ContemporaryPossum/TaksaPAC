// Facts about the centre that are the same in every language.
// Every value here is sourced in docs/phase-1/ANSWERS.md. Change them here and
// the whole site follows (header, footer, contact page, form, structured data).

export const site = {
  name: "Taska & Tadika PAC",
  nameZh: "日昇幼儿园",
  url: "https://www.taskapac.com",
  since: 1999,
  phone: {
    display: "016-272 9666",
    tel: "+60162729666",
    // Assumed to be on WhatsApp. Test with one message before launch.
    whatsapp: "60162729666",
  },
  email: "amypac2008@gmail.com",
  facebook: "https://www.facebook.com/TASTADIKAPAC/",
  youtube: "https://www.youtube.com/@taskapac8949",
  locations: {
    taska: {
      street: "1, Jalan Anggerik Aranda 31/34",
      area: "Kota Kemuning, Seksyen 31",
      postcode: "40460",
      city: "Shah Alam",
      state: "Selangor",
      geo: { lat: 2.9931679, lng: 101.5487996 },
    },
    tadika: {
      street: "1, Jalan Anggerik Aranda 31/170C",
      area: "Kota Kemuning, Seksyen 31",
      postcode: "40460",
      city: "Shah Alam",
      state: "Selangor",
      geo: null,
    },
  },
  // 24-hour times, used for both the visible table and structured data.
  hours: [
    { days: "mon-fri", opens: "06:30", closes: "19:00" },
    { days: "sat", opens: "08:00", closes: "13:00" },
    { days: "sun", opens: null, closes: null },
  ],
  registrationWindow: { from: "2026-05", to: "2026-11" },
  // The 2020 tour video shows identifiable children. Keep this false until the
  // centre confirms written parental consent for everyone in it.
  tourVideo: { youtubeId: "NlSDx4HmwKE", enabled: false },
} as const;

export type LocationKey = keyof typeof site.locations;

export function fullAddress(key: LocationKey) {
  const l = site.locations[key];
  return `${l.street}, ${l.area}, ${l.postcode} ${l.city}, ${l.state}`;
}

export function mapsUrl(key: LocationKey) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(key))}`;
}

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${site.phone.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
