module TSOS {
    export class PCB {

        constructor(public blocks: number[][] = new Array()) {
        }

        public addBlock (CPU: TSOS.Cpu): void {
            this.blocks.push([CPU.PC, CPU.IR, CPU.acc, CPU.xReg, CPU.yReg, CPU.zFlag, CPU.step, CPU.brkFlag]);
        }

        public getBlock (CPU: TSOS.Cpu): void {
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
}