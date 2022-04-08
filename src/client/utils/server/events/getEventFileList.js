import { getFileList } from "@utils/server/getFileList";

export async function getEventFileList() {
  return await getFileList("assets/data/events");
}
