/* ------------
   memoryAccessor.ts

   This virtual memory accessor "reads" and "writes" into "memory".
   ------------ */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor(address, lob, memory) {
            this.address = address;
            this.lob = lob;
            this.memory = memory;
        }
        /**
         * Sets the value in the address member
         */
        setAddress(address) {
            this.address = address;
        }
        /**
         * Returns the value in the address member
         */
        getAddress() {
            return this.address;
        }
        /**
         * Sets the low order bytes for the address
         * @param lob the value of the low order bytes
         */
        setLowOrderByte(lob) {
            this.lob = lob;
        }
        /**
         * Returns the low order bytes for the address
         */
        getLowOrderByte() {
            return this.lob;
        }
        /**
         * Takes in a memory object and sets the value of the MAR and MDR as given for it and then
         * write the data from the MDR into the address from MAR in memory
         * @param address the address that needs to be set into the MAR of the memory object
         * @param data the data that needs to be set into the MDR of the memory object
         */
        writeImmediate(address, data) {
            this.memory.setMAR(address);
            this.memory.setMDR(data);
            this.memory.write();
        }
        // Gets the data from Memory from the address specified in the address member
        getData() {
            this.memory.setMAR(this.getAddress());
            return this.memory.read();
        }
        /**
         * Sets the high order bytes (if it exists) for the address member
         * @param hob the value of the high order bytes
         */
        setHighOrderByte(hob) {
            this.setAddress(this.getLowOrderByte() + (hob * 0x100));
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map