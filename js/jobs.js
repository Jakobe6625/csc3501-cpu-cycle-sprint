export const TOPICS = [
  { key: "arithmetic", label: "ALU / Arithmetic" },
  { key: "logic", label: "Logic / Bitwise" },
  { key: "memory", label: "Memory Access" },
  { key: "registers", label: "Registers / Data Move" },
  { key: "control", label: "Control Flow" },
  { key: "flags", label: "Flags / Comparison" },
  { key: "stack", label: "Stack / Procedure" }
];

const stage = (name, prompt, choices, correct, explanation) => ({ name, prompt, choices, correct, explanation });

export const JOBS = [
  {
    id:"JOB-104", topic:"arithmetic", priority:"Normal", pay:42,
    symptom:"A calculation request needs two register values combined and saved to a third register.",
    instruction:"ADD R1, R2 → R3",
    description:"Add the values in R1 and R2, then store the result in R3.",
    stages:[
      stage("Fetch","What should happen at the Fetch Bench?",["Read the instruction at the program counter from memory into the instruction register.","Add R1 and R2 immediately.","Identify R3 as the destination register."],0,"Fetch retrieves the next encoded instruction from memory using the program counter."),
      stage("Decode","What belongs at the Decode Desk?",["Store the sum into R3.","Interpret ADD and identify R1, R2, and R3.","Retrieve the next instruction from memory."],1,"Decode interprets the opcode and identifies the required operands and destination."),
      stage("Execute","What should happen in the Execute Bay?",["Increment the program counter again.","Interpret the opcode as ADD.","Use the ALU to add R1 and R2 and write the result to R3."],2,"Execute is where the ALU performs the arithmetic operation and writes the result.")
    ]
  },
  {
    id:"JOB-126", topic:"arithmetic", priority:"High", pay:50,
    symptom:"A signed value must be reduced by another register value without changing the source register.",
    instruction:"SUB R8, R3 → R8",
    description:"Subtract R3 from R8 and store the result back into R8.",
    stages:[
      stage("Fetch","How does this SUB repair begin?",["Subtract R3 from R8.","Read the SUB instruction from memory using the program counter.","Identify the two input registers."],1,"The encoded SUB instruction has to be fetched before it can be interpreted."),
      stage("Decode","What does Decode determine?",["Interpret SUB and identify R8 and R3 as operands, with R8 as destination.","Perform the subtraction.","Fetch the instruction bits from memory."],0,"Decode determines the operation and the registers referenced by the instruction."),
      stage("Execute","What completes the repair?",["Read another instruction.","Use the ALU to subtract R3 from R8 and write the result to R8.","Interpret the opcode field."],1,"Execute performs the subtraction and stores the result.")
    ]
  },
  {
    id:"JOB-217", topic:"memory", priority:"High", pay:54,
    symptom:"A program needs a value from a specific memory address copied into a CPU register.",
    instruction:"LOAD R4, [0x20]",
    description:"Load the value stored at memory address 0x20 into register R4.",
    stages:[
      stage("Fetch","How does the LOAD instruction begin?",["Read the LOAD instruction itself from the address pointed to by the program counter.","Immediately read the data at 0x20.","Write the memory value into R4."],0,"The processor fetches the instruction before it knows a LOAD is being requested."),
      stage("Decode","What should the control unit determine?",["The operation is LOAD, the destination is R4, and the referenced address is 0x20.","The final data value in R4.","The next instruction after LOAD."],0,"Decode identifies the LOAD opcode, destination register, and address information."),
      stage("Execute","Which action completes this LOAD?",["Translate the opcode again.","Read the data at 0x20 and place it into R4.","Fetch the LOAD instruction again."],1,"Execute performs the requested memory access and updates the destination register.")
    ]
  },
  {
    id:"JOB-244", topic:"memory", priority:"Normal", pay:46,
    symptom:"A register value needs to be written out to a specific location in main memory.",
    instruction:"STORE R2, [0x40]",
    description:"Store the value in R2 into memory address 0x40.",
    stages:[
      stage("Fetch","What is the first CPU-cycle action?",["Write R2 to 0x40.","Read the STORE instruction from memory using the program counter.","Identify R2 as the source."],1,"The STORE instruction must be fetched before the processor knows what operation to perform."),
      stage("Decode","What information is established during Decode?",["The STORE opcode, source R2, and target address 0x40.","The next program-counter value only.","The successful memory write itself."],0,"Decode identifies the operation and the source/address information."),
      stage("Execute","What completes the STORE ticket?",["Place the value from R2 into memory location 0x40.","Interpret the opcode as STORE.","Move STORE into the instruction register."],0,"Execute performs the requested write to memory.")
    ]
  },
  {
    id:"JOB-308", topic:"logic", priority:"Normal", pay:44,
    symptom:"Two bit patterns need to be masked so only bits set in both inputs remain set.",
    instruction:"AND R5, R6 → R7",
    description:"Perform a bitwise AND on R5 and R6, storing the result in R7.",
    stages:[
      stage("Fetch","What belongs in Fetch?",["Perform AND in the ALU.","Read the AND instruction from memory using the program counter.","Determine the source registers."],1,"Fetch obtains the instruction regardless of the instruction type."),
      stage("Decode","What should happen during Decode?",["Identify AND, source registers R5 and R6, and destination R7.","Write the final result into R7.","Read the next instruction."],0,"Decode identifies the logical operation and participating registers."),
      stage("Execute","What action belongs in Execute?",["Use the ALU to perform bitwise AND and write the result to R7.","Move instruction bits into the instruction register.","Determine which opcode means AND."],0,"The actual bitwise operation is performed during Execute.")
    ]
  },
  {
    id:"JOB-331", topic:"logic", priority:"High", pay:52,
    symptom:"A bit field needs selected bits toggled whenever the two input bits differ.",
    instruction:"XOR R7, R8 → R5",
    description:"Perform a bitwise XOR on R7 and R8, storing the result in R5.",
    stages:[
      stage("Fetch","What belongs at Fetch for XOR?",["Read the XOR instruction from memory at the current program-counter address.","Perform XOR in the ALU.","Choose R5 as the destination."],0,"Fetch retrieves the instruction itself from memory."),
      stage("Decode","What does Decode do for XOR?",["Interpret XOR and identify R7, R8, and R5.","Calculate the XOR result.","Retrieve the instruction from memory."],0,"Decode identifies the operation and its register operands."),
      stage("Execute","What completes this XOR ticket?",["Interpret the opcode.","Use the ALU to XOR R7 and R8 and write the result to R5.","Fetch the next instruction."],1,"Execute performs the XOR calculation and writes the result.")
    ]
  },
  {
    id:"JOB-402", topic:"registers", priority:"Normal", pay:38,
    symptom:"A value needs to move between CPU registers without changing the source.",
    instruction:"MOV R6 → R1",
    description:"Copy the value in R6 into register R1.",
    stages:[
      stage("Fetch","What is the Fetch action for MOV?",["Copy R6 into R1.","Retrieve the MOV instruction from memory using the program counter.","Choose the destination register."],1,"Fetch retrieves MOV before the processor knows what transfer is requested."),
      stage("Decode","What should Decode determine?",["MOV copies from R6 to R1.","The final copied value.","The next instruction address."],0,"Decode identifies the MOV operation, source, and destination registers."),
      stage("Execute","What belongs in Execute?",["Copy the value from R6 into R1.","Fetch MOV again.","Interpret the MOV opcode."],0,"Execute performs the requested register transfer.")
    ]
  },
  {
    id:"JOB-438", topic:"registers", priority:"Normal", pay:40,
    symptom:"A small constant needs to be placed directly into a general-purpose register.",
    instruction:"MOV #12 → R4",
    description:"Place the immediate value 12 into register R4.",
    stages:[
      stage("Fetch","How does this immediate MOV begin?",["Write 12 into R4.","Fetch the MOV-immediate instruction from memory.","Convert 12 to decimal."],1,"The CPU first fetches the encoded instruction containing the immediate operand."),
      stage("Decode","What is identified during Decode?",["MOV is requested, R4 is the destination, and 12 is an immediate operand.","R4 already contains 12.","The next instruction must be a branch."],0,"Decode distinguishes an immediate operand from a register or memory operand."),
      stage("Execute","What action completes the instruction?",["Write the immediate value 12 into R4.","Fetch the same instruction again.","Only increment the program counter."],0,"Execute performs the data movement into the destination register.")
    ]
  },
  {
    id:"JOB-523", topic:"control", priority:"High", pay:58,
    symptom:"Program flow may need to jump to LOOP depending on whether two registers differ.",
    instruction:"BNE R1, R2, LOOP",
    description:"Branch to LOOP if the values in R1 and R2 are not equal.",
    stages:[
      stage("Fetch","How does this branch enter the CPU cycle?",["Compare R1 and R2 immediately.","Read BNE from memory at the current program-counter address.","Jump to LOOP before interpreting it."],1,"Even a branch begins by fetching the instruction."),
      stage("Decode","What should Decode determine?",["BNE compares R1 and R2 and may change control flow to LOOP.","Whether R1 and R2 are actually different.","The final program-counter value."],0,"Decode identifies the branch condition, operands, and target."),
      stage("Execute","Which action belongs in Execute?",["Read BNE from memory.","Interpret the register fields.","Compare R1 and R2 and update the program counter to LOOP if they differ."],2,"Execute performs the comparison and applies the branch decision.")
    ]
  },
  {
    id:"JOB-547", topic:"control", priority:"High", pay:58,
    symptom:"Program flow may need to jump to DONE when two register values match.",
    instruction:"BEQ R3, R4, DONE",
    description:"Branch to DONE if R3 and R4 contain equal values.",
    stages:[
      stage("Fetch","How does BEQ begin?",["Compare R3 and R4 immediately.","Read BEQ from memory using the program counter.","Jump to DONE before decoding."],1,"Every instruction, including a branch, first has to be fetched."),
      stage("Decode","What information is identified?",["BEQ compares R3 and R4 and may branch to DONE.","Whether R3 and R4 are already equal.","The final branch decision."],0,"Decode identifies the branch condition, operands, and target."),
      stage("Execute","What happens during Execute?",["Compare R3 and R4 and update the program counter to DONE if equal.","Read BEQ from memory.","Interpret the register fields."],0,"Execute performs the comparison and applies control flow.")
    ]
  },
  {
    id:"JOB-611", topic:"flags", priority:"Normal", pay:47,
    symptom:"A later branch needs condition flags set from comparing two registers, but no result should be stored.",
    instruction:"CMP R2, R5",
    description:"Compare R2 and R5 and update condition flags.",
    stages:[
      stage("Fetch","What happens first for CMP?",["Compare R2 and R5 now.","Fetch the CMP instruction using the program counter.","Clear every condition flag."],1,"CMP still begins with a normal instruction fetch."),
      stage("Decode","What does Decode identify?",["CMP uses R2 and R5 to update flags without storing an arithmetic result.","The final Zero flag value before comparing.","A memory write destination."],0,"Decode identifies the compare operation and its register operands."),
      stage("Execute","What completes CMP?",["Use the ALU to compare R2 and R5 and update condition flags.","Copy R2 into R5.","Fetch CMP a second time."],0,"Execute performs the comparison and updates status flags such as Zero or Negative.")
    ]
  },
  {
    id:"JOB-645", topic:"flags", priority:"High", pay:51,
    symptom:"A register value must be tested against zero so the CPU can update status flags for a later decision.",
    instruction:"CMP R9, #0",
    description:"Compare R9 with zero and update condition flags.",
    stages:[
      stage("Fetch","What should happen first?",["Fetch the CMP-immediate instruction from memory.","Set the Zero flag immediately.","Branch if R9 is zero."],0,"The comparison cannot occur until the encoded instruction is fetched."),
      stage("Decode","What is determined during Decode?",["CMP uses R9 and the immediate value 0 to update flags.","The branch target address.","A destination register for the result."],0,"Decode identifies the compare operation and immediate operand."),
      stage("Execute","What should Execute do?",["Compare R9 with 0 in the ALU and update condition flags.","Store 0 into R9.","Fetch the next instruction twice."],0,"Execute performs the comparison and changes the status flags.")
    ]
  },
  {
    id:"JOB-708", topic:"stack", priority:"Normal", pay:49,
    symptom:"A register value must be saved temporarily before another routine uses the register.",
    instruction:"PUSH R3",
    description:"Push the value in R3 onto the stack.",
    stages:[
      stage("Fetch","How does PUSH begin?",["Write R3 to the stack immediately.","Fetch the PUSH instruction from memory.","Pop the old stack value."],1,"PUSH must first be fetched like every other instruction."),
      stage("Decode","What should Decode identify?",["PUSH needs source register R3 and the stack pointer.","The return address of a future CALL.","A branch target."],0,"Decode identifies the stack operation and the register involved."),
      stage("Execute","What completes PUSH?",["Adjust the stack pointer and store R3 at the new stack location.","Fetch PUSH again.","Move R3 into the program counter."],0,"Execute updates the stack pointer and writes the value to stack memory.")
    ]
  },
  {
    id:"JOB-736", topic:"stack", priority:"High", pay:55,
    symptom:"A previously saved value needs to be restored from the stack into a register.",
    instruction:"POP R3",
    description:"Pop the top stack value into R3.",
    stages:[
      stage("Fetch","What happens first for POP?",["Read stack data into R3 immediately.","Fetch the POP instruction using the program counter.","Increment the stack pointer twice."],1,"The processor first fetches the POP instruction."),
      stage("Decode","What information does Decode establish?",["POP will use the stack pointer and destination register R3.","The exact stack value before reading memory.","A branch target."],0,"Decode identifies the stack operation and destination register."),
      stage("Execute","What action completes POP?",["Read the top stack value into R3 and adjust the stack pointer.","Fetch POP again.","Write R3 back onto the stack."],0,"Execute performs the stack memory read and restores the register.")
    ]
  }
];