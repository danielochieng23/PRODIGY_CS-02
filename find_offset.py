#!/usr/bin/env python3

import subprocess
import sys

def test_overflow(size):
    payload = "A" * size
    try:
        result = subprocess.run(['./stack', payload], capture_output=True, text=True, timeout=5)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Timeout"
    except Exception as e:
        return -2, "", str(e)

def find_crash_point():
    print("Testing buffer overflow points...")
    
    for i in range(20, 100, 4):
        returncode, stdout, stderr = test_overflow(i)
        print(f"Size {i}: Return code {returncode}")
        
        if returncode != 0 and returncode != 1:
            print(f"Crash detected at size {i}")
            return i
    
    print("No crash detected in range")
    return None

if __name__ == "__main__":
    crash_point = find_crash_point()
    if crash_point:
        print(f"\nBuffer overflow occurs around {crash_point} bytes")
        # Test a few sizes around the crash point
        for size in range(max(20, crash_point-8), crash_point+8, 1):
            returncode, stdout, stderr = test_overflow(size)
            print(f"Size {size}: Return code {returncode}")
    else:
        print("Could not determine crash point")