# notion-query
<br /><br />
_Navigate your Notion by asking questions and getting contextual responses._
<br /><br /><br />

![demo final full 30fps cropped](https://github.com/corneliusrenken/notion-query/assets/101947579/35fab86b-6ac0-4736-9d91-8bf80155b1f0)


## How It Works
- Initially, all your [Notion](https://www.notion.so/) pages are embedded using [ADA](https://platform.openai.com/docs/models/embeddings) (an OpenAI model) and stored in a [Pinecone](https://www.pinecone.io/) vector database.
- Your query is embedded, turned into a vector, and retrieves contextually relevant pages from the database.
- Finally, [GPT-4](https://platform.openai.com/docs/models/gpt-4) (another OpenAI model) is asked to answer your query using only the retrieved pages as context.

## Planned Features
- Support more Notion block types.
    - Currently, only the basic text-based blocks are supported. Notion-embedded databases and tables are not, for example.
- User interface displaying out-of-sync pages and the ability to re-sync them.
- Allow to load another set of relevant pages, not considering previously used ones, to try and find more responses.

## How To Use
_**Disclaimer:** The app does not yet support a 100% user-friendly UI and requires you to make changes in the code to work!_
<br />
1. Notion
    1. [Create a Notion integration.](https://www.notion.so/help/create-integrations-with-the-notion-api#create-an-internal-integration)
    2. The only necessary capabilities are **Read Content**. You will later need the **Internal Integration Secret**.
    3. In Notion, navigate to the topmost page you want to share (including all of its sub-pages). In the page's menu, [add the connection.](https://www.notion.so/help/add-and-manage-connections-with-the-api#add-connections-to-pages)
2. Pinecone
    1. [Create a project.](https://docs.pinecone.io/docs/create-project)
    2. In the project's API Keys menu, you will later need the default key's **Value** and **Environment**.
3. OpenAI
    1. [Navigate to your OpenAI API keys](https://platform.openai.com/account/api-keys).
    2. Create a new key, and copy the **Secret**.
4. Open the project in your code editor, duplicate the file `.env.example`, rename it to `.env`, and fill in the previously collected values.
5. In `routes/api/response/+server.ts`, uncomment the line of code containing `await reindexAllPages(emit, true);`.
    - This step will make the application create an index in your Pinecone database and store all your pages when running a query. **For future queries, make sure that you comment out the line again** or only run the function with false as the second argument to only re-index your pages.
6. Use `npm install` to install all dependencies.
7. Start and open the application using `npm run dev -- --open`.
8. You should now be able to query away! Let me know if you run into any issues.
