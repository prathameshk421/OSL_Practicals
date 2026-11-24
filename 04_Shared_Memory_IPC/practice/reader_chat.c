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
    printf("Reader is ready\n");

    while(1){
        while(buf->flag==0);
        if(strcmp(buf->msg,"exit")==0){
            printf("Chat ended\n");
            break;
        }
        printf("Reader received:%s\n",buf->msg);
        buf->flag=0;
    }
    shmdt(buf);
    shmctl(shmid,IPC_RMID,NULL);
    return 0;
}