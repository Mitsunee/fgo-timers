import { Log } from "~/utils/log";
import { prepareCache } from "./cache/cache";

prepareCache().then(() => Log.ready("Prepared AtlasAcademy API Cache"));
