# d33m rooms - Farcaster chat for The Beautiful Game

d33m rooms are scoped to support chat during live matches. No replies, no reactions, no nothing. Just an IRC-like chat scoped to a live football match.

## Live site: 
[d33m.com](https://d33m.com)

## Usage
When you visit d33m.com, you show up in a generic room called the gantry. You may select a match to join a room for that match.

There are experimental custom emojis that only render while in d33m rooms. They will display as text in other Farcaster clients.

There is also an experimental team badge feature that will display the team badge next to your Farcaster profile pic. It uses GunDB for peer-to-peer data sync and is not part of the Farcaster protocol.

Finally, there is an embedded wallet created in d33m by Privy. It is currently for tipping the d33m devs and may be used in the future.

You will need a Farcaster account to use d33m. You can sign up for a Farcaster account at [Farcaster](https://farcaster.com).

Note: At the moment, this app sends casts to Farcaster using a so-called FIP-2 parentUrl. This is the OG channel technique. At this time, Warpcast does not honor the context of FIP-2 parentUrl and will not display the context of d33m room casts in the Warpcast app. This is a known issue and will be addressed in the future either by a) Warpcast honoring or nerfing the parentUrl or b) d33m using a cast and reply technique. It is my belief that the parentUrl should be honored and that the app developers should not need to know or care about what the Warpcast app does.

## Installation

Clone the repository:

```shell
git clone https://github.com/footy-fc/d33m.git

npm install
npm run dev
```

The example dot env file is included in the repo. You will need to create a .env file with the following:
NEXT_PUBLIC_PRIVY_APP_ID=YOUR_APP_ID

Get a free app id from Privy at https://www.privy.io/

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For now, the focus for d33m will be /football related content and features with a focus on the English Premier League and Champions League. A design goal is to keep the app as simple as possible and to not add too many features. No backend database is used, although Privy does store some data for wallet users. If there is an elegant way to eliminate this dependency and the Warpcast dependency, it will be implemented. The app is built with Next.js, React, and Tailwind.

This code base is nearly 2 years old now and has gone through 5 major changes in how hubs are accessed and users are authenticated. There were a lot of experiments run and hopefully removed prior to this public release. The code is a bit of a [Winchester Mystery House](https://winchestermysteryhouse.com/timeline/). I plan to clean it up in the future and you're welcome to help! The idea is to make this a community project and to have fun with it, learn, and build something cool. Minimal coordination is a goal. All experience levels are welcome to contribute.

The main entry point is the Chat.tsx component in the components folder. The app is a single page app and the chat is the main component. 

## Possible TODOs

- [ ] Add frame/min-app rendering and curated Footy content into a right sidebar
- [ ] Create Footy frames and PR frame link for inclusion in right sidebar
- [ ] Frame ideas include: AI match summaries, FC FEPL stats, curated articles and podcasts
- [ ] Refactor the d33m room code to be more modular, extensible, and maintainable for anybody to spin up their own d33m powered apps
- [ ] Add Champions League matches and team badges
- [ ] Add support for more emoji packs by club supported by match
- [ ] Render emojis in chat composition/text area
- [ ] UX improvements eg modal styling, right sidebar close on click outside etc
- [ ] Native mobile app
- [ ] Add match/room commentator audio feature (w no backend!)
- [ ] Add your ideas here

## License

This project is licensed under the MIT License.