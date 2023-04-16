import { prepareCache } from "./prepare";
import { Log } from "../utils/log";

prepareCache().then(() => Log.ready("Prepared AtlasAcademy API Cache"));
