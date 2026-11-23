#include <bits/stdc++.h>

using namespace std;

#define MAX 20

void print_result(int alloc[], int p[], int np, string title){
    cout << "\n--- " << title << " ---\n";
    cout << "Process\tSize\tBlock\n";

    for(int i=0;i<np;i++){
        cout << "P" << i+1 << "\t" << p[i] << "\t";

        if(alloc[i]!=-1){
            cout << "B" << alloc[i]+1 << "\n";
        }
        else{
            cout << "Not Allocated\n";
        }
    }
}

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

    print_result(alloc,p,np,"First Fit");
}

void nextFit(int b[],int nb,int p[],int np){
    int block[MAX],alloc[MAX];

    for(int i=0;i<nb;i++){
        block[i]=b[i];
    }

    for(int i=0;i<np;i++){
        alloc[i]=-1;
    }

    int last=0;

    for(int i=0;i<np;i++){
        int found=-1;

        for(int k=0;k<nb;k++){
            int j=(last+k)%nb;

            if(block[j]>=p[i]){
                found=j;
                break;
            }
        }

        if(found!=-1){
            alloc[i]=found;
            block[found]=block[found]-p[i];
            last=(found+1)%nb;
        }
    }

    print_result(alloc,p,np,"Next Fit");
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

    print_result(alloc,p,np,"Best Fit");
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

    print_result(alloc,p,np,"Worst Fit");
}

int main(){
    int blocks[MAX],procs[MAX];
    int nb,np;

    cout << "Enter Number of Blocks: ";
    cin >> nb;

    if(nb<1 || nb>MAX){
        cout << "Invalid input\n";
        return 1;
    }

    for(int i=0;i<nb;i++){
        cout << "Enter Size of Block " << i+1 << ": ";
        cin >> blocks[i];
    }

    cout << "Enter Number of Processes: ";
    cin >> np;

    if(np<1 || np>MAX){
        cout << "Invalid input\n";
        return 1;
    }

    for(int i=0;i<np;i++){
        cout << "Enter Size of Process " << i+1 << ": ";
        cin >> procs[i];
    }

    firstFit(blocks,nb,procs,np);
    nextFit(blocks,nb,procs,np);
    bestFit(blocks,nb,procs,np);
    worstFit(blocks,nb,procs,np);

    return 0;
}
