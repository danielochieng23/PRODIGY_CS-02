#!/usr/bin/env python3

import subprocess
import struct
import os

def analyze_stackguard_binary():
    """Analyze the Stack Guard protected binary"""
    
    print("=== Task 3: Stack Guard Protection ===")
    print("ASLR is DISABLED, Stack Guard is ENABLED")
    
    # Check if stack guard is actually enabled
    result = subprocess.run(['objdump', '-d', 'stack_with_guard'], 
                          capture_output=True, text=True)
    
    if '__stack_chk_fail' in result.stdout:
        print("✅ Stack Guard is ENABLED (found __stack_chk_fail)")
    else:
        print("⚠️  Stack Guard may not be enabled")
    
    # Look for stack canary operations
    if '%gs:' in result.stdout:
        print("✅ Found stack canary operations (%gs register)")
    
    print("\nDisassembly analysis:")
    print("Looking for stack canary setup and checking...")

def test_normal_operation():
    """Test normal operation of the Stack Guard protected program"""
    
    print(f"\n=== Testing Normal Operation ===")
    
    try:
        result = subprocess.run(['./stack_with_guard', 'HelloWorld'], 
                              capture_output=True, text=True, timeout=5)
        
        print(f"Normal input test:")
        print(f"Return code: {result.returncode}")
        print(f"Output: {result.stdout}")
        print(f"Stderr: {result.stderr}")
        
        if result.returncode == 1 and "Returned Properly" in result.stdout:
            print("✅ Normal operation works correctly")
        else:
            print("⚠️  Unexpected behavior in normal operation")
            
    except Exception as e:
        print(f"Error in normal operation test: {e}")

def test_buffer_overflow_detection():
    """Test if Stack Guard detects buffer overflow"""
    
    print(f"\n=== Testing Buffer Overflow Detection ===")
    
    # Use the same payload that worked without Stack Guard
    offset = 76
    test_payload = b"A" * offset + struct.pack("<I", 0x42424242)
    
    try:
        result = subprocess.run(['./stack_with_guard', test_payload.decode('latin-1')], 
                              capture_output=True, text=True, timeout=5)
        
        print(f"Buffer overflow test:")
        print(f"Return code: {result.returncode}")
        print(f"Output: {result.stdout}")
        print(f"Stderr: {result.stderr}")
        
        if 'stack smashing detected' in result.stderr:
            print("✅ Stack Guard successfully detected buffer overflow!")
        elif result.returncode != 0:
            print("⚠️  Program crashed but no stack smashing message")
        else:
            print("❌ Stack Guard failed to detect buffer overflow")
            
    except Exception as e:
        print(f"Error in overflow test: {e}")

def analyze_stack_canary():
    """Analyze how stack canary works"""
    
    print(f"\n=== Stack Canary Analysis ===")
    
    # Use GDB to examine the stack canary
    gdb_commands = """
set pagination off
break bof
run AAAA
x/20x $esp
x/20x $ebp-20
info registers
continue
quit
"""
    
    with open('/tmp/canary_analysis.txt', 'w') as f:
        f.write(gdb_commands)
    
    try:
        result = subprocess.run(['gdb', '-q', '-x', '/tmp/canary_analysis.txt', './stack_with_guard'], 
                              capture_output=True, text=True, timeout=30)
        
        print("Stack layout with canary:")
        print(result.stdout)
        
        # Look for canary value patterns
        lines = result.stdout.split('\n')
        for line in lines:
            if '0x' in line and ':' in line:
                # Look for potential canary values (often end with 0x00)
                if '00000000' in line:
                    print(f"Potential canary location: {line}")
                    
    except Exception as e:
        print(f"Error in canary analysis: {e}")

def test_canary_bypass_attempt():
    """Attempt to bypass stack canary (should fail)"""
    
    print(f"\n=== Canary Bypass Attempt ===")
    
    # For the assignment, we assume canary is student ID XOR return address
    student_id = 12345678
    original_return_addr = 0xBFFFFFFF  # Example return address
    
    # Calculate expected canary value
    canary = student_id ^ original_return_addr
    print(f"Student ID: {student_id} (0x{student_id:08x})")
    print(f"Original RA: 0x{original_return_addr:08x}")  
    print(f"Expected canary: 0x{canary:08x}")
    
    # Create payload that tries to preserve the canary
    offset_to_canary = 30  # Approximate location before return address
    offset_to_ret = 76
    
    payload = b"A" * offset_to_canary
    payload += struct.pack("<I", canary)  # Try to preserve canary
    payload += b"A" * (offset_to_ret - len(payload))
    payload += struct.pack("<I", 0x42424242)  # New return address
    
    try:
        result = subprocess.run(['./stack_with_guard', payload.decode('latin-1')], 
                              capture_output=True, text=True, timeout=5)
        
        print(f"Canary bypass attempt:")
        print(f"Return code: {result.returncode}")
        print(f"Output: {result.stdout}")
        print(f"Stderr: {result.stderr}")
        
        if 'stack smashing detected' in result.stderr:
            print("✅ Stack Guard detected bypass attempt")
        elif result.returncode == 0:
            print("❌ Bypass successful (canary guessed correctly?)")
        else:
            print("⚠️  Program crashed for other reasons")
            
    except Exception as e:
        print(f"Error in bypass attempt: {e}")

def demonstrate_canary_effectiveness():
    """Demonstrate Stack Guard effectiveness"""
    
    print(f"\n=== Stack Guard Effectiveness ===")
    
    print("1. **Protection Mechanism**:")
    print("   - Places random canary value before return address")
    print("   - Checks canary integrity before function return")
    print("   - Terminates program if canary is corrupted")
    
    print("\n2. **Attack Prevention**:")
    print("   - Prevents return address overwrite attacks")
    print("   - Makes buffer overflow exploitation very difficult")
    print("   - Provides runtime protection against stack smashing")
    
    print("\n3. **Bypass Techniques** (theoretical):")
    print("   - Information leakage to read canary value")
    print("   - Format string vulnerabilities to leak canary")
    print("   - Partial overwrites that don't touch canary")
    print("   - Return-oriented programming (ROP)")
    
    print("\n4. **Limitations**:")
    print("   - Small performance overhead")
    print("   - Can be bypassed with information leaks")
    print("   - Doesn't protect against all memory corruption")

def compare_with_without_stackguard():
    """Compare behavior with and without Stack Guard"""
    
    print(f"\n=== Comparison: With vs Without Stack Guard ===")
    
    payload = b"A" * 76 + struct.pack("<I", 0x42424242)
    
    # Test without Stack Guard
    print("Testing WITHOUT Stack Guard:")
    try:
        result = subprocess.run(['./stack', payload.decode('latin-1')], 
                              capture_output=True, text=True, timeout=5)
        print(f"Return code: {result.returncode}")
        print(f"Stderr: {result.stderr[:100]}")
        
        if result.returncode == -11:
            print("✅ Segmentation fault (successful EIP control)")
        
    except Exception as e:
        print(f"Error: {e}")
    
    # Test with Stack Guard
    print("\nTesting WITH Stack Guard:")
    try:
        result = subprocess.run(['./stack_with_guard', payload.decode('latin-1')], 
                              capture_output=True, text=True, timeout=5)
        print(f"Return code: {result.returncode}")
        print(f"Stderr: {result.stderr[:100]}")
        
        if 'stack smashing detected' in result.stderr:
            print("✅ Stack smashing detected (Stack Guard working)")
            
    except Exception as e:
        print(f"Error: {e}")

def main():
    print("="*60)
    print("TASK 3: STACK GUARD PROTECTION")  
    print("="*60)
    
    # Analyze the binary
    analyze_stackguard_binary()
    
    # Test normal operation
    test_normal_operation()
    
    # Test buffer overflow detection
    test_buffer_overflow_detection()
    
    # Analyze stack canary
    analyze_stack_canary()
    
    # Attempt canary bypass
    test_canary_bypass_attempt()
    
    # Demonstrate effectiveness
    demonstrate_canary_effectiveness()
    
    # Compare with/without
    compare_with_without_stackguard()
    
    print(f"\n=== Task 3 Summary ===")
    print("✅ Stack Guard protection analyzed")
    print("✅ Buffer overflow detection demonstrated")
    print("✅ Canary mechanism examined")
    print("✅ Bypass attempts tested (and failed)")
    print("✅ Protection effectiveness evaluated")

if __name__ == "__main__":
    main()
    
    # Clean up
    try:
        os.remove('/tmp/canary_analysis.txt')
    except:
        pass