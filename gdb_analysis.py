#!/usr/bin/env python3

import subprocess
import os

def analyze_with_gdb():
    # Create a pattern to identify the exact offset
    pattern = "A" * 60 + "BBBBCCCCDDDDEEEE"  # 76 bytes total
    
    gdb_commands = f"""
set pagination off
run {pattern}
bt
info registers
x/20x $esp
quit
"""
    
    with open('/tmp/gdb_commands.txt', 'w') as f:
        f.write(gdb_commands)
    
    try:
        result = subprocess.run(['gdb', '-q', '-x', '/tmp/gdb_commands.txt', './stack'], 
                              capture_output=True, text=True, timeout=30)
        print("GDB Output:")
        print(result.stdout)
        if result.stderr:
            print("GDB Stderr:")
            print(result.stderr)
    except Exception as e:
        print(f"Error running GDB: {e}")
    
    # Clean up
    if os.path.exists('/tmp/gdb_commands.txt'):
        os.remove('/tmp/gdb_commands.txt')

if __name__ == "__main__":
    analyze_with_gdb()