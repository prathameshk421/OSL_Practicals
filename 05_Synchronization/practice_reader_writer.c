#include<unistd.h>
#include<stdlib.h>
#include<stdio.h>
#include<time.h>
#include<semaphore.h>
#include<pthread.h>

sem_t mutex;
sem_t wrt;
int k=0;
int read_count=0;
int running=1;

void * reader(void * args){
    int id=*((int *) args);

    while(running){
        printf("Reader %d wants to read k",id);
        sem_wait(&mutex);
        read_count++;
        if(read_count==1)sem_wait(&wrt);
        sem_post(&mutex);

        printf("Reader %d has read the value of k as %d",id,k);
        sleep(rand()%5);
        sem_wait(&mutex);
        read_count--;
        if(read_count==0)sem_post(&wrt);
        sem_post(&mutex);
        
        printf("Reader %d has finished reading\n",id);
        sleep(rand()%5);


    }   
    return NULL;
}

void * writer(void * args){
    int id=*((int *)args);

    while(running){
        printf("Writer %d wants to read",id);
        sem_wait(&wrt);
        k++;
        printf("Writer %d has updated k to %d",id,k);
        sleep(rand()%5);
        sem_post(&wrt);

        printf("Writer %d has finished writing\n",id);
        sleep(rand()%5);
    }
    return NULL;
}

int main(){
    int r,w;
    printf("Enter no. of readers:");
    scanf("%d",&r);
    printf("Enter no. of writers:");
    scanf("%d",&w);

    srand(time(NULL));
    sem_init(&wrt,0,1);
    sem_init(&mutex,0,1);

    pthread_t readers[r],writers[w];
    int r_id[r],w_id[w];
    for(int i=0;i<r;i++){
        r_id[i]=i+1;
        pthread_create(&readers[i],NULL,reader,&r_id[i]);
    }
    for(int i=0;i<w;i++){
        w_id[i]=i+1;
        pthread_create(&writers[i],NULL,writer,&w_id[i]);
    }

    printf("\nPress 'q' and Enter to exit the program.\n");

    char choice;
    while (1) {
        choice = getchar();
        if (choice == 'q' || choice == 'Q') {
            running = 0;
            break;
        }
    }

    for(int i=0;i<r;i++)pthread_join(readers[i],NULL);
    for(int i=0;i<w;i++)pthread_join(writers[i],NULL);

    sem_destroy(&wrt);
    sem_destroy(&mutex);

    printf("\nClean up done\n");
    return 0;
}