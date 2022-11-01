/* ------------
   PCB.ts

   Contains the class for the PCB for each process
   ------------ */
var TSOS;
(function (TSOS) {
    class PCB {
        constructor(pid, baseRegister, limitRegister, state, pc = 0x000, ir = 0x00, acc = 0x00, xReg = 0x00, yReg = 0x00, zFlag = 0x0, step = 0x0, brkFlag = 0x0, carryFlag = 0x0) {
            this.pid = pid;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
            this.state = state;
            this.pc = pc;
            this.ir = ir;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.step = step;
            this.brkFlag = brkFlag;
            this.carryFlag = carryFlag;
        }
        /**
         * Saves all the data from the CPU into the PCB
         * @param CPU
         */
        saveContext(CPU) {
            this.pc = CPU.PC;
            this.ir = CPU.IR;
            this.acc = CPU.acc;
            this.xReg = CPU.xReg;
            this.yReg = CPU.yReg;
            this.zFlag = CPU.zFlag;
            this.step = CPU.step;
            this.brkFlag = CPU.brkFlag;
            this.carryFlag = CPU.carryFlag;
            this.state = "Running";
        }
        /**
         * Gives back the context to the CPU from the PCB
         * @param CPU
         */
        getContext(CPU) {
            CPU.PC = this.pc;
            CPU.IR = this.ir;
            CPU.acc = this.acc;
            CPU.xReg = this.xReg;
            CPU.yReg = this.yReg;
            CPU.zFlag = this.zFlag;
            CPU.step = this.step;
            CPU.brkFlag = this.brkFlag;
            CPU.carryFlag = this.carryFlag;
            this.state = "Running";
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map