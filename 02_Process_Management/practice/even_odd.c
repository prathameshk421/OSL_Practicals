#include<stdio.h>
#include<stdlib.h>
#include<unistd.h>
#include<sys/wait.h>

int main(){
    printf("Enter Number:");
    int n;
    scanf("%d",&n);
    pid_t child=fork();

    if(child==0){
        printf("Process id:%d,Parent Process id:%d\n",getpid(),getppid());
        printf("Odd Numbers: ");
        for(int i=1;i<=n;i+=2){
            printf("%d ",i);
        }
        printf("\n");
    }
    else if(child>0){
        printf("Child Process id:%d,Process id:%d\n",child,getpid());
        printf("Even Numbers: ");
        for(int i=0;i<=n;i+=2){
            printf("%d ",i);
        }
        printf("\n");
        wait(NULL);
        printf("Child Exited\n");
    }
    else{
        printf("Fork failed!!\n");
    }
}