const StringUtil = require('../util/string-util');
const log = require('../util/log');
const DEFAULT_SOUND_ASSETID = '83a9787d4cb6f3b7632b4ddfebf74367.wav';

/**
 * Initialize a sound from an asset asynchronously.
 * @param {!object} sound - the Scratch sound object.
 * @property {string} md5 - the MD5 and extension of the sound to be loaded.
 * @property {Buffer} data - sound data will be written here once loaded.
 * @param {!Asset} soundAsset - the asset loaded from storage.
 * @param {!Runtime} runtime - Scratch runtime, used to access the storage module.
 * @returns {!Promise} - a promise which will resolve to the sound when ready.
 */
const loadSoundFromAsset = function (sound, soundAsset, runtime) {
    sound.assetId = soundAsset.assetId;
    return runtime.audioEngine.decodeSound(Object.assign(
        {},
        sound,
        {data: soundAsset.data}
    )).then(soundId => {
        sound.soundId = soundId;
        return sound;
    });
};

/**
 * Load a sound's asset into memory asynchronously.
 * @param {!object} sound - the Scratch sound object.
 * @property {string} md5 - the MD5 and extension of the sound to be loaded.
 * @property {Buffer} data - sound data will be written here once loaded.
 * @param {!Runtime} runtime - Scratch runtime, used to access the storage module.
 * @returns {!Promise} - a promise which will resolve to the sound when ready.
 */
const loadSound = function (sound, runtime) {
    if (!runtime.storage) {
        log.error('No storage module present; cannot load sound asset: ', sound.md5);
        return Promise.resolve(sound);
    }
    if (!runtime.audioEngine) {
        log.error('No audio engine present; cannot load sound asset: ', sound.md5);
        return Promise.resolve(sound);
    }

    // modified by Hyman: 处理默认音频 md5
    if (sound.md5.length < 36) {
        sound.md5 = DEFAULT_SOUND_ASSETID;
    }

    const idParts = StringUtil.splitFirst(sound.md5, '.');
    const md5 = idParts[0];
    const ext = idParts[1].toLowerCase();
    return runtime.storage.load(runtime.storage.AssetType.Sound, md5, ext)
        .then(soundAsset => {
            sound.dataFormat = ext;
            return loadSoundFromAsset(sound, soundAsset, runtime);
        });
};

module.exports = {
    loadSound,
    loadSoundFromAsset
};
