import * as dotenv from 'dotenv';
dotenv.config();
import axios, { AxiosError } from 'axios';

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

export async function Log(stack: string, level: string, pkg: string, message: string): Promise<void> {
    console.log('ACCESS_TOKEN:', process.env.ACCESS_TOKEN); // Debug line
    const validStacks = ['backend', 'frontend'];
    const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    const validPackages = [
        'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
        'auth', 'config', 'middleware', 'utils'
    ];

    if (!validStacks.includes(stack)) throw new Error('Invalid stack');
    if (!validLevels.includes(level)) throw new Error('Invalid level');
    if (!validPackages.includes(pkg)) throw new Error('Invalid package');

    try {
        const response = await axios.post(
            LOG_API_URL,
            {
                stack,
                level,
                package: pkg,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );
        console.log('Log created:', response.data);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Error logging to server:', error.response?.data || error.message);
        } else if (error instanceof Error) {
            console.error('Error logging to server:', error.message);
        } else {
            console.error('Error logging to server: Unknown error');
        }
    }
}