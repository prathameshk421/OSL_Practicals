#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <time.h>

#define SIZE 5

int buffer[SIZE];
int in = 0, out = 0;
int running = 1;

sem_t empty, full;
pthread_mutex_t mutex;

void show_buffer() {
    printf("Buffer: [ ");
    for (int i = 0; i < SIZE; i++) {
        if (buffer[i] != 0)
            printf("%d ", buffer[i]);
        else
            printf("_ ");
    }
    printf("]\n");
}

void *producer(void *arg) {
    int id = *(int *)arg;

    while (1) {
        sem_wait(&empty);            // Wait for an empty slot
        pthread_mutex_lock(&mutex);  // Enter critical section

        if (!running) {
            pthread_mutex_unlock(&mutex);
            break;
        }

        int item = (rand() % 9) + 1;
        buffer[in] = item;
        printf("Producer %d added %d at slot %d   | ", id, item, in);
        in = (in + 1) % SIZE;
        show_buffer();

        pthread_mutex_unlock(&mutex); // Leave critical section
        sem_post(&full);              // Signal a filled slot

        sleep(1);                     // Sleep OUTSIDE the lock
    }
    return NULL;
}

void *consumer(void *arg) {
    int id = *(int *)arg;

    while (1) {
        sem_wait(&full);             // Wait for a filled slot
        pthread_mutex_lock(&mutex);  // Enter critical section

        if (!running) {
            pthread_mutex_unlock(&mutex);
            break;
        }

        int item = buffer[out];
        buffer[out] = 0;
        printf("Consumer %d removed %d from slot %d | ", id, item, out);
        out = (out + 1) % SIZE;
        show_buffer();

        pthread_mutex_unlock(&mutex); // Leave critical section
        sem_post(&empty);             // Signal an empty slot

        sleep(2);                     // Sleep OUTSIDE the lock
    }
    return NULL;
}

int main() {
    int p, c;
    srand(time(NULL));

    printf("Enter number of producers: ");
    scanf("%d", &p);
    printf("Enter number of consumers: ");
    scanf("%d", &c);

    pthread_t prod[p], cons[c];
    int p_id[p], c_id[c];

    sem_init(&empty, 0, SIZE); // Initially SIZE empty slots
    sem_init(&full, 0, 0);     // Initially 0 full slots
    pthread_mutex_init(&mutex, NULL);

    printf("\nPress 'q' and Enter to stop.\n\n");
    fflush(stdout);

    for (int i = 0; i < p; i++) {
        p_id[i] = i + 1;
        pthread_create(&prod[i], NULL, producer, &p_id[i]);
    }
    for (int i = 0; i < c; i++) {
        c_id[i] = i + 1;
        pthread_create(&cons[i], NULL, consumer, &c_id[i]);
    }

    int ch;
    while ((ch = getchar()) != 'q' && ch != 'Q' && ch != EOF);

    // Stop all threads cleanly
    pthread_mutex_lock(&mutex);
    running = 0;
    pthread_mutex_unlock(&mutex);

    // Unblock any threads waiting on semaphores
    for (int i = 0; i < p; i++) sem_post(&empty);
    for (int i = 0; i < c; i++) sem_post(&full);

    for (int i = 0; i < p; i++) pthread_join(prod[i], NULL);
    for (int i = 0; i < c; i++) pthread_join(cons[i], NULL);

    sem_destroy(&empty);
    sem_destroy(&full);
    pthread_mutex_destroy(&mutex);

    printf("\nFinished cleanly.\n");
    return 0;
}
