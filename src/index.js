const {convertImage} = require('./convertToASCII.js');
const {Client, Events, IntentsBitField, Attachment} = require('discord.js');
const fs = require('fs');
const download = require('image-downloader');

//Discord Character Limit = 2000 
//So Maximum Number of Pixels = 2000. Since its in a matrix, that would be [44][44]

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent

    ]
})

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    
    client.user.setActivity({
        name: "Images into ASCII"
    })
});

async function getConvertedImage(fileName) {
    const asciiText = await convertImage(fileName);
    //console.log(asciiText);
    return asciiText;
}

client.on("messageCreate", async (msg)=>{
    if(msg.content.startsWith('!~') && !msg.author.bot)
    {
        const msgContent = msg.content.substring(2, msg.content.length);
        msg.attachments.forEach(async a => {
        //Separate file type
        const extension = a.name.split(".").pop();
        //Check if its image
        if (["jpg", "jpeg", "png"].includes(extension)) {
            console.log(a.url, a.name);
            const text = await downloadImage(a.url, a.name);
            msg.reply("`" + text + "`");
        }else{
            msg.reply("Not a Image");
        }
        
        });
        
    }
});

//Download Image
async function downloadImage(urlT, filepath) {
    await download.image({
       url: urlT,
       dest: "../../img/" + filepath
    });
    const asciiText = await getConvertedImage(filepath);
    return asciiText;
}

client.login(/*Token goes here */);
