const { createCanvas, loadImage } = require('canvas');

const numberOfRows = 65;
const canvas = createCanvas(65, 30);

//Three different ASCII texts to Use

//const asciiSymbols = "@%#+o=-";
//const asciiSymbols = ".'^-+?1*&%@$"
const asciiSymbols = " .-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@"

const numberOfC = asciiSymbols.length

const ctx = canvas.getContext('2d');

async function convertImage(fileName)
{
    const pixelString = [];
    const asciiText = [];

await loadImage('img/' + fileName).then((image) => {
    //Get Pixel Data From Image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //Convert Pixel Data from [R, G, B, Opacity] form to Brigthness form of [0-65025]
    for(let i = 0; i < imageData.data.length/4; i++)
    {
        //Imax = 65.025
        let j = i*4;

        const brigthness = (imageData.data[j] * 0.2126 * imageData.data[j+3]) + (imageData.data[j+1] * 0.7152 * imageData.data[j+3]) + (imageData.data[j+2] * 0.0722 * imageData.data[j+3]);

        pixelString.push(brigthness);
    }

    //Convert the brighness number to the ascii symbol
    for(let i = 0; i < pixelString.length; i++)
    {
        for(let j = 0; j < numberOfC; j++)
        {
            if(pixelString[i] <= ((65025/numberOfC) * (j+1)) && pixelString[i] > (j * (65025/numberOfC)) )
            {
                asciiText[i] = asciiSymbols[numberOfC - j];
            }else
            {
                continue;
            }
        }
    }
    //Add line breaker every row
    for(let i = 0; i < asciiText.length; i++)
    {
        if(i%numberOfRows==0)
        {
            asciiText[i] = '\r\n';
        }
    }

});

return asciiText.toString().replace(/\,/g,'');
}

module.exports = {convertImage};