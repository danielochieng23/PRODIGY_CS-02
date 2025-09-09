/* format_string.c */
/* This program has a format string vulnerability */
/* Task: Modify the secret using format string vulnerability */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char secret[] = "SECRETMESSAGE";

int main() {
    char input1[100];
    char input2[100]; 
    char input3[100];
    
    printf("Format String Vulnerability Challenge\n");
    printf("Goal: Change the secret message using format string attacks\n");
    printf("Current secret: %s\n\n", secret);
    
    // Get three inputs from user
    printf("Enter first input: ");
    fgets(input1, sizeof(input1), stdin);
    input1[strcspn(input1, "\n")] = 0;  // Remove newline
    
    printf("Enter second input: ");
    fgets(input2, sizeof(input2), stdin);
    input2[strcspn(input2, "\n")] = 0;  // Remove newline
    
    printf("Enter third input: ");
    fgets(input3, sizeof(input3), stdin);
    input3[strcspn(input3, "\n")] = 0;  // Remove newline
    
    printf("\n--- Processing Inputs ---\n");
    
    // Vulnerable format string - first input
    printf("Processing input1: ");
    printf(input1);  // VULNERABLE: No format string
    printf("\n");
    
    // Vulnerable format string - second input  
    printf("Processing input2: ");
    printf(input2);  // VULNERABLE: No format string
    printf("\n");
    
    // Vulnerable format string - third input
    printf("Processing input3: ");
    printf(input3);  // VULNERABLE: No format string
    printf("\n");
    
    // Show the secret at the end
    printf("\n--- Final Result ---\n");
    printf("Secret is now: %s\n", secret);
    
    // Check if secret was modified
    if (strcmp(secret, "SECRETMESSAGE") != 0) {
        printf("SUCCESS: You have modified the secret!\n");
        return 0;
    } else {
        printf("The secret remains unchanged.\n");
        return 1;
    }
}