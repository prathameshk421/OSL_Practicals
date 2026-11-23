#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>
#include <stdlib.h> 
#include <time.h>

#define SIZE 10

int buffer[SIZE];
int in=0,out=0,running=1;

sem_t full,empty;
pthread_mutex_t mutex;

void show_buffer(){
    printf("Buffer:[ ");
    for(int i=0;i<SIZE;i++){
        if(buffer[i]!=0){
            printf("%d ",buffer[i]);
        }
        else printf("_ ");
    }
    printf("]\n");
}

void * producer(void *arg){
    int id=*((int *)arg);
    while(1){
        sem_wait(&empty);
        pthread_mutex_lock(&mutex);

        if(!running){
            pthread_mutex_unlock(&mutex);
            break;
        }

        int item=(rand()%9)+1;
        buffer[in]=item;
        printf("Producer %d Added %d at %d | ",id,item,in);
        in=(in+1)%SIZE;
        show_buffer();

        pthread_mutex_unlock(&mutex);
        sem_post(&full);

        sleep(1);
    }
    return NULL;
}

void * consumer(void * args){
    int id=*((int *)args);

    while(1){
        sem_wait(&full);
        pthread_mutex_lock(&mutex);

        if(!running){
            pthread_mutex_unlock(&mutex);
            break;
        }
        
        int item=buffer[out];
        buffer[out]=0;
        printf("Consumer %d removed %d from slot %d | ",id,item,out);
        out=(out+1)%SIZE;
        show_buffer();
        
        pthread_mutex_unlock(&mutex);
        sem_post(&empty);

        sleep(2);
    }
    return NULL;
}

int main(){
    int p,c;
    srand(time(NULL));

    printf("Enter No. of Producers:");
    scanf("%d",&p);
    printf("Enter No. of Consumers:");
    scanf("%d",&c);

    pthread_t prod[p],cons[c];
    int p_id[p],c_id[c];

    sem_init(&full,0,0);
    sem_init(&empty,0,SIZE);
    pthread_mutex_init(&mutex,NULL);


    for(int i=0;i<p;i++){
        p_id[i]=i+1;
        pthread_create(&prod[i],NULL,producer,&p_id[i]);        
    }
    for(int i=0;i<c;i++){
        c_id[i]=i+1;
        pthread_create(&cons[i],NULL,consumer,&c_id[i]);
    }

    int ch;
    while((ch=getchar())!='q' && ch!='Q' && ch!=EOF);

    pthread_mutex_lock(&mutex);
    running=0;
    pthread_mutex_unlock(&mutex);
    
    for(int i=0;i<p;i++)sem_post(&empty);
    for(int i=0;i<c;i++)sem_post(&full);

    for(int i=0;i<p;i++)pthread_join(prod[i],NULL);
    for(int i=0;i<c;i++)pthread_join(cons[i],NULL);

    sem_destroy(&full);
    sem_destroy(&empty);
    pthread_mutex_destroy(&mutex);
    
    printf("\n Finished Cleanly!\n");
    return 0;
}