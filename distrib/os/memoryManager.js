var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(memoryAccessor = null, pid = 0, memoryMap = new Object()) {
            this.memoryAccessor = memoryAccessor;
            this.pid = pid;
            this.memoryMap = memoryMap;
        }
        store(loadDataArray) {
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
        run(commandPid) {
            _CPU.isExecuting = true;
            _CPU.PC = 0x00;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map