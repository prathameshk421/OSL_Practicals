#include<stdio.h>
#include<unistd.h>
#include<sys/wait.h>

int main(){
    int n;
    printf("enter n upto which u want numbers printed: ");
    scanf("%d", &n);
    pid_t p = fork();
    if(p<0)printf("fork failed! \n");
     if(p == 0){
       printf("child process id : %d , parent id : %d \n" , getpid(), getppid());
       for(int i=1;i<n;i+=2)printf("%d ",i);
     printf("\n");
       
}
    else{
    printf("parent process id : %d , parent of parent id : %d, child id: %d \n" , getpid(), getppid(), p);
       for(int i=0;i<n;i+=2)printf("%d ",i);
    
    wait(NULL);
    printf("child exited successfully!!");

}

    return 0;
}
