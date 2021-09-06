import { join } from "path";
import { readdir } from "fs/promises";

export async function getTicketFileList() {
  const ticketDir = join(process.cwd(), "assets/data/login-tickets");
  const ticketFileList = await readdir(ticketDir);
  const ticketFileListJoined = ticketFileList.map(ticketFile =>
    join(ticketDir, ticketFile)
  );

  return ticketFileListJoined;
}
