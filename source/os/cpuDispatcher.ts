/* ------------
   cpuDispatcher.ts

   Performs the context switch when called by the CPU Scheduler
   ------------ */
module TSOS {
    export class CpuDispatcher {
        constructor() {
        }

        /**
         * Performs the context switch in the readyQueue
         */
        public switchContext() {

            // If the current process is still running, puts it at the back if the ready queue
            if (readyQueue[0].state !== "Terminated") {
                readyQueue[0].saveContext(_CPU);
                readyQueue[0].state = "Ready";
                readyQueue.push(readyQueue.shift());

                // If process is in disk, brings it to memory
                if(readyQueue[0].location == "Disk") {
                    _MemoryManager.swap(readyQueue[0].pid, readyQueue[readyQueue.length - 1].pid);
                    readyQueue[0].location = "Memory";
                    readyQueue[readyQueue.length - 1].location = "Disk";
                }

                readyQueue[0].getContext(_CPU);
                readyQueue[0].state = "Running";
                _MemoryManager.executingPid = readyQueue[0].pid;
            }
            else {
                // Once the process is terminated, the process is removed from the readyQueue and the block
                // in memory where it is stored becomes available
                let terminatedProcess = readyQueue.shift();

                // Returns wait and turnaround time once the processes have terminated
                _StdOut.putText
                ("Process " + terminatedProcess.pid + " is terminated.");
                _StdOut.advanceLine();
                _StdOut.putText
                ("Wait Time: " + waitAndTurnaroundTimeTable[terminatedProcess.pid.toString()][0]);
                _StdOut.advanceLine();
                _StdOut.putText
                ("Turnaround Time: " + waitAndTurnaroundTimeTable[terminatedProcess.pid.toString()][1]);
                _StdOut.advanceLine();
                _StdOut.putText("> ");

                // Pushes the PID of the terminated process into the terminatedList so that we know it was terminated
                // when "ps" is called in the shell

                _MemoryManager.terminateProcess(terminatedProcess.pid);
            }
        }

        /**
         * Gets the first item in the readyQueue into the CPU
         */
        public startRunning() {
            readyQueue[0].state = "Running";
            readyQueue[0].getContext(_CPU);
            _MemoryManager.executingPid = readyQueue[0].pid;
        }
    }
}