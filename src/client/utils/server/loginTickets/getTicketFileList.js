import { getFileList } from "@utils/server/getFileList";

export async function getTicketFileList() {
  return await getFileList("assets/data/login-tickets");
}
