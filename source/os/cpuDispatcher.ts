/* ------------
   memoryManager.ts

   This virtual memory manager "allocates" and "deallocates" storage in memory..
   ------------ */
module TSOS {
    export class CpuDispatcher {
        constructor(public dispatcher: boolean = true) {
        }

        public switchContext() {
            readyQueue[0].saveContext(_CPU);
            readyQueue.push(readyQueue.shift());
            readyQueue[0].getContext(_CPU);
        }
    }
}