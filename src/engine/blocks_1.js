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
        // case 'field':
        // const targets = optRuntime.targets;
        // const prevValue = block.fields[args.name].value;
        // if (variable) {
        //     block.fields[args.name].value = variable.name;
        //     block.fields[args.name].id = args.value;
        // } else {
        //     // Modified by Kane
        //     targets.forEach(target => {
        //         const blocks = target.blocks._blocks;
        //         for (let id in blocks) {
        //             if (blocks[id].fields[args.name] && blocks[id].fields[args.name].value === prevValue) {
        //                 blocks[id].fields[args.name].value = args.value;
        //             }
        //         }
        //     });
        // }
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
