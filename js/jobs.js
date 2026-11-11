export const JOBS = [
  {
    id: "JOB-104", type: "ARITHMETIC", priority: "Normal",
    instruction: "ADD R1, R2 → R3",
    description: "Add the values in R1 and R2, then store the result in R3.",
    stages: [
      {name:"Fetch", prompt:"What should happen at the Fetch Bench for this ADD instruction?", choices:["Read the instruction at the program counter from memory into the instruction register.","Add the values currently stored in R1 and R2.","Identify R1 and R2 as source registers and R3 as the destination."], correct:0, explanation:"Fetch retrieves the next instruction from memory using the address held by the program counter."},
      {name:"Decode", prompt:"What belongs at the Decode Desk?", choices:["Store the sum into R3.","Interpret the ADD opcode and identify R1, R2, and R3 as the required registers.","Retrieve the next instruction from memory."], correct:1, explanation:"Decode interprets the opcode and determines which operands and destination the instruction uses."},
      {name:"Execute", prompt:"What should happen in the Execute Bay?", choices:["Increment the program counter before reading memory.","Interpret the binary opcode as ADD.","Use the ALU to add R1 and R2 and write the result to R3."], correct:2, explanation:"Execute is where the ALU performs the requested arithmetic operation and writes the result."}
    ]
  },
  {
    id: "JOB-217", type: "MEMORY", priority: "High",
    instruction: "LOAD R4, [0x20]",
    description: "Load the value stored at memory address 0x20 into register R4.",
    stages: [
      {name:"Fetch", prompt:"How does the LOAD instruction begin?", choices:["Read the LOAD instruction itself from the address pointed to by the program counter.","Immediately read the data value at memory address 0x20.","Write the memory value into R4."], correct:0, explanation:"The processor must fetch the instruction itself before it can know that a LOAD is being requested."},
      {name:"Decode", prompt:"What should the control unit determine during Decode?", choices:["That the operation is LOAD, the destination is R4, and the referenced address is 0x20.","The final data value that will be stored in R4.","The next instruction after LOAD."], correct:0, explanation:"Decode identifies the LOAD opcode, destination register, and address information needed for execution."},
      {name:"Execute", prompt:"Which action completes this LOAD instruction?", choices:["Translate the opcode into a control decision.","Read the data at address 0x20 and place that value into R4.","Fetch the LOAD instruction from instruction memory again."], correct:1, explanation:"During Execute, the processor performs the requested memory access and updates the destination register."}
    ]
  },
  {
    id: "JOB-308", type: "LOGIC", priority: "Normal",
    instruction: "AND R5, R6 → R7",
    description: "Perform a bitwise AND on R5 and R6, storing the result in R7.",
    stages: [
      {name:"Fetch", prompt:"What belongs in Fetch for this logic instruction?", choices:["Perform the bitwise AND inside the ALU.","Read the AND instruction from memory using the program counter.","Determine that R5 and R6 are the two source registers."], correct:1, explanation:"Fetch is concerned with obtaining the instruction, regardless of instruction type."},
      {name:"Decode", prompt:"What should happen when the AND instruction is decoded?", choices:["Identify the AND opcode, source registers R5 and R6, and destination R7.","Write the final bitwise result into R7.","Read the next instruction from memory."], correct:0, explanation:"Decode figures out what operation is requested and which registers participate."},
      {name:"Execute", prompt:"What action belongs in Execute?", choices:["Use the ALU to perform the bitwise AND and write the result to R7.","Move the instruction bits into the instruction register.","Determine which opcode field represents AND."], correct:0, explanation:"The actual bitwise operation is performed during Execute."}
    ]
  },
  {
    id: "JOB-411", type: "MEMORY", priority: "Normal",
    instruction: "STORE R2, [0x40]",
    description: "Store the value in R2 into memory address 0x40.",
    stages: [
      {name:"Fetch", prompt:"What is the first CPU-cycle action for this STORE?", choices:["Write the contents of R2 to address 0x40.","Read the STORE instruction from memory using the program counter.","Identify R2 as the source register."], correct:1, explanation:"The STORE instruction must be fetched before the processor knows what operation to perform."},
      {name:"Decode", prompt:"What information is established during Decode?", choices:["The STORE opcode, source register R2, and target address 0x40.","The final value of the program counter after the next instruction.","The successful memory write itself."], correct:0, explanation:"Decode identifies the operation and the operands or address needed to carry it out."},
      {name:"Execute", prompt:"What completes the STORE ticket?", choices:["Place the value from R2 into memory location 0x40.","Interpret the opcode field as STORE.","Move the STORE instruction into the instruction register."], correct:0, explanation:"Execute performs the requested write to memory."}
    ]
  },
  {
    id: "JOB-523", type: "CONTROL", priority: "High",
    instruction: "BNE R1, R2, LOOP",
    description: "Branch to LOOP if the values in R1 and R2 are not equal.",
    stages: [
      {name:"Fetch", prompt:"How does this branch instruction enter the CPU cycle?", choices:["Compare R1 and R2 immediately.","Read the BNE instruction from memory at the current program-counter address.","Jump to LOOP before interpreting the instruction."], correct:1, explanation:"Even a branch starts by fetching the instruction from memory."},
      {name:"Decode", prompt:"What should Decode determine for BNE?", choices:["That BNE requires comparing R1 and R2 and may change control flow to LOOP.","Whether R1 and R2 are actually different.","The final program-counter value."], correct:0, explanation:"Decode identifies the branch operation, source registers, and target information."},
      {name:"Execute", prompt:"Which action belongs in Execute for BNE?", choices:["Read the BNE instruction from memory.","Interpret the register fields.","Compare R1 and R2 and update the program counter to LOOP if they are not equal."], correct:2, explanation:"Execute performs the comparison and applies the branch decision."}
    ]
  },
  {
    id: "JOB-636", type: "ARITHMETIC", priority: "Normal",
    instruction: "SUB R8, R3 → R8",
    description: "Subtract R3 from R8 and store the result back into R8.",
    stages: [
      {name:"Fetch", prompt:"What is the correct Fetch action?", choices:["Subtract R3 from R8.","Read the SUB instruction from memory using the program counter.","Identify the two input registers."], correct:1, explanation:"Fetch retrieves the encoded SUB instruction before any interpretation or calculation."},
      {name:"Decode", prompt:"What should happen during Decode?", choices:["Interpret SUB and identify R8 and R3 as operands, with R8 as the destination.","Perform the subtraction in the ALU.","Retrieve the instruction bits from memory."], correct:0, explanation:"Decode determines the operation and which registers the instruction refers to."},
      {name:"Execute", prompt:"What completes the SUB instruction?", choices:["Read another instruction from memory.","Use the ALU to subtract R3 from R8 and write the result back to R8.","Interpret the opcode field."], correct:1, explanation:"Execute performs the subtraction and stores the result."}
    ]
  }
];