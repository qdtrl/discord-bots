const { Client, Intents, MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ] });

const author = { 
  name: 'The One and Only God',
  iconUrl: "https://www.flaticon.com/premium-icon/icons/svg/3387/3387223.svg",
  url: "https://github.com/qdtrl"
}

const embedHelp = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle("Liste des commandes du bot pour la musique")
  .setAuthor(author)
  .setDescription('Enjoy le groove maggle !')
  .addField("!help", "Afficher l'aide")
  .addField("!play https://www.youtube.com/", "Pour jouer le lien")
  .addField("!next", "Comme sur l'appli pour le sexe")
  .addField("!pause", "Pour faire pause KISS")
  .addField("!resume", "Reprendre en francais")
  .addField("!stop", "Bah lis enfaite")


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const links = [];

client.on('messageCreate', message => {
  const { content, channel, author, member } = message;

  if(author.bot) return;

  if(content === '!help')
    channel.send({ embeds: [embedHelp]});

  if(member.voice.channel) {
    if(content.startsWith('!play')) {
      let link = content.split(" ")[1];

      if(link == undefined || !link.startsWith("https://www.youtube.com/"))
        message.reply("Mauvais lien de video");
      else {
          list.push(link);
          message.reply("Video ajoute à la liste");
          member.voice.channel.join().then(connection => {
            playMusic(connection);
            connection.on("disconnect", () => {
              links = [];
            })
          }).catch(error => {
            message.replay("Erreur lors de la connexion : " + error);
          })
        }
      }
    }

    if(content.indexOf('!stop') === 0) 
      process.exit()
     
});

const playMusic = (connection) => {
  let dispatcher = connection.play(ytdl(links[0], {quality: "highestaudio"}))

  dispatcher.on("finish", () => {
    links.shift();
    dispatcher.destroy();

    if(links.length > 0)
      playMusic(connection);
    else
      connection.disconnect();
  })

  dispatcher.on("error", error => {
    console.log("Dispatch Error : " + error);
    dispatcher.destroy()
    connection.disconnect()
  })
}
client.login('');