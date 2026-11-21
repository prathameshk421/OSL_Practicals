
#include<stdio.h>

#define MAX 20

void firstFit(int b[],int nb,int p[],int np){
    int block[MAX],alloc[MAX];

    for(int i=0;i<nb;i++){
        block[i]=b[i];
    }

    for(int i=0;i<np;i++){
        alloc[i]=-1;
    }

    for(int i=0;i<np;i++){
        for(int j=0;j<nb;j++){
            if(block[j]>=p[i]){
                alloc[i]=j;
                block[j]=block[j]-p[i];
                break;
            }
        }
    }

    printf("\n--- First Fit ---\n");
    printf("Process\tSize\tBlock\n");

    for(int i=0;i<np;i++){
        printf("P%d\t%d\t",i+1,p[i]);

        if(alloc[i]!=-1){
            printf("B%d\n",alloc[i]+1);
        }
        else{
            printf("Not Allocated\n");
        }
    }
}

void bestFit(int b[],int nb,int p[],int np){
    int block[MAX],alloc[MAX];

    for(int i=0;i<nb;i++){
        block[i]=b[i];
    }

    for(int i=0;i<np;i++){
        alloc[i]=-1;
    }

    for(int i=0;i<np;i++){
        int best=-1;

        for(int j=0;j<nb;j++){
            if(block[j]>=p[i] && (best==-1 || block[j]<block[best])){
                best=j;
            }
        }

        if(best!=-1){
            alloc[i]=best;
            block[best]=block[best]-p[i];
        }
    }

    printf("\n--- Best Fit ---\n");
    printf("Process\tSize\tBlock\n");

    for(int i=0;i<np;i++){
        printf("P%d\t%d\t",i+1,p[i]);

        if(alloc[i]!=-1){
            printf("B%d\n",alloc[i]+1);
        }
        else{
            printf("Not Allocated\n");
        }
    }
}

void worstFit(int b[],int nb,int p[],int np){
    int block[MAX],alloc[MAX];

    for(int i=0;i<nb;i++){
        block[i]=b[i];
    }

    for(int i=0;i<np;i++){
        alloc[i]=-1;
    }

    for(int i=0;i<np;i++){
        int worst=-1;

        for(int j=0;j<nb;j++){
            if(block[j]>=p[i] && (worst==-1 || block[j]>block[worst])){
                worst=j;
            }
        }

        if(worst!=-1){
            alloc[i]=worst;
            block[worst]=block[worst]-p[i];
        }
    }

    printf("\n--- Worst Fit ---\n");
    printf("Process\tSize\tBlock\n");

    for(int i=0;i<np;i++){
        printf("P%d\t%d\t",i+1,p[i]);

        if(alloc[i]!=-1){
            printf("B%d\n",alloc[i]+1);
        }
        else{
            printf("Not Allocated\n");
        }
    }
}

int main(){
    int blocks[MAX],procs[MAX];
    int nb,np;

    printf("Enter Number of Blocks: ");
    scanf("%d",&nb);

    if(nb<1 || nb>MAX){
        printf("Invalid input\n");
        return 1;
    }

    for(int i=0;i<nb;i++){
        printf("Enter Size of Block %d: ",i+1);
        scanf("%d",&blocks[i]);
    }

    printf("Enter Number of Processes: ");
    scanf("%d",&np);

    if(np<1 || np>MAX){
        printf("Invalid input\n");
        return 1;
    }

    for(int i=0;i<np;i++){
        printf("Enter Size of Process %d: ",i+1);
        scanf("%d",&procs[i]);
    }

    firstFit(blocks,nb,procs,np);
    bestFit(blocks,nb,procs,np);
    worstFit(blocks,nb,procs,np);

    return 0;
}
