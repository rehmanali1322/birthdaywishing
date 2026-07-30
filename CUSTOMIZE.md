# Customize the Birthday Wish

## 1. Change your nephew's details

Open:

```text
config/birthday-config.js
```

At the very top you will see:

```js
recipient: {
  name: "Ayaan",
  nickname: "Little Star",
  age: 1,
  birthdayLabel: "1st",
  dateOfBirth: "2025-08-01",
}
```

Replace the sample values.

| What you want to change | Property |
|---|---|
| Nephew name | `recipient.name` |
| Nickname | `recipient.nickname` |
| Age | `recipient.age` |
| `1st` text | `recipient.birthdayLabel` |
| DOB | `recipient.dateOfBirth` |
| Your display name | `from.name` |
| Relation | `from.relationship` |
| Opening text | `copy.introTitle`, `copy.introBody` |
| Letter | `copy.letter[]` |
| Final line | `copy.finalLine` |
| 3 number/stat cards | `stats[]` |
| Four love/appreciation cards | `reasons[]` |
| Memory captions | `memories[]` |
| Music | `media.music` |

## 2. Replace photos permanently

The easiest method is to keep the same filenames and replace these files:

```text
assets/photos/hero.svg
assets/photos/photo-1.svg
assets/photos/photo-2.svg
assets/photos/photo-3.svg
assets/photos/photo-4.svg
assets/photos/final.svg
```

You can instead use `.jpg`, `.png` or `.webp`; then change the matching path in `config/birthday-config.js`.

Recommended photo size: around 1200–1800 px on the long edge. WebP/JPG usually gives the best loading size.

## 3. Use your own cake image

Put a transparent PNG/WebP in:

```text
assets/uploads/
```

Example:

```text
assets/uploads/my-cake.png
```

Then set:

```js
cakeImage: "assets/uploads/my-cake.png"
```

Leave it `""` to use the premium coded cake.

## 4. Use your own candle image

Put a transparent image in `assets/uploads/`, then set:

```js
candleImage: "assets/uploads/my-candle.png"
```

Leave blank for the animated coded candle.

## 5. Replace music

Copy your own permitted MP3/WAV/OGG to:

```text
assets/audio/
```

Then update:

```js
music: "assets/audio/my-song.mp3"
```

Do not use a commercial copyrighted track unless you have permission to publish it.

## 6. Birthday Studio upload preview

Run the website and open:

```text
http://localhost:3000/studio/
```

Studio lets you select:

- Hero photo
- Final photo
- 4 memory photos
- Cake image
- Candle image
- Music
- Basic text values

Those uploads are saved in **your current browser only** using IndexedDB and are meant for fast preview/testing.

For a file to appear for everyone opening your final Netlify URL, copy it into the project `assets/` folders and update `config/birthday-config.js`, then push the change to GitHub.
