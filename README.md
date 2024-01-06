# deem rooms - Farcaster Channel Chat for The Beautiful Game

Pop-up Farcaster Channels ak.a. d33m rooms. No replies, no reactions, no nothing. Just an IRC like chat widget that can create unique 6 character channels for the domain this repo is deployed on.

## About

Example site: https://d33m.com

Uses @noctisatrae's [/farsign/hooks](https://github.com/noctisatrae/farsign) for user authentication.

## Usage
A random d33m room is created every time you visit d33m.com. Move from room to room by typing `/join [ID]`. The room name is 6 characters. You can also create a new room by typing any 6 characters after `/join`. For example, `/join 123456` will create or join the room with the ID `123456`. 

`Note: Channels are case-sensitive. "LIVMUN" is not the same as "livmun".`

To use ChatGPT AI, type `/ai [prompt]`. For example, `/ai who is LFC's top scorer of all time?`. The AI will respond with a message. Your prompt and the AI response will not be cast. You may edit and cast the AI response if you wish.

To use /ai you must enter your own OpenAI API key which is stored in your browser's localStorage and is not stored by this app. You can get a key at https://openai.com/. 


There are a few console.logs in the code to help you understand what's going on. This implementation is currently polling a hub for all messages in the channel every few seconds. Thank you Neynar.com for hosting the hub.

Non obvious feature:

- To display an avatar badge that represents the team you are supporting add `d33m:[team abreviation]` to your Farcaster bio. For example, `d33m:liv` will display the Liverpool FC badge. d33m:ars will display the Arsenal FC badge etc. PR to add your team's badge.

## Installation

Clone the repository:

```shell
git clone https://github.com/your-username/Farcaster_Channel_Chat.git

npm install
npm run dev
```

This repo assumes the Farcaster Hub needs an auth username and password. Your hub may not need this. See the example dot env file for more details.

## Contributing

Contributions are welcome! Plans are to take this and integrateit into defifa.net for the chat+ai feature.

## License

This project is licensed under the MIT License.

## Possible TODOs

- alert user when hub is down, enable config for changing hubs in ui
- there is no disconnect from farcaster in ui to support multiple accounts
- farsign is using localstorage and if cleared a new signer is needed. Maybe using Neynar sign-in here would be better?
- going for that irc vibe so adding time/moment to the left column ??
- add a "loading" indicator when fetching messages and AI suggestions
