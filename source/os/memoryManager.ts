module TSOS {
    export class MemoryManager {

        constructor (public memoryAccessor: TSOS.MemoryAccessor = null,
                     public pid = 0,
                     public memoryMap: Object = new Object()) {
        }

        public store(loadDataArray: string[]): number {
            //for(let i = 0; i < 3; i++) {
                let currentAddress = this.memoryAccessor.getAddress();
                this.memoryAccessor.setAddress(0 * 0x100);
                for (let arrayElemNum = 0; arrayElemNum < 0x100; arrayElemNum++) {
                    _MemoryAccessor.writeImmediate(arrayElemNum, 0x00);
                }
                // if (this.memoryAccessor.getData() == 0x0) {
                    for (let arrayElemNum = 0; arrayElemNum < loadDataArray.length; arrayElemNum++) {
                        _MemoryAccessor.writeImmediate(arrayElemNum, parseInt(loadDataArray[arrayElemNum], 16));
                        console.log("INPUT");
                    }
                    this.memoryAccessor.setAddress(currentAddress);
                // }
                this.memoryMap[0] = this.pid;
            //}

            return this.pid++;
        }

        public run (commandPid: number) {
            _CPU.isExecuting = true;
            _CPU.PC = 0x00;
        }
    }
}