module TSOS {
    export class MemoryManager {

        constructor (public memoryAccessor: TSOS.MemoryAccessor = null,
                     public pid = 0) {
        }

        public store(loadDataArray: string[]): number {
            for(let i = 0; i < 3; i++) {
                let contextAddress = this.memoryAccessor.getAddress();
                this.memoryAccessor.setAddress(i * 0x100);
                if(this.memoryAccessor.getData() == 0x0) {
                    for (let arrayElemNum = 0; arrayElemNum < loadDataArray.length; arrayElemNum++) {
                        _MemoryAccessor.writeImmediate(arrayElemNum, parseInt(loadDataArray[arrayElemNum], 16));
                        console.log("INPUT");
                    }
                    break;
                }
            }

            return this.pid++;
        }

        public run (commandPid: number) {
            _CPU.isExecuting = true;
            _CPU.PC = 0x100 * commandPid;
        }
    }
}