#include<stdio.h>
#include<unistd.h>
#include<sys/wait.h>
// zombie : parent sleeps , so child gets killed/ zombied fr

int main(){
    pid_t p = fork();
    if(p<0){printf("fork error");}
    else if(p == 0){
    printf("child proccess id: %d \nparent proccess id: %d\n", getpid(),getppid());
    printf("child exiting...");
}
    else{
    printf("parent proccess id: %d and child proccess id: %d \n", getpid(), p);
    sleep(10);
    printf("parent awak again");    
}
}
