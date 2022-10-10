var TSOS;
(function (TSOS) {
    class PCB {
        constructor(pid, baseRegister, limitRegister, pc = 0x000, ir = 0x00, acc = 0x00, xReg = 0x00, yReg = 0x00, zFlag = 0x0, step = 0x0, brkFlag = 0x0, state = "") {
            this.pid = pid;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
            this.pc = pc;
            this.ir = ir;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.step = step;
            this.brkFlag = brkFlag;
            this.state = state;
        }
        saveContext(CPU) {
            this.pc = CPU.PC;
            this.ir = CPU.IR;
            this.acc = CPU.acc;
            this.xReg = CPU.xReg;
            this.yReg = CPU.yReg;
            this.zFlag = CPU.zFlag;
            this.step = CPU.step;
            this.brkFlag = CPU.brkFlag;
            this.state = "Ready";
        }
        getContext(CPU) {
            CPU.PC = this.pc;
            CPU.IR = this.ir;
            CPU.acc = this.acc;
            CPU.xReg = this.xReg;
            CPU.yReg = this.yReg;
            CPU.zFlag = this.zFlag;
            CPU.step = this.step;
            CPU.brkFlag = this.brkFlag;
            this.state = "Running";
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map