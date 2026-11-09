# Seasonal moods (experimental)

> **Off by default.** Seasonal moods are still being polished. Turn them on
> with `seasonal_moods = auto` (see Settings below) if you want to try them.

During holidays the Dagwick lantern dresses up and the page header gets a small
animated scene. Moods are **decoration only**: scores, grades and text never
change, and everything goes back to normal when the holiday ends.

![All seasonal moods](https://raw.githubusercontent.com/ardalan-jalal/dagwick/main/docs/screenshots/moods.png)

| Mood | When | What you see |
| --- | --- | --- |
| 🔥 Newroz | Mar 19 – 23 | Flower crown, a bigger fire, bonfires on the mountains, govend dancers |
| 🍪 Eid | Eid al-Fitr (3 days) and Eid al-Adha (4 days) | Bunting, a crescent, a plate of kulîçe |
| ✍️ Kurdish Language Day | May 15 | Kurdish letters floating up, a scroll with the letter ک |
| 🎄 Christmas | Dec 18 – 26 | Santa hat, holly, falling snow, a snow bank |
| 🎉 New Year | Dec 31 – Jan 2 | Party hat, fireworks, confetti |
| 🎃 Halloween | Oct 24 – Nov 1 | Green flame, a spider, bats flying under a full moon |
| 🌙 Ramadan | the month of Ramadan | Crescent moon, stars, hanging lanterns |
| 🎂 Dagwick's birthday | Nov 8 | Party hat, balloons, confetti |

Each mood also shows a short English greeting (for example "Happy Newroz!").

- **Dates** use the viewer's local calendar. Ramadan and Eid follow the
  Umm al-Qura Islamic calendar built into the browser, so they move every year
  without any date tables. Locally observed dates can differ by a day.
- **Overlaps:** when two moods fall on the same day, the one higher in the
  table above wins. For example, Eid al-Fitr 2026 falls during Newroz, so
  Newroz shows on those days.
- **Viewers** can click **Hide** on the greeting to turn moods off for
  themselves (remembered in their browser), and **Show** to bring them back.
- **Motion:** all animation stops for viewers who prefer reduced motion.

## Settings (optional)

Moods are **off by default** while they are experimental. An admin can turn
them on in `airflow.cfg`:

```ini
[dagwick]
seasonal_moods = auto              # every mood
# seasonal_moods = off             # no moods (default)
# seasonal_moods = newroz,eid,christmas   # only these
```

or with the environment variable `AIRFLOW__DAGWICK__SEASONAL_MOODS`. Mood ids:
`newroz`, `eid`, `language-day`, `christmas`, `new-year`, `halloween`,
`ramadan`, `birthday`.

## Preview a mood

Add `?dagwick_mood=<id>` to a Dagwick page URL, for example
`.../plugin/dagwick?dagwick_mood=newroz`. Use `?dagwick_mood=everyday` to see
the normal lantern.
