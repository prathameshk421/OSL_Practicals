#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define BUF 10

int buffer[BUF], in = 0, out = 0;
sem_t empty, full;
pthread_mutex_t mutex;
int running = 1;

void display_buffer() {
    printf("buffer:[");
    for (int i = 0; i < BUF; i++) {
        if (buffer[i] != 0) {
            printf("%d ", buffer[i]);
        } else {
            printf("_ ");
        }
    }
    printf("]\n");
    fflush(stdout);
}

void *producer(void *arg) {
    int p_id = *((int *)arg);

    while (running) {
        int k = (rand() % 9) + 1; // Generate non-zero random item (1 to 9)

        printf("Producer %d wants to add item %d\n", p_id, k);

        sem_wait(&empty);
        pthread_mutex_lock(&mutex);

        if (!running) {
            pthread_mutex_unlock(&mutex);
            sem_post(&empty);
            break;
        }

        buffer[in] = k; // Fixed: replaced 'i' with 'k'
        printf("Producer %d has added item %d\n", p_id, k);
        in = (in + 1) % BUF;
        display_buffer();
        sleep(rand() % 5 + 1);

        pthread_mutex_unlock(&mutex);
        sem_post(&full);

        printf("Producer %d has finished accessing the buffer\n", p_id);
        usleep(500000); // 0.5s delay for clearer output
    }
    return NULL;
}

void *consumer(void *arg) {
    int c_id = *((int *)arg);

    while (running) {
        printf("Consumer %d wants to consume an item\n", c_id);

        sem_wait(&full);
        pthread_mutex_lock(&mutex);

        if (!running) {
            pthread_mutex_unlock(&mutex);
            sem_post(&full);
            break;
        }

        int item = buffer[out];
        buffer[out] = 0;
        printf("Consumer %d consumed item %d from slot %d\n", c_id, item, out);
        out = (out + 1) % BUF;
        display_buffer();
        sleep(rand() % 5 + 1);

        pthread_mutex_unlock(&mutex);
        sem_post(&empty);

        usleep(900000); // 0.9s delay for clearer output
    }
    return NULL;
}

int main() {
    int p_num, c_num;

    printf("Enter number of producers: ");
    if (scanf("%d", &p_num) != 1)
        return 1;

    printf("Enter number of consumers: ");
    if (scanf("%d", &c_num) != 1)
        return 1;

    pthread_t producers[p_num];
    pthread_t consumers[c_num];

    int producer_ids[p_num];
    int consumer_ids[c_num];

    sem_init(&empty, 0, BUF);
    sem_init(&full, 0, 0);
    pthread_mutex_init(&mutex, NULL);

    for (int i = 0; i < BUF; i++)
        buffer[i] = 0;

    // Create Producer Threads
    for (int i = 0; i < p_num; i++) {
        producer_ids[i] = i + 1;
        pthread_create(&producers[i], NULL, producer, &producer_ids[i]);
    }

    // Create Consumer Threads
    for (int i = 0; i < c_num; i++) {
        consumer_ids[i] = i + 1;
        pthread_create(&consumers[i], NULL, consumer, &consumer_ids[i]);
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

    // Unblock any threads waiting on semaphores so they can read running=0 and terminate
    for (int i = 0; i < p_num; i++)
        sem_post(&empty);
    for (int i = 0; i < c_num; i++)
        sem_post(&full);

    // Join threads
    for (int i = 0; i < p_num; i++)
        pthread_join(producers[i], NULL);
    for (int i = 0; i < c_num; i++)
        pthread_join(consumers[i], NULL);

    sem_destroy(&empty);
    sem_destroy(&full);
    pthread_mutex_destroy(&mutex);

    printf("\nProducer-Consumer finished cleanly.\n");
    return 0;
}
