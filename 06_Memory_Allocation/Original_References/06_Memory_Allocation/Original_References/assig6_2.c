#include <stdio.h>
#include <stdlib.h>

void firstFit(int b[], int nb, int p[], int np){
    int *block = malloc(nb * sizeof(int));
    int *alloc = malloc(np * sizeof(int));
    
    for(int i = 0; i < nb; i++) block[i] = b[i];
    for(int i = 0; i < np; i++) alloc[i] = -1;
    
    for(int i = 0; i < np; i++) {
        for(int j = 0; j < nb; j++) {
            if(block[j] >= p[i]) { 
                alloc[i] = j; 
                block[j] -= p[i]; 
                break; 
            }
        }
    }
    
    printf("\n--- First Fit ---\nProcess\tSize\tBlock\n");
    for(int i = 0; i < np; i++) {
        printf("P%d\t%d\t", i+1, p[i]);
        if(alloc[i] != -1) printf("B%d\n", alloc[i] + 1);
        else printf("Not allocated\n");
    }
    
    free(block);
    free(alloc);
}

void nextFit(int b[], int nb, int p[], int np){
    int *block = malloc(nb * sizeof(int));
    int *alloc = malloc(np * sizeof(int));
    
    for(int i = 0; i < nb; i++) block[i] = b[i];
    for(int i = 0; i < np; i++) alloc[i] = -1;
    
    int last = 0; // Tracks the starting position for the next search
    
    for(int i = 0; i < np; i++){
        int count = 0;
        while(count < nb){
            int j = last % nb;
            if(block[j] >= p[i]){
                alloc[i] = j;
                block[j] -= p[i];
                last = (j + 1) % nb; // Move pointer to the next block after allocation
                break;
            }
            last = (last + 1) % nb;
            count++;
        }
    }
    
    printf("\n--- Next Fit ---\nProcess\tSize\tBlock\n");
    for(int i = 0; i < np; i++) {
        printf("P%d\t%d\t", i+1, p[i]);
        if(alloc[i] != -1) printf("B%d\n", alloc[i] + 1);
        else printf("Not allocated\n");
    }
    
    free(block);
    free(alloc);
}

void bestFit(int b[], int nb, int p[], int np){
    int *block = malloc(nb * sizeof(int));
    int *alloc = malloc(np * sizeof(int));
    
    for(int i = 0; i < nb; i++) block[i] = b[i];
    for(int i = 0; i < np; i++) alloc[i] = -1;
    
    for(int i = 0; i < np; i++){
        int best = -1;
        for(int j = 0; j < nb; j++) {
            if(block[j] >= p[i] && (best == -1 || block[j] < block[best])) {
                best = j;
            }
        }
        if(best != -1){ 
            alloc[i] = best; 
            block[best] -= p[i]; 
        }
    }
    
    printf("\n--- Best Fit ---\nProcess\tSize\tBlock\n");
    for(int i = 0; i < np; i++) {
        printf("P%d\t%d\t", i+1, p[i]);
        if(alloc[i] != -1) printf("B%d\n", alloc[i] + 1);
        else printf("Not allocated\n");
    }
    
    free(block);
    free(alloc);
}

void worstFit(int b[], int nb, int p[], int np){
    int *block = malloc(nb * sizeof(int));
    int *alloc = malloc(np * sizeof(int));
    
    for(int i = 0; i < nb; i++) block[i] = b[i];
    for(int i = 0; i < np; i++) alloc[i] = -1;
    
    for(int i = 0; i < np; i++){
        int worst = -1;
        for(int j = 0; j < nb; j++) {
            if(block[j] >= p[i] && (worst == -1 || block[j] > block[worst])) {
                worst = j;
            }
        }
        if(worst != -1){ 
            alloc[i] = worst; 
            block[worst] -= p[i]; 
        }
    }
    
    printf("\n--- Worst Fit ---\nProcess\tSize\tBlock\n");
    for(int i = 0; i < np; i++) {
        printf("P%d\t%d\t", i+1, p[i]);
        if(alloc[i] != -1) printf("B%d\n", alloc[i] + 1);
        else printf("Not allocated\n");
    }
    
    free(block);
    free(alloc);
}

int main(){
    int nb, np;

    printf("Enter the number of memory blocks: ");
    scanf("%d", &nb);
    int *blocks = malloc(nb * sizeof(int));
    
    printf("Enter the sizes of the %d holes:\n", nb);
    for(int i = 0; i < nb; i++){
        printf("Hole %d: ", i + 1);
        scanf("%d", &blocks[i]);
    }

    printf("\nEnter the number of processes: ");
    scanf("%d", &np);
    int *procs = malloc(np * sizeof(int));
    
    printf("Enter the sizes of the %d processes:\n", np);
    for(int i = 0; i < np; i++){
        printf("Process %d: ", i + 1);
        scanf("%d", &procs[i]);
    }
    
    int choice;
    do{
      printf("1. First Fit\n");
      printf("2. Next Fit\n");
      printf("3. Best Fit\n");
      printf("4. Worst Fit\n");
      printf("0. Exit\n");
      printf("Enter your choice: ");
      scanf("%d",&choice);
      
      switch(choice){
        case 1:{
          firstFit(blocks, nb, procs, np);
          break;
        }
        
        case 2:{
          nextFit(blocks, nb, procs, np);
          break;
        }
        
        case 3:{
          bestFit(blocks, nb, procs, np);
          break;
        }
        
        case 4:{
          worstFit(blocks, nb, procs, np);
          break;
        }
        
        case 0:{
          printf("Exiting program:)\n");
          break;
        }
      }
    }while(choice!=0);

    free(blocks);
    free(procs);

    return 0;
}
