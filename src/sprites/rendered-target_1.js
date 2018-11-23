const RenderedTarget = require('./rendered-target');
const MathUtil = require('../util/math-util');
/**
 * Rendered target: instance of a sprite (clone), or the stage.
 */
class IRenderedTarget extends RenderedTarget {
    /**
     * @param {!Sprite} sprite Reference to the parent sprite.
     * @param {Runtime} runtime Reference to the runtime.
     * @constructor
     */
    constructor (sprite, runtime) {
        super(sprite, runtime); // 继承

        /**
         * 设备角色 Id，一般是用设备名作为此 id
         * @type {string}
         */
        this.deviceId = null;

        /**
         * 角色编辑状态
         * @type {boolean}
         */
        this.isEditing = false;
    }

    /**
     * 设备角色特有的方法，判断是否为设备
     * @return {boolean}
     */
    isDevice () {
        return this.deviceId && this.isOriginal;
    }
    /**
     * Make a clone, copying any run-time properties.
     * If we've hit the global clone limit, returns null.
     * @return {RenderedTarget} New clone.
     */
    // override
    makeClone () {
        const newClone = super.makeClone();
        if (newClone) {
            // 增加 deviceId 属性
            newClone.deviceId = this.deviceId;
        }
        return newClone;
    }

    /**
     * Make a duplicate using a duplicate sprite.
     * @return {RenderedTarget} New clone.
     */
    // override
    duplicate () {
        return super.duplicate().then(newTarget => {
            newTarget.deviceId = this.deviceId;
            return newTarget;
        });
    }

    /**
     * Initialize the audio player for this sprite or clone.
     */
    initAudio () {
    }

    /**
     * Set the current costume.
     * @param {number} index New index of costume.
     */
    setCostume (index) {
        // Keep the costume index within possible values.
        index = Math.round(index);
        if ([Infinity, -Infinity, NaN].includes(index)) index = 0;
        this.currentCostume = MathUtil.wrapClamp(
            index, 0, this.sprite.costumes.length - 1
        );
        if (this.renderer) {
            const costume = this.getCostumes()[this.currentCostume];
            const drawableProperties = {
                skinId: costume.skinId,
                costumeResolution: costume.bitmapResolution
            };
            if (
                typeof costume.rotationCenterX !== 'undefined' &&
                typeof costume.rotationCenterY !== 'undefined'
            ) {
                // 多加一个对 svg 的 scale 的设定
                const scale = costume.bitmapResolution || ((costume.dataFormat && costume.dataFormat === 'svg') ? 1 : 2);
                drawableProperties.rotationCenter = [
                    costume.rotationCenterX / scale,
                    costume.rotationCenterY / scale
                ];
            }
            this.renderer.updateDrawableProperties(this.drawableID, drawableProperties);
            if (this.visible) {
                this.emit(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, this);
                this.runtime.requestRedraw();
            }
        }
        this.runtime.requestTargetsUpdate(this);
    }

    /**
     * Update all drawable properties for this rendered target.
     * Use when a batch has changed, e.g., when the drawable is first created.
     */
    // override
    updateAllDrawableProperties () {
        if (this.renderer) {
            // 设备角色可能没有造型
            if (!this.sprite.costumes || this.sprite.costumes.length === 0) return;
            super.updateAllDrawableProperties();
        }
    }

    /**
     * Serialize sprite info, used when emitting events about the sprite
     * @returns {object} Sprite data as a simple object
     */
    // override
    toJSON () {
        const json = super.toJSON();
        json.deviceId = this.deviceId;
        json.isEditing = this.runtime._editingTarget === this;
        return json;
    }

    /**
     * Dispose, destroying any run-time properties.
     */
    // override
    dispose () {
        // fix: 删除变量
        for (const key in this.variables) {
            this.deleteVariable(key);
        }
        super.dispose();
        // TODO: fix 关闭声音
    }
}

module.exports = IRenderedTarget;
