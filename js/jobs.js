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
  },
  {
    id: "JOB-742", type: "LOGIC", priority: "Normal",
    instruction: "OR R2, R9 → R10",
    description: "Perform a bitwise OR on R2 and R9, storing the result in R10.",
    stages: [
      {name:"Fetch", prompt:"What should happen first for this OR instruction?", choices:["Read the OR instruction from memory using the program counter.","Perform the OR operation in the ALU.","Identify R2 and R9 as the source registers."], correct:0, explanation:"Fetch brings the encoded OR instruction into the processor before any interpretation or calculation."},
      {name:"Decode", prompt:"What belongs in Decode for OR?", choices:["Write the OR result into R10.","Interpret the OR opcode and identify R2, R9, and R10.","Read the next instruction from memory."], correct:1, explanation:"Decode identifies the logical operation and the registers involved."},
      {name:"Execute", prompt:"What completes the OR instruction?", choices:["Use the ALU to perform bitwise OR and write the result to R10.","Move the instruction into the instruction register.","Interpret the opcode field."], correct:0, explanation:"Execute performs the requested logical operation."}
    ]
  },
  {
    id: "JOB-815", type: "DATA MOVE", priority: "Normal",
    instruction: "MOV R6 → R1",
    description: "Copy the value in R6 into register R1.",
    stages: [
      {name:"Fetch", prompt:"What is the Fetch action for MOV?", choices:["Copy R6 into R1.","Retrieve the MOV instruction from memory using the program counter.","Determine which register is the destination."], correct:1, explanation:"Fetch retrieves the MOV instruction before the processor knows what transfer is requested."},
      {name:"Decode", prompt:"What should Decode determine?", choices:["That MOV copies from R6 to R1.","The final copied value after the transfer.","The next instruction address after execution."], correct:0, explanation:"Decode identifies the MOV operation, its source register, and its destination register."},
      {name:"Execute", prompt:"What belongs in Execute?", choices:["Copy the value from R6 into R1.","Fetch the MOV instruction again.","Interpret the MOV opcode."], correct:0, explanation:"Execute performs the requested data transfer."}
    ]
  },
  {
    id: "JOB-904", type: "CONTROL", priority: "High",
    instruction: "BEQ R3, R4, DONE",
    description: "Branch to DONE if R3 and R4 contain equal values.",
    stages: [
      {name:"Fetch", prompt:"How does BEQ begin?", choices:["Compare R3 and R4 immediately.","Read the BEQ instruction from memory using the program counter.","Jump to DONE before decoding."], correct:1, explanation:"Every instruction, including branches, first has to be fetched."},
      {name:"Decode", prompt:"What information is identified during Decode?", choices:["That BEQ compares R3 and R4 and may branch to DONE.","Whether R3 and R4 are already equal.","The final branch decision and program-counter value."], correct:0, explanation:"Decode identifies the branch condition, operands, and target."},
      {name:"Execute", prompt:"What should happen during Execute?", choices:["Compare R3 and R4 and update the program counter to DONE if they are equal.","Read BEQ from memory.","Interpret the register fields."], correct:0, explanation:"Execute performs the comparison and applies the control-flow decision."}
    ]
  },
  {
    id: "JOB-988", type: "LOGIC", priority: "High",
    instruction: "XOR R7, R8 → R5",
    description: "Perform a bitwise XOR on R7 and R8, storing the result in R5.",
    stages: [
      {name:"Fetch", prompt:"What belongs at Fetch for XOR?", choices:["Read the XOR instruction from memory at the current program-counter address.","Perform XOR in the ALU.","Choose R5 as the destination register."], correct:0, explanation:"Fetch retrieves the instruction itself from memory."},
      {name:"Decode", prompt:"What does Decode do for XOR?", choices:["Interpret XOR and identify R7, R8, and R5.","Calculate the XOR result.","Retrieve the instruction from memory."], correct:0, explanation:"Decode identifies the operation and its register operands."},
      {name:"Execute", prompt:"What completes this XOR ticket?", choices:["Interpret the opcode.","Use the ALU to XOR R7 and R8 and write the result to R5.","Fetch the next instruction."], correct:1, explanation:"Execute performs the actual XOR calculation and writes the result."}
    ]
  }
];