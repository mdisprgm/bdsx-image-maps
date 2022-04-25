import { ActorUniqueID } from "bdsx/bds/actor";
import { Level } from "bdsx/bds/level";
import { CompoundTag } from "bdsx/bds/nbt";
import { TextPacket } from "bdsx/bds/packets";
import { Player } from "bdsx/bds/player";
import { pdb } from "bdsx/core";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { NativeClass } from "bdsx/nativeclass";
import { int32_t, void_t } from "bdsx/nativetype";
import { procHacker } from "bdsx/prochacker";
import * as fs from "fs";
import * as path from "path";
import { MapItemSavedData } from "./map-data";

export const IMAGE_PATH = path.join(process.cwd(), "../images");

export class LevelStorage extends NativeClass {}

if (!fs.existsSync(IMAGE_PATH)) fs.mkdirSync(IMAGE_PATH);
pdb.setOptions(0);

MapItemSavedData.prototype.save = procHacker.js("?save@MapItemSavedData@@QEAAXAEAVLevelStorage@@@Z", void_t, { this: MapItemSavedData }, LevelStorage);
MapItemSavedData.prototype.setPixel = procHacker.js("?setPixel@MapItemSavedData@@QEAAXIII@Z", void_t, { this: MapItemSavedData }, int32_t, int32_t, int32_t);
MapItemSavedData.prototype.setLocked = procHacker.js("?setLocked@MapItemSavedData@@QEAAXXZ", void_t, { this: MapItemSavedData });
MapItemSavedData.prototype.getMapId = procHacker.js("?getParentMapId@MapItemSavedData@@QEBA?AUActorUniqueID@@XZ", ActorUniqueID, { this: MapItemSavedData });

export const _getLevelStorage = procHacker.js("?getLevelStorage@Level@@UEBAAEBVLevelStorage@@XZ", LevelStorage, null, Level);
export const getMapData = procHacker.js("?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z", MapItemSavedData, null, Level, CompoundTag);

export function getLevel(): Level {
    return bedrockServer.level;
}

export function getLevelStorage(): LevelStorage {
    return _getLevelStorage(getLevel());
}

export function sendMessage(player: Player, message: string, type: TextPacket.Types = 1): void {
    const pk = TextPacket.allocate();
    pk.type = type;
    pk.message = message;
    player.sendPacket(pk);
    pk.dispose();
}

events.serverOpen.on(() => {
    require("./command");
});
