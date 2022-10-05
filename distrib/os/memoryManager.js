var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(memoryAccessor = null, pid = 0) {
            this.memoryAccessor = memoryAccessor;
            this.pid = pid;
        }
        store(loadDataArray) {
            for (let i = 0; i < 3; i++) {
                let currentAddress = this.memoryAccessor.getAddress();
                this.memoryAccessor.setAddress(i * 0x100);
                if (this.memoryAccessor.getData() == 0x0) {
                    for (let arrayElemNum = 0; arrayElemNum < loadDataArray.length; arrayElemNum++) {
                        _MemoryAccessor.writeImmediate(arrayElemNum, parseInt(loadDataArray[arrayElemNum], 16));
                        console.log("INPUT");
                    }
                    this.memoryAccessor.setAddress(currentAddress);
                    break;
                }
            }
            return this.pid++;
        }
        run(commandPid) {
            _CPU.isExecuting = true;
            _CPU.PC = 0x00;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map