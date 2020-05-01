
import AWS from "aws-sdk"
import {SinusBot} from "@support-pp/sinusbot-ts"


require('dotenv').config()
const s3 = new AWS.S3({
    region: process.env.AWS_REGSION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
};


(async () => {

    const port = process.env.SINUSBOT_PORT as string;
    const bot = new SinusBot(process.env.SINUSBOT_HOST as string, +port)
    const botStatus = await bot.login({
        username: process.env.SINUSBOT_USERNAME as string, 
        password: process.env.SINUSBOT_PASSWORD as string})
    if (botStatus.success != true){
        throw console.error("The sinusbot credentials wrong.");
        
    }
    console.log(`> Starting sync client. Bucket ${process.env.AWS_BUCKET_NAME}`)
    const data = await s3.listObjects(params).promise();
    console.log(`   > Connection to SinusBot <${process.env.SINUSBOT_HOST}:${port}> success!` )
    data.Contents?.map(async obj=>{
        const key = obj.Key?.split('/') as string[];
   
        if (typeof obj.Key =='string'){
            if (key?.length-1 > 0){
                for (var i = 1; i < key?.length; i++) {
                        await bot.createAudioFile({
                            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGSION}.amazonaws.com/${obj.Key}`,
                            title: key[i],
                        })
                        console.log(`       (+) ${key[i]}`)
                  }
            }
        }
    })

})();

   