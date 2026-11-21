#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <time.h>

int k = 0;
int readcount = 0;
int running = 1;

sem_t mutex;
sem_t wrt;

void *reader(void *arg) {
    int id = *(int *)arg;

    while (running) {
        printf("\nReader %d wants to read\n", id);

        sem_wait(&mutex);
        readcount++;
        if (readcount == 1)
            sem_wait(&wrt);
        sem_post(&mutex);

        printf("Reader %d is reading, value of k is %d\n", id, k);
        sleep(rand() % 5);

        sem_wait(&mutex);
        readcount--;
        if (readcount == 0)
            sem_post(&wrt);
        sem_post(&mutex);

        printf("Reader %d has finished reading\n", id);
        sleep(rand() % 5);
    }

    return NULL;
}

void *writer(void *arg) {
    int id = *(int *)arg;

    while (running) {
        printf("\nWriter %d wants to write\n", id);

        sem_wait(&wrt);

        k++;
        printf("Writer %d is writing, value of k is now %d\n", id, k);
        sleep(rand() % 5);

        sem_post(&wrt);

        printf("Writer %d has finished writing\n", id);
        sleep(rand() % 5);
    }

    return NULL;
}

int main() {
    int r, w;

    printf("Enter number of readers: ");
    scanf("%d", &r);

    printf("Enter number of writers: ");
    scanf("%d", &w);

    pthread_t readers[r];
    pthread_t writers[w];

    int reader_id[r];
    int writer_id[w];

    srand(time(NULL));

    sem_init(&mutex, 0, 1);
    sem_init(&wrt, 0, 1);

    for (int i = 0; i < r; i++) {
        reader_id[i] = i + 1;
        pthread_create(&readers[i], NULL, reader, &reader_id[i]);
    }

    for (int i = 0; i < w; i++) {
        writer_id[i] = i + 1;
        pthread_create(&writers[i], NULL, writer, &writer_id[i]);
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

    for (int i = 0; i < r; i++) {
        pthread_join(readers[i], NULL);
    }

    for (int i = 0; i < w; i++) {
        pthread_join(writers[i], NULL);
    }

    sem_destroy(&mutex);
    sem_destroy(&wrt);

    printf("\nAll readers and writers have finished.\n");

    return 0;
}
