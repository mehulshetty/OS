/* ------------
   memoryManager.ts

   This virtual memory manager "allocates" and "deallocates" storage in memory..
   ------------ */
var TSOS;
(function (TSOS) {
    class CpuDispatcher {
        constructor(dispatcher = true) {
            this.dispatcher = dispatcher;
        }
        switchContext() {
            readyQueue[0].saveContext(_CPU);
            readyQueue.push(readyQueue.shift());
            readyQueue[0].getContext(_CPU);
        }
    }
    TSOS.CpuDispatcher = CpuDispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuDispatcher.js.map