import getIndex from './getIndex';

export default async function deleteAllIndices() {
  const index = await getIndex();
  await index.delete1({
    deleteAll: true,
  });
}
