import { Log } from "~/utils/log";
import { prepareCache } from "./prepare";

prepareCache().then(() => Log.ready("Prepared AtlasAcademy API Cache"));
