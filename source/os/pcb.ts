module TSOS {
    export class PCB {
        constructor(
                    public brkFlag: number = 0x0,
                    public step: number = 0x0,
                    public IR: number = 0x00,
                    private carryFlag: number = 0x0,
                    public PC: number = 0x00,
                    public acc: number = 0x00,
                    public xReg: number = 0x00,
                    public yReg: number = 0x00,
                    public zFlag: number = 0x0) {
        }
    }
}