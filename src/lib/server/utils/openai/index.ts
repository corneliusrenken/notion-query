import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_SECRET } from '$env/static/private';

const configuration = new Configuration({ apiKey: OPENAI_SECRET });

const openai = new OpenAIApi(configuration);

export default openai;
