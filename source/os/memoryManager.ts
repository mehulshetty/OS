/* ------------
   memoryManager.ts

   This virtual memory manager "allocates" and "deallocates" storage in memory..
   ------------ */
module TSOS {
    export class MemoryManager {

        constructor (public memoryAccessor: TSOS.MemoryAccessor = null,
                     public pid = 0,
                     public memoryMap: Object = new Object(),
                     public executingPid = 0x0) {
        }

        /**
         * Stores incoming data memory
         * @param loadDataArray the data to be stored in memory
         */
        public store(loadDataArray: string[]): number {

                let currentAddress = this.memoryAccessor.getAddress();

                this.memoryAccessor.setAddress(0 * 0x100);

                for (let arrayElemNum = 0; arrayElemNum < 0x100; arrayElemNum++) {
                    _MemoryAccessor.writeImmediate(arrayElemNum, 0x00);
                }

                for (let arrayElemNum = 0; arrayElemNum < loadDataArray.length; arrayElemNum++) {
                    _MemoryAccessor.writeImmediate(arrayElemNum, parseInt(loadDataArray[arrayElemNum], 16));
                    console.log("INPUT");
                }
                this.memoryAccessor.setAddress(currentAddress);

                // TODO: Implement an actual way to map PIDs to their location within memory
                this.memoryMap[0] = this.pid;

            return this.pid++;
        }

        /**
         * Begins executing a program in the CPU
         * @param commandPid the pid of the command to be executed
         */
        public run (commandPid: number) {
            this.executingPid = commandPid;

            _CPU.isExecuting = true;
            _CPU.PC = 0x00;
        }
    }
}