import redisClient from "../utils/config/redisClient.js"

export async function deleteKeysByPattern(pattern) {
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redisClient.scan(cursor, "MATCH", pattern, "COUNT", 100);
    cursor = nextCursor;
    if (keys.length > 0) {
      console.log(`Deleting keys:`, keys);
      await redisClient.del(...keys);
    }
  } while (cursor !== "0");
}
