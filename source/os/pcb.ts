module TSOS {
    export class PCB {

        constructor(public pid: number,
                    public baseRegister: number,
                    public limitRegister: number,
                    public pc: number = 0x000,
                    public ir: number = 0x00,
                    public acc: number = 0x00,
                    public xReg: number = 0x00,
                    public yReg: number = 0x00,
                    public zFlag: number = 0x0,
                    public step: number = 0x0,
                    public brkFlag: number = 0x0,
                    public state: string = ""
                    ) {
        }

        public saveContext (CPU: TSOS.Cpu): void {
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

        public getContext (CPU: TSOS.Cpu): void {
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
}