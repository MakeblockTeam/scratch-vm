function handleDeleteMonitors(projectJson) {
    if (projectJson.monitors, length) {
        projectJson.monitors = [];
    }
}

// 处理积木块参数大小写问题
function handleBlocksParamsCase(targets, name, opcode, fieldsParams) {
    if (!targets instanceof Array || !targets.length) return null;
    for (let i = 0; i < targets.length; i += 1) {
        const currentTargets = targets[i];
        if (targets[i].name === name) {
            const { blocks } = currentTargets;
            Object.keys(blocks).forEach((key) => {
                const currentBlockContent = blocks[key];
                if (currentBlockContent.opcode === opcode) {
                    const { fields } = currentBlockContent;
                    if (!Object.keys(fields).length) return null;
                    fields[fieldsParams][0] = fields[fieldsParams][0].toUpperCase()
                }
            })
        }
    }
    return targets;
}

export {
    handleDeleteMonitors,
    handleBlocksParamsCase
};