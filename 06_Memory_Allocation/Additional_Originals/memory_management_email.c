#include<stdio.h>
#include<limits.h>

int min(int a,int b){
return a>b ? b:a;
}
int max(int a,int b){
return a<b ? b:a;
}
void first_fit(){
printf("FIRST FIT TECHNIQUE!!!\n\n");
int holes[100];
int process[100];
int n,m;

printf("Enter no of Holes: ");
scanf("%d",&n);
printf("Enter no of Process: ");
scanf("%d",&m);

for(int i=0;i<n;i++){
printf("Enter size of hole %d:",i);
scanf("%d",&holes[i]);
}

for(int i=0;i<m;i++){
printf("Enter required memory by Process %d:",i);
scanf("%d",&process[i]);
}

for(int i=0;i<m;i++){
int index_ans=-1;
for(int j=0;j<n;j++){
if(holes[j]>process[i]){
index_ans=j;
break;
}
}
if(index_ans!=-1){
holes[index_ans]-=process[i];
}
printf("Hole allocation index for Process %d: %d\n",i,index_ans);
}
}
void best_fit(){
printf("BEST FIT TECHNIQUE!!!\n\n");
int holes[100];
int process[100];
int n,m;

printf("Enter no of Holes: ");
scanf("%d",&n);
printf("Enter no of Process: ");
scanf("%d",&m);

for(int i=0;i<n;i++){
printf("Enter size of hole %d:",i);
scanf("%d",&holes[i]);
}

for(int i=0;i<m;i++){
printf("Enter required memory by Process %d:",i);
scanf("%d",&process[i]);
}
for(int i=0;i<m;i++){
int min_diff=INT_MAX;
int index_ans=-1;
for(int j=0;j<n;j++){
if(holes[j]<process[i])continue;
int prev=min_diff;
min_diff=min(min_diff,holes[j]-process[i]);
if(prev!=min_diff){
index_ans=j;
}
}
if(index_ans!=-1){
holes[index_ans]-=process[i];
}
printf("Hole allocation index for Process %d: %d\n",i,index_ans);
}
}
void worst_fit(){
printf("WORST FIT TECHNIQUE!!!\n\n");
int holes[100];
int process[100];
int n,m;

printf("Enter no of Holes: ");
scanf("%d",&n);
printf("Enter no of Process: ");
scanf("%d",&m);

for(int i=0;i<n;i++){
printf("Enter size of hole %d:",i);
scanf("%d",&holes[i]);
}

for(int i=0;i<m;i++){
printf("Enter required memory by Process %d:",i);
scanf("%d",&process[i]);
}
for(int i=0;i<m;i++){
int max_diff=INT_MIN;
int index_ans=-1;
for(int j=0;j<n;j++){
if(holes[j]<process[i])continue;
int prev=max_diff;
max_diff=max(max_diff,holes[j]-process[i]);
if(prev!=max_diff){
index_ans=j;
}
}
if(index_ans!=-1){
holes[index_ans]-=process[i];
}
printf("Hole allocation index for Process %d: %d\n",i,index_ans);
}
}
void next_fit(){
printf("NEXT FIT TECHNIQUE!!!\n\n");
int holes[100];
int process[100];
int n,m;

printf("Enter no of Holes: ");
scanf("%d",&n);
printf("Enter no of Process: ");
scanf("%d",&m);

for(int i=0;i<n;i++){
printf("Enter size of hole %d:",i);
scanf("%d",&holes[i]);
}

for(int i=0;i<m;i++){
printf("Enter required memory by Process %d:",i);
scanf("%d",&process[i]);
}
int prev_ind=-1;
printf("Enter Last Allocation Index:\n");
scanf("%d",&prev_ind);
for(int i=0;i<m;i++){
int index_ans=-1;
for(int j=prev_ind+1;j<n;j++){
if(holes[j]<process[i])continue;
index_ans=j;
break;
}
if(index_ans==-1){
for(int j=0;j<=prev_ind;j++){
if(holes[j]<process[i])continue;
index_ans=j;
break;
}
}
if(index_ans!=-1){
holes[index_ans]-=process[i];
prev_ind=index_ans;
}
printf("Hole allocation index for Process %d: %d\n",i,index_ans);
}
}
int main(){
int choice;
printf("MEMORY MANAGEMENT TECHNIQUES!!!\n\n");
printf("Enter choice:\n");
printf("1. First Fit\n");
printf("2. Best Fit\n");
printf("3. Worst Fit\n");
printf("4. Next Fit\n");
printf("5. Exit\n");
for(int i=0;i<100;i++){
printf("Enter choice:");
scanf("%d",&choice);
if(choice==1){
first_fit();
}
if(choice==2){
best_fit();
}
if(choice==3){
worst_fit();
}
if(choice==4){
next_fit();
}
if(choice==5){
break;
}
}
}
