const Discord = require('discord.js');

const client = new Discord.Client();

const configs = {
  prefix: '!',
  token: 'token of bot',
  separator: '--' // info separator used in command. Choose something isn't includind in command name
};

client.on('message', (message) => {
  const prefix = configs.prefix;
  
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var args = message.content.slice(prefix.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();
  
  if (commandName === 'channel-create') {
    if (!message.guild) return message.channel.send(`:x: | You can't run this command in direct messages`);
    if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send(`:x: | You haven't the \`manage channels\` permission`);
    
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.channel.send(`:x: | I haven't the \`manage channels\` permission`);
    if (message.guild.channels.cache.size === 500) return message.channel.send(`:x: | There are 500 channels and it is the max.`);
    
    const array = args.join(' ').split(configs.separator);
    if (array.length !== 3) return message.channel.send(`:x: | There is too much infos or missing informations.\nTry this : \`${configs.prefix}channel-create name --type (text, voice or parent) --id of category (optionnal, let other thing than an id for no category)\``);
    
    const name = array[0];
    const type = array[1];
    const parentID = array[2];
    
    if (type !== ('text' || 'voice' || 'parent')) return message.channel.send(`:x: | The type **must** be \`text\`, \`voice\` **or** \`parent\``); 
    
    const parent = message.guild.channels.cache.find((channel) => channel.type === 'parent' && channel.id === parentID);
    message.guild.channels.create(name, {
      type: type;
    }).then((channel) => {
      if (parent && !type === 'parent') {
        channel.setParent(parent);
      };
      message.channel.send(`:white_check_mark: | Succesfully created <#${channel.id}>`);
      channel.send(new Discord.MessageEmbed()
        .setTitle("Channel created")
        .setTimestamp()
        .setDescription(`Channel created by <@${message.author.id}.`)
        .setFooter('Powered by Greensky-gs on github')
        .setURL('https://github.com/Greensky-gs/create-channel')
      ).catch(() => {});
    });
  }
});

client.login(configs.token);
