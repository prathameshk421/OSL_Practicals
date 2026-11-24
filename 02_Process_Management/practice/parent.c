#include<unistd.h>
#include<sys/wait.h>
#include<stdio.h>

int main(int argc,char* argv[]){
    if(argc!=2){
        printf("Argumnet list is wrong\n");
        return 1;
    }
    pid_t child=fork();
    if(child==0){
        printf("Child Process id %d,Parent Process id %d\n",getpid(),getppid());
        char* args[]={"./factorial",argv[1],NULL};
        execvp("./factorial",args);
        perror("execvp Failed");
    }
    else if(child>0){
        printf("Chid Process id:%d , Parent Process id:%d\n",child,getpid());
        int flag;
        wait(&flag);
        if(WIFEXITED(flag)){
            printf("Child Process exited successfully!! Status:%d\n",WEXITSTATUS(flag));
        }
    }
    else{
        printf("Fork failed!!\n");
        return 1;
    }
}