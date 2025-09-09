/* stack.c */
/* This program has a buffer overflow vulnerability. */
/* Our task is to exploit this vulnerability */
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int bof(char *str, int studentID)
{
    int bufSize;
    int a = 12;
    int b = 18;
    
    bufSize = 12 + studentID % 32;
    char buffer[bufSize];
    strcpy(buffer, str);
    return 1;
}

int main(int argc, char *argv[])
{
    if(argc < 2) {
        printf("Usage: %s <payload>\n", argv[0]);
        exit(0);
    }
    
    int studentID = 12345678; // PLACEHOLDER - ENTER YOUR STUDENT ID HERE
    bof(argv[1], studentID);
    printf("Returned Properly\n");
    return 1;
}