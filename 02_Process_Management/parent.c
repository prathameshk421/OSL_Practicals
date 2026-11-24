#include<stdio.h>
#include<sys/wait.h>
#include<unistd.h>

int main(int argc, char* argv[]){
if(argc < 2){
    printf("status: %s", argv[0]);
    return 1;
}

    pid_t p = fork();

    if(p<0){
    printf("fork failed!");
}
    else if(p==0){
    printf("child proccess id : %d \nParent proccess if: %d\n", getpid(),getppid());
    char* args[] = {"./fac",argv[1],NULL};
    execvp(args[0],args);
    perror("execvp failed");
}
    else{
    printf("child proccess id : %d \nParent proccess if: %d\n", p,getpid());
    int flag;
    wait(&flag);
    if(WIFEXITED(flag)){
    printf("child exited with status: %d\n", WEXITSTATUS(flag));
}
}
    


}
