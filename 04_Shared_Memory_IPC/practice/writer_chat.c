#include<stdio.h>
#include<stdlib.h>
#include<sys/ipc.h>
#include<sys/shm.h>
#include<string.h>

#define SIZE 1024

struct shm_buf{
    int flag;
    char msg[SIZE];
};

int main(){
    key_t key=ftok("chatfile",65);
    int shmid=shmget(key,sizeof(struct shm_buf),0666 | IPC_CREAT);
    struct shm_buf* buf=(struct shm_buf*)shmat(shmid,NULL,0);

    printf("Writer Ready,Enter Ur Message\n");
    buf->flag=0;
    while(1){
        while(buf->flag==1);
        printf("Writer> ");
        fgets(buf->msg,SIZE,stdin);
        buf->msg[strcspn(buf->msg,"\n")]=0;
        buf->flag=1;
        if(strcmp(buf->msg,"exit")==0){
            printf("Exiting!");
            break;
        }
    }   
    shmdt(buf);
    return 0;
}