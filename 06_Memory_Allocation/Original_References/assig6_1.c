#include<stdio.h>
void firstFit(int b[],int nb,int p[],int np){
  int block[20],alloc[20];
  for(int i=0;i<nb;i++) block[i]=b[i];
  for(int i=0;i<np;i++) alloc[i]=-1;
  for(int i=0;i<np;i++)
  for(int j=0;j<nb;j++)
  if(block[j]>=p[i]) {alloc[i]=j;block[j]-=p[i];break;}
  printf("\n---First fit---\nProcess\tSize\tBlock\n");
  for(int i=0;i<np;i++) printf("P%d\t%d\t%s\n",i+1,p[i],alloc[i]!=-1?(char[]){'B',(char)('1'+alloc[i]),0}:"Not allocated");
}

void bestFit(int b[],int nb,int p[],int np){
  int block[20],alloc[20];
  for(int i=0;i<nb;i++)block[i]=b[i];
  for(int i=0;i<np;i++)alloc[i]=-1;
  for(int i=0;i<np;i++){
  int best=-1;
  for(int j=0;j<nb;j++)
  if(block[j]>=p[i] && (best==-1 || block[j]<block[best])) best=j;
  if(best!=-1){alloc[i]=best;block[best]-=p[i];}
  }
  printf("\n---Best fit---\nProcess\tSize\tBlock\n");
  for(int i=0;i<np;i++){printf("P%d\t%d\t%s\n",i+1,p[i],alloc[i]!=-1?(char[]){'B',(char)('1'+alloc[i]),0}:"Not allocated");}
}

void worstFit(int b[],int nb,int p[],int np){
  int block[20],alloc[20];
  for(int i=0;i<nb;i++)block[i]=b[i];
  for(int i=0;i<np;i++)alloc[i]=-1;
  for(int i=0;i<np;i++){
  int worst=-1;
  for(int j=0;j<nb;j++)
  if(block[j]>=p[i] && (worst==-1 || block[j]>block[worst])) worst=j;
  if(worst!=-1){alloc[i]=worst;block[worst]-=p[i];}
  }
  printf("\n---Worst fit---\nProcess\tSize\tBlock\n");
  for(int i=0;i<np;i++){printf("P%d\t%d\t%s\n",i+1,p[i],alloc[i]!=-1?(char[]){'B',(char)('1'+alloc[i]),0}:"Not allocated");}
}

int main(){
int blocks[]={100,500,200,300,600};
int procs[]={212,417,112,426};
int nb=5,np=4;
printf("Blocks:100,500,200,300,600\nProcsses:212,417,112,426\n");
firstFit(blocks,nb,procs,np);
bestFit(blocks,nb,procs,np);
worstFit(blocks,nb,procs,np);
return 0;
}
