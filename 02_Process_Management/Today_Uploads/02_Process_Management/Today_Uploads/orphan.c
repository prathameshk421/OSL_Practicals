#include<stdio.h>
#include<unistd.h>
#include<sys/wait.h>

int main(){
    pid_t p = fork();
    
    if(p<0){
    printf("fork failed");}
    else if(p==0){
    printf("\nChild created \nChild proccess id: %d \nParent proccess id: %d\n", getpid(),getppid());
    sleep(10);
    printf("Child back up!: new parent: %d\n child id: %d",getppid(),getpid());
}
    else{
    printf("parent proccess id: %d \nchild proccess id:%d\n", getpid(), p);
    //printf("parent exiting..");
}


}
