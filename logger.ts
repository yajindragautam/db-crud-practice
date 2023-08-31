import moment  from 'moment';
import {Connect} from './src/db/db';

export async function error(description: string, message: string, userId: number = 0, domainId: number = 0){
    // DBLog(description, message, 'E', userId, domainId);
    ConsoleLog( description, message, 'E', userId, domainId);
};

async function ConsoleLog(description: string, message: string, severity: string, userId: number = 0, domainId: number = 0)
{
    var logText = moment().format('YYYY-MM-DD HH:mm:ss') + " :" + severity + ", Domain:" + domainId +  ", User:" + domainId + ", Desc:" + description +  ", Msg:\n" + message;
    console.log(logText);
}
