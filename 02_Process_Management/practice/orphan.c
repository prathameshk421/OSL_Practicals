#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>

int main(){
    pid_t p=fork();

    if(p<0)printf("Fork didn't work!");
    else if(p==0){
        printf("Process Id:%d,Parent Process Id:%d\n",getpid(),getppid());
        sleep(10);
        printf("Child back up !!\n");
        printf("Process Id:%d,Parent Process Id:%d\n",getpid(),getppid());
    }
    else{
        printf("Process Id:%d,Child Process Id:%d\n",getpid(),p);
        printf("Parent Exiting!!\n");
    }
}