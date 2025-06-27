import { error } from 'console';
import {Log} from './log';

async function test() {
    try{
        await Log('backend','error','handler','recervied string, expected bool');
    }
    catch(error){
        console.error('Test failde:',error);
    }
}
test();