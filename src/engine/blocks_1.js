const Blocks = require('./blocks');

/**
 * @fileoverview
 * Store and mutate the VM block representation,
 * and handle updates from Scratch Blocks events.
 */

class iBlocks extends Blocks{
    constructor(optNoGlow) {
        super(optNoGlow);
        // 增加一个属性
        this.disabled = false;
    }

    /**
     * Get block disabled.
     * @param {?object} block The block to query.
     * @return {boolean} 
     */
    isDisabled(block) {
        return (typeof block === 'undefined') ? false : block.disabled;
    }

    /**
     * Block management: change block field values
     * @param {!object} args Blockly change event to be processed
     * @param {?Runtime} optRuntime Optional runtime to allow changeBlock to change VM state.
     */
    // override
    changeBlock(args, optRuntime) {
        super.changeBlock(args, optRuntime);
        // Validate disabled attribute
        if (['disabled'].indexOf(args.element) === -1) return;
        const block = this._blocks[args.id];
        if (typeof block === 'undefined') return;

        if (args.element === 'disabled') {
            block.disabled = args.value;
        }
    }

    /**
     * Recursively encode an individual block and its children
     * into a Blockly/scratch-blocks XML string.
     * @param {!string} blockId ID of block to encode.
     * @return {string} String of XML representing this block and any children.
     */
    blockToXML(blockId) {
        const block = this._blocks[blockId];

        // 未知块处理
        if (!block) {
            return '';
        }
        // 已删除块
        if (block.deleted) {
            return block.next ? this.blockToXML(block.next) : '';
        }
        return super.blockToXML(blockId);
    }
}

module.exports = iBlocks;
