var TSOS;
(function (TSOS) {
    class PCB {
        constructor(blocks = new Array()) {
            this.blocks = blocks;
        }
        addBlock(CPU) {
            this.blocks.push([CPU.PC, CPU.IR, CPU.acc, CPU.xReg, CPU.yReg, CPU.zFlag, CPU.step, CPU.brkFlag]);
        }
        getBlock(CPU) {
            let previousBlock = this.blocks.pop();
            CPU.PC = previousBlock[0];
            CPU.IR = previousBlock[1];
            CPU.acc = previousBlock[2];
            CPU.xReg = previousBlock[3];
            CPU.yReg = previousBlock[4];
            CPU.zFlag = previousBlock[5];
            CPU.step = previousBlock[6];
            CPU.brkFlag = previousBlock[7];
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map