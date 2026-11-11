export const TOPICS = [
  { key: "pointers", label: "Pointers / Memory Addressing", tier: "main" },
  { key: "twos", label: "Two's Complement / Signed Integers", tier: "main" },
  { key: "float", label: "IEEE 754 / Floating Point", tier: "main" },
  { key: "boolean", label: "Boolean Logic / Circuits", tier: "main" },
  { key: "branching", label: "Branching / Control Flow", tier: "main" },
  { key: "registers", label: "x86 Registers", tier: "main" },
  { key: "endian", label: "Endianness", tier: "overtime" },
  { key: "threads", label: "Multithreading / Race Conditions", tier: "overtime" },
  { key: "parallel", label: "GPU / Parallelism", tier: "overtime" },
  { key: "hierarchy", label: "Memory Hierarchy / Cache", tier: "overtime" }
];

const step = (name, short, prompt, choices, correct, explanation, hint = "") => ({
  name, short, prompt, choices, correct, explanation, hint
});

export const JOBS = [
  {
    id: "PTR-101", tier: "main", topic: "pointers", priority: "Normal", pay: 28,
    symptom: "My program reads the first score correctly, but after I move to the next item it starts pulling garbage values.",
    instruction: "Pointer arithmetic is landing on the wrong address.",
    description: "Trace how the pointer advances, correct the address calculation, and verify the next element.",
    stages: [
      step("Trace address", "Follow the pointer", "An int pointer starts at address 0x1000. On a 4-byte int system, where should p + 1 point?", ["0x1001", "0x1002", "0x1004"], 2, "Pointer arithmetic advances by the size of the pointed-to type, so an int pointer moves 4 bytes.", "Think in elements, not raw bytes."),
      step("Repair pointer", "Fix the offset", "The code manually adds 1 byte to reach the next int. What is the best repair?", ["Advance by sizeof(int) bytes or use p + 1", "Add 2 bytes instead", "Change the int to a char"], 0, "Using p + 1 lets C scale the address by sizeof(int), avoiding a misaligned element address."),
      step("Verify read", "Confirm the value", "After the fix, what should be verified?", ["That the pointer now lands on the next valid int element", "That the pointer never changes", "That every value becomes zero"], 0, "The repair is successful when the pointer advances to the next intended element and reads valid data.")
    ]
  },
  {
    id: "PTR-118", tier: "main", topic: "pointers", priority: "High", pay: 34,
    symptom: "A function says it changed my variable, but when it returns the original value is exactly the same.",
    instruction: "The function is changing a copy instead of the caller's value.",
    description: "Identify the missing address handoff, repair the parameter, and verify the caller changes.",
    stages: [
      step("Inspect call", "Check the argument", "Which call gives a function access to the original integer x?", ["repair(x)", "repair(&x)", "repair(*x)"], 1, "Passing &x sends the address of x so the function can modify the caller's variable."),
      step("Dereference", "Write through pointer", "Inside void repair(int *p), which statement changes the original value?", ["p = 10;", "&p = 10;", "*p = 10;"], 2, "Dereferencing p with *p writes to the memory location that p points to."),
      step("Verify caller", "Confirm persistence", "What proves the repair worked?", ["x has the new value after repair returns", "The pointer variable p has a new address", "The function uses no parameters"], 0, "A pointer-based update is successful when the caller's original variable reflects the change.")
    ]
  },
  {
    id: "INT-204", tier: "main", topic: "twos", priority: "High", pay: 32,
    symptom: "An 8-bit signed counter was at 127. I added one and it suddenly became -128.",
    instruction: "Signed overflow wrapped the two's-complement bit pattern.",
    description: "Interpret the sign bit, recognize the signed range, and choose a safe repair.",
    stages: [
      step("Read bits", "Interpret signed data", "In 8-bit two's complement, what value does 10000000 represent?", ["128", "-128", "-127"], 1, "For 8-bit two's complement, 10000000 is the minimum representable value: -128."),
      step("Check range", "Find the limit", "What is the valid range of an 8-bit signed two's-complement integer?", ["-128 to 127", "-127 to 128", "0 to 255"], 0, "An 8-bit signed value reserves the top bit for sign, giving a range from -128 through 127."),
      step("Repair storage", "Prevent overflow", "What is the safest fix if the counter must exceed 127?", ["Use a wider signed integer type", "Keep adding and ignore the wrap", "Flip the sign bit manually"], 0, "A wider type increases the representable range and avoids the 8-bit overflow.")
    ]
  },
  {
    id: "INT-221", tier: "main", topic: "twos", priority: "Normal", pay: 27,
    symptom: "The bits 11111110 are showing up as 254 in one place, but this field is supposed to be signed.",
    instruction: "The same bit pattern is being interpreted with the wrong signedness.",
    description: "Decode the bit pattern as two's complement and verify the signed interpretation.",
    stages: [
      step("Inspect sign", "Check the high bit", "For an 8-bit signed value, what does a leading 1 usually indicate?", ["A negative number", "A floating-point number", "An ASCII letter"], 0, "In two's complement, the most significant bit participates in the negative-value encoding."),
      step("Decode value", "Convert the bits", "What signed 8-bit value is 11111110?", ["254", "-2", "-126"], 1, "11111110 is -2 in 8-bit two's-complement representation."),
      step("Verify type", "Match interpretation", "What should the program check next?", ["That the field is read using a signed 8-bit type", "That every byte is treated as text", "That the value is multiplied by 2"], 0, "Using the intended signed type makes the bit pattern decode consistently as -2.")
    ]
  },
  {
    id: "FLT-305", tier: "main", topic: "float", priority: "Normal", pay: 30,
    symptom: "My code adds 0.1 and 0.2, but an exact comparison against 0.3 sometimes says they are different.",
    instruction: "Binary floating-point cannot represent every decimal fraction exactly.",
    description: "Recognize representation error, choose a tolerant comparison, and verify the result.",
    stages: [
      step("Inspect precision", "Spot approximation", "Why can 0.1 be slightly imprecise in binary floating point?", ["Its binary fraction repeats and must be rounded", "The CPU stores decimals as text", "0.1 is outside the float range"], 0, "Many decimal fractions repeat in base 2, so IEEE 754 stores a rounded approximation."),
      step("Repair compare", "Use tolerance", "Which comparison is best for values expected to be approximately equal?", ["a == b always", "abs(a - b) < epsilon", "a > b && a < b"], 1, "A small tolerance accounts for expected floating-point rounding error."),
      step("Verify result", "Check acceptable error", "What should verification focus on?", ["Whether the difference is within the application's tolerance", "Whether the values print with no decimal places", "Whether both values are integers"], 0, "Floating-point correctness is often about acceptable numerical error rather than exact bit-for-bit equality.")
    ]
  },
  {
    id: "FLT-319", tier: "main", topic: "float", priority: "High", pay: 36,
    symptom: "A very tiny change disappears when I add it to a much larger floating-point number.",
    instruction: "The smaller value is below the available precision at that magnitude.",
    description: "Identify precision loss, choose a safer numerical approach, and verify the scale.",
    stages: [
      step("Inspect scale", "Compare magnitudes", "What can happen when adding a tiny float to a much larger float?", ["The tiny change can be rounded away", "The large number always becomes zero", "The CPU switches to two's complement"], 0, "Floating-point has finite precision, so a tiny increment can fall below the spacing between representable values."),
      step("Repair math", "Protect precision", "Which change can help when precision matters?", ["Use a higher-precision type such as double", "Convert every value to a pointer", "Force all exponents to zero"], 0, "A higher-precision representation can preserve smaller differences over a wider range."),
      step("Verify scale", "Test edge cases", "What should the technician test after the change?", ["Values with very different magnitudes", "Only the number 1.0", "Only negative integers"], 0, "Testing large and small magnitudes confirms whether the precision issue is actually resolved.")
    ]
  },
  {
    id: "LOG-402", tier: "main", topic: "boolean", priority: "Normal", pay: 29,
    symptom: "An alarm should turn on when sensor A OR sensor B is active, but right now it only turns on when both are active.",
    instruction: "The circuit is using AND where the requirement calls for OR.",
    description: "Read the truth behavior, replace the incorrect gate, and verify all input combinations.",
    stages: [
      step("Read behavior", "Match truth table", "Which gate outputs 1 when either input is 1?", ["AND", "OR", "XOR only"], 1, "OR outputs 1 when A, B, or both inputs are 1."),
      step("Repair gate", "Swap the logic", "What repair matches the customer requirement?", ["Replace AND with OR", "Replace AND with NOT", "Add a second AND gate"], 0, "The requested behavior is directly described by an OR gate."),
      step("Verify table", "Test all inputs", "Which input set should also produce 1 after the repair?", ["A=1, B=0", "A=0, B=0", "Only A=1, B=1"], 0, "With OR logic, either single active input should trigger the output.")
    ]
  },
  {
    id: "LOG-417", tier: "main", topic: "boolean", priority: "High", pay: 35,
    symptom: "A status light should turn on only when two inputs are different, but it also turns on when both inputs are 1.",
    instruction: "The circuit needs XOR behavior instead of OR.",
    description: "Identify the truth-table mismatch, choose XOR, and verify the equal-input cases.",
    stages: [
      step("Inspect table", "Find the pattern", "Which gate outputs 1 only when its two inputs differ?", ["AND", "OR", "XOR"], 2, "XOR is true when exactly one of the two inputs is true."),
      step("Repair logic", "Choose the gate", "What should replace the current OR gate?", ["XOR", "AND", "NOR"], 0, "XOR matches the 'different inputs only' requirement."),
      step("Verify equal", "Test matching inputs", "After the repair, what should XOR output for A=1, B=1?", ["1", "0", "Undefined"], 1, "Equal inputs produce 0 with XOR.")
    ]
  },
  {
    id: "BR-508", tier: "main", topic: "branching", priority: "High", pay: 38,
    symptom: "The program compares two equal values, but instead of jumping to the success block it keeps falling through.",
    instruction: "The conditional branch is not matching the equality condition.",
    description: "Inspect the comparison flags, select the correct branch condition, and verify control flow.",
    stages: [
      step("Inspect flags", "Check comparison", "After CMP finds two values equal, which condition is expected?", ["Zero flag set", "Carry flag must always clear", "No flags change"], 0, "Equality after CMP is represented by the zero condition being true."),
      step("Repair branch", "Choose the jump", "Which x86-style branch matches equality?", ["JNE", "JE/JZ", "JMP only if negative"], 1, "JE or JZ branches when the comparison indicates equality."),
      step("Verify flow", "Follow the target", "What proves the repair worked?", ["Equal values transfer control to the success target", "Every comparison jumps", "The program counter never changes"], 0, "The correct branch should alter control flow only when the equality condition is satisfied.")
    ]
  },
  {
    id: "BR-526", tier: "main", topic: "branching", priority: "Normal", pay: 31,
    symptom: "A loop is supposed to stop when the counter reaches zero, but it keeps repeating forever.",
    instruction: "The loop's exit condition is inverted or testing the wrong branch.",
    description: "Trace the condition, repair the branch decision, and verify termination.",
    stages: [
      step("Trace loop", "Check the exit", "If the loop should stop when count == 0, what must be tested each iteration?", ["Whether count is zero", "Whether count is a pointer", "Whether count is floating point"], 0, "The control-flow decision must directly test the intended termination condition."),
      step("Repair condition", "Fix the branch", "Which structure matches 'repeat while count is not zero'?", ["Branch back while count != 0", "Branch back while count == 0", "Always branch back"], 0, "The loop continues only while the counter remains nonzero."),
      step("Verify stop", "Confirm termination", "What is the key test case?", ["A run where count eventually becomes 0 and exits", "A run with no counter update", "A run that branches unconditionally forever"], 0, "The repaired loop must demonstrate that reaching zero transfers control out of the loop.")
    ]
  },
  {
    id: "REG-603", tier: "main", topic: "registers", priority: "Normal", pay: 30,
    symptom: "The calculation is correct in one register, but the next instruction reads a different register and gets the wrong answer.",
    instruction: "The result is stored in the wrong x86 register for the next operation.",
    description: "Trace the source and destination registers, move the result correctly, and verify the handoff.",
    stages: [
      step("Trace registers", "Follow the value", "If the next instruction expects the result in RAX, what must be true?", ["The result must be placed in RAX before it is used", "The result can stay in any random register", "RAX must always contain zero"], 0, "Register-based code depends on values being in the exact registers expected by later instructions."),
      step("Repair move", "Fix destination", "The result is currently in RBX but the next step reads RAX. What repair is appropriate?", ["MOV RAX, RBX", "MOV RBX, RAX if RBX must stay unchanged", "JMP RBX"], 0, "Moving the value from RBX into RAX places it where the next instruction expects it."),
      step("Verify handoff", "Check the next use", "What should be checked immediately after the move?", ["That the next instruction reads the intended result from RAX", "That every register has the same value", "That memory is never accessed"], 0, "Verification should confirm the consumer instruction sees the correct register value.")
    ]
  },
  {
    id: "REG-619", tier: "main", topic: "registers", priority: "High", pay: 37,
    symptom: "The loop counter changes correctly, but the branch checks a different register so the loop behaves randomly.",
    instruction: "The update and the branch are using different registers.",
    description: "Identify the counter register, align the branch operand, and verify the loop.",
    stages: [
      step("Find counter", "Identify the owner", "If DEC RCX updates the loop counter, which register contains the new counter value?", ["RAX", "RCX", "RDX"], 1, "DEC RCX modifies RCX, so that is the register the branch logic should evaluate."),
      step("Repair check", "Use same register", "What is the cleanest repair if the branch currently compares RDX to zero?", ["Compare RCX to zero instead", "Increment RDX forever", "Move the stack pointer"], 0, "The branch should test the same register that the loop updates."),
      step("Verify loop", "Confirm consistency", "What should the technician verify?", ["Each decrement of RCX affects the branch decision", "The branch ignores RCX", "RCX never changes"], 0, "A correct loop uses a consistent counter register from update through branch decision.")
    ]
  },

  {
    id: "OT-701", tier: "overtime", topic: "endian", priority: "Overtime", pay: 48,
    symptom: "A four-byte value looks completely reversed when I inspect the raw memory on this machine.",
    instruction: "The bytes are being interpreted with the wrong endianness.",
    description: "Identify byte order, reconstruct the value, and verify the representation.",
    stages: [
      step("Inspect bytes", "Read memory order", "On a little-endian machine, which byte of 0x12345678 appears at the lowest address?", ["0x12", "0x34", "0x78"], 2, "Little-endian stores the least significant byte at the lowest memory address."),
      step("Rebuild value", "Apply byte order", "Memory shows 78 56 34 12 from low to high addresses. What 32-bit value is represented?", ["0x78563412", "0x12345678", "0x34127856"], 1, "Reading little-endian byte order reconstructs the value as 0x12345678."),
      step("Verify format", "Match both ends", "What must both systems agree on when exchanging raw multi-byte values?", ["Byte order or a defined conversion", "CPU clock speed", "Register count"], 0, "Consistent byte order or explicit conversion prevents reversed multi-byte values.")
    ]
  },
  {
    id: "OT-718", tier: "overtime", topic: "endian", priority: "Overtime", pay: 52,
    symptom: "Numbers sent over the network arrive with their bytes swapped on one machine.",
    instruction: "Host byte order is being sent without converting to the agreed network order.",
    description: "Identify the byte-order boundary, convert the value, and verify both endpoints.",
    stages: [
      step("Find boundary", "Locate conversion", "Where should byte-order conversion happen?", ["When serializing/deserializing the multi-byte value", "Only when printing text", "Inside the keyboard driver"], 0, "The conversion belongs where host data crosses into a defined external byte order."),
      step("Repair transfer", "Normalize order", "What is the goal of a host-to-network conversion?", ["Put multi-byte values into the agreed network byte order", "Compress every integer", "Turn all bytes into ASCII"], 0, "Normalization ensures different host architectures interpret the transmitted bytes consistently."),
      step("Verify endpoints", "Round-trip test", "What is the best verification?", ["Send a known multi-byte value and confirm both endpoints reconstruct it identically", "Check only one byte", "Ignore values larger than 255"], 0, "A known round-trip value exposes any remaining byte-order mismatch.")
    ]
  },
  {
    id: "OT-803", tier: "overtime", topic: "threads", priority: "Overtime", pay: 55,
    symptom: "Four threads increment the same counter, but the final total is sometimes smaller than expected.",
    instruction: "Concurrent read-modify-write operations are racing.",
    description: "Identify the critical section, protect the shared update, and verify repeatability.",
    stages: [
      step("Find race", "Locate shared state", "Which operation is unsafe when multiple threads perform it on the same counter without synchronization?", ["counter++", "Reading a constant string", "Creating separate local variables"], 0, "counter++ is a read-modify-write sequence that can lose updates when operations overlap."),
      step("Repair critical section", "Synchronize update", "Which repair can protect the shared increment?", ["Use a mutex/lock or an atomic increment", "Add more threads", "Make the counter a float"], 0, "Synchronization makes the shared update atomic with respect to competing threads."),
      step("Verify repeatability", "Stress the fix", "What should repeated test runs show?", ["The expected final count every time", "A different count every run", "Only one thread ever runs"], 0, "A properly synchronized update should produce a stable correct total.")
    ]
  },
  {
    id: "OT-821", tier: "overtime", topic: "threads", priority: "Overtime", pay: 60,
    symptom: "Two worker threads freeze forever: each one is waiting for a lock held by the other.",
    instruction: "The threads have entered a deadlock.",
    description: "Recognize circular lock waiting, choose a consistent lock order, and verify progress.",
    stages: [
      step("Diagnose wait", "Trace locks", "What pattern describes two threads each holding one lock while waiting for the other's lock?", ["Deadlock", "Cache hit", "Floating-point overflow"], 0, "Circular waiting on locks is a classic deadlock condition."),
      step("Repair order", "Break the cycle", "Which strategy helps prevent this deadlock?", ["Acquire shared locks in one consistent global order", "Randomize lock order every time", "Hold every lock forever"], 0, "Consistent lock ordering prevents the circular wait from forming."),
      step("Verify progress", "Run contention test", "What should a stress test confirm?", ["Both threads continue making progress without freezing", "Only one thread can ever start", "The locks are never released"], 0, "The repair is successful when contention no longer produces circular waiting.")
    ]
  },
  {
    id: "OT-906", tier: "overtime", topic: "parallel", priority: "Overtime", pay: 50,
    symptom: "I moved a tiny one-step task to the GPU and somehow made it slower instead of faster.",
    instruction: "Parallel overhead is larger than the useful work.",
    description: "Estimate parallel work, account for transfer/launch overhead, and choose the right processor.",
    stages: [
      step("Inspect workload", "Measure parallel work", "Which workload is most likely to benefit from a GPU?", ["Thousands of independent similar operations", "One tiny serial operation", "A single branch with no data"], 0, "GPUs excel when many similar operations can run in parallel."),
      step("Account overhead", "Include transfer cost", "Why can a tiny GPU job be slower?", ["Launch and data-transfer overhead can dominate", "GPUs cannot do arithmetic", "The CPU has no registers"], 0, "For small workloads, setup and transfer costs can exceed the time saved by parallel execution."),
      step("Choose device", "Match hardware", "What is the best repair for this tiny serial task?", ["Keep it on the CPU", "Force more GPU threads regardless of work", "Convert the task to floating point"], 0, "A CPU is often the better choice when the job is too small or too serial to amortize GPU overhead.")
    ]
  },
  {
    id: "OT-919", tier: "overtime", topic: "parallel", priority: "Overtime", pay: 58,
    symptom: "We split a calculation across many workers, but every step needs the result from the step before it.",
    instruction: "The workload has a strong serial dependency.",
    description: "Find the dependency chain, isolate parallel sections, and verify useful concurrency.",
    stages: [
      step("Trace dependency", "Find serial work", "If step B cannot start until step A finishes, what does that indicate?", ["A dependency that limits parallelism", "A cache hit", "A pointer alias is impossible"], 0, "Dependent steps cannot execute simultaneously without changing the algorithm."),
      step("Repair schedule", "Parallelize safe work", "What is the right strategy?", ["Parallelize only independent portions and keep dependent steps ordered", "Run dependent steps in random order", "Duplicate every result"], 0, "Correct parallelization respects data dependencies while exploiting independent work."),
      step("Verify speedup", "Measure real gain", "What should be measured after the change?", ["Whether independent work overlaps and total runtime improves", "Only the number of threads created", "Only CPU clock frequency"], 0, "Useful parallelism is demonstrated by correct overlapping work and a measurable runtime improvement.")
    ]
  },
  {
    id: "OT-1002", tier: "overtime", topic: "hierarchy", priority: "Overtime", pay: 53,
    symptom: "Walking through an array in order is fast, but jumping around randomly through the same data is much slower.",
    instruction: "The random access pattern has poor cache locality.",
    description: "Identify locality, choose a cache-friendly access pattern, and verify hit behavior.",
    stages: [
      step("Inspect locality", "Compare access patterns", "Why is sequential array access often faster?", ["Nearby data is likely to arrive in the same cache line", "RAM becomes faster when addresses increase", "Sequential code disables the cache"], 0, "Spatial locality lets one cache-line fetch serve multiple nearby accesses."),
      step("Repair pattern", "Improve locality", "Which change is most likely to help?", ["Process nearby elements together", "Randomize every index", "Flush the cache after each read"], 0, "Grouping nearby accesses improves the chance that needed data is already in cache."),
      step("Verify cache", "Measure behavior", "What result supports the diagnosis?", ["Fewer costly misses and faster repeated access", "More random jumps", "A lower source-code line count"], 0, "Improved cache behavior should reduce expensive misses and improve observed runtime.")
    ]
  },
  {
    id: "OT-1025", tier: "overtime", topic: "hierarchy", priority: "Overtime", pay: 57,
    symptom: "A program repeatedly scans a data set that is much larger than the cache and keeps stalling on memory.",
    instruction: "The working set is overflowing the useful cache capacity.",
    description: "Identify the working-set problem, improve blocking/locality, and verify memory stalls.",
    stages: [
      step("Inspect working set", "Compare size to cache", "What happens when the actively reused data is much larger than cache capacity?", ["Useful cache lines are evicted before reuse", "Every access becomes a guaranteed hit", "Registers move to disk"], 0, "A working set larger than cache capacity can cause frequent eviction and misses."),
      step("Repair access", "Use blocking", "Which technique can improve locality for large data sets?", ["Process the data in smaller cache-friendly blocks", "Access every element in random order", "Disable all reuse"], 0, "Blocking keeps a smaller working subset hot in cache long enough to be reused."),
      step("Verify stalls", "Measure improvement", "What should improve after effective blocking?", ["Cache hit behavior and memory-stall time", "The number of source comments", "The endianness of every integer"], 0, "Better locality should reduce memory stalls and improve cache effectiveness.")
    ]
  }
];
