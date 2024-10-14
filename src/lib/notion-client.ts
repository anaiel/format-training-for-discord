import { PUBLIC_NOTION_API_KEY } from '$env/static/public';
import { Client } from '@notionhq/client';

const notion = new Client({
	auth: PUBLIC_NOTION_API_KEY
});
export default notion;
