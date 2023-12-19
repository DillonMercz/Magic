const fetch = require('node-fetch');
const { Client, GatewayIntentBits, EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = 'MTE4NTY2ODg0OTA4NTk5MzA0MA.GJ7_AA.Fjlw4GO3rng8NUygNCInF2sPSmGPJH7jylDJto';
const GUILD_ID = '1177360730543095939';
const CHANNEL_ID = '1185668435636670585';
const API_URL = 'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json';

// Emojis based on team names
const teamEmojis = {
  'wizards': 'wizards:1185676449701712043',
  'bucks': 'bucks:1185676976112013434',
  'pistons': 'pistons:1185677315313782855',
  '76ers': '76ers:1185676974115528704',
  'bulls': 'bulls:1185676978066571315',
  'cavaliers': 'cavaliers:1185676979823968278',
  'celtics': 'celtics:1185676981635923989',
  'clippers': 'clippers:1185677033532035082',
  'grizzlies': 'grizzlies:1185677035855675402',
  'hawks': 'hawks:1185677036824563852',
  'heat': 'heat:1185677052729364511',
  'hornets': 'hornets:1185677055266914394',
  'jazz': 'jazz:1185677114763124796',
  'kings': 'kings:1185677213270556742',
  'knicks': 'knicks:1185677214939885669',
  'lakers': 'lakers:1185677215757774980',
  'magic': 'magic:1185677216760201267',
  'mavericks': 'mavericks:1185677260297093181',
  'nets': 'nets:1185677267158974624',
  'nuggets': 'nuggets:1185677268626976858',
  'pacers': 'pacers:1185677312205787299',
  'pelicans': 'pelicans:1185677314005139517',
  'raptors': 'raptors:1185677369797775440',
  'suns': 'suns:1185695409822236743',
  'thunder': 'thunder:1185695410732408842',
  'timberwolves': 'timberwolves:1185695452268593193',
  'trail blazers': 'trailblazers:1185695453224910968',
  'warriors': 'warriors:1185695454785196072',
  'rockets' :'<:rockets:1185677370921857065>',
  'spurs' : '<:spurs:1185677372700246197>',
};

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  dailyUpdate();
  setInterval(dailyUpdate, 24 * 60 * 60 * 1000); // Update every 24 hours
});


client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!getreferral') {
    const referralLink = `https://sportsprophet.bet?referral=${message.author.username}`;

    message.reply(`Hey ${message.author.username}! Your referral link is: ${referralLink}`);
  }
});




async function dailyUpdate() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  const gameInfo = await fetchNbaGameInfo();

  if (gameInfo) {
    gameInfo.scoreboard.games.forEach((game) => {
      const homeTeamReaction = teamEmojis[game.homeTeam.teamName.toLowerCase()];
      const awayTeamReaction = teamEmojis[game.awayTeam.teamName.toLowerCase()];
      console.log(homeTeamReaction)

      const exampleEmbed = new EmbedBuilder()
        .setColor(0xed1000)
        .setURL(`https://www.nba.com/game/${game.gameId}`)
        .setTitle(`${game.homeTeam.teamName} vs ${game.awayTeam.teamName}`)
        .addFields({ name: `${game.homeTeam.teamName} Info`, value: `Wins: ${game.homeTeam.wins}   Losses: ${game.homeTeam.losses}`, inline: true })
        .addFields({ name: `${game.awayTeam.teamName} Info`, value: `Wins: ${game.awayTeam.wins}   Losses: ${game.awayTeam.losses}`, inline: true })
        .setImage(`https://cdn.nba.com/davinci/images/team-matchups/nba/latest/web/${game.homeTeam.teamTricode.toLowerCase()}-${game.awayTeam.teamTricode.toLowerCase()}/1200x628.png`)
        .setDescription(`Game Time: ${game.gameStatusText}`);

      channel.send({ embeds: [exampleEmbed] }).then(embedMessage => {
        embedMessage.react(homeTeamReaction); // React with home team name
        embedMessage.react(awayTeamReaction); // React with away team name
      });
    });
  }
}

async function fetchNbaGameInfo() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Failed to fetch NBA game info. Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching NBA game info:', error);
    return null;
  }
}

client.on('messageReactionAdd', (reaction, user) => {
  if (user.bot) return;

  // Handle reaction voting logic here
  // Check which emoji was reacted and take appropriate action
  // You might want to store user votes and calculate the winning team
});

client.login(TOKEN);
